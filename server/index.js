const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db"); // Підключення до бази даних PostgreSQL

const app = express();
const PORT = 5000;

// Глобальне проміжне програмне забезпечення (Middleware)
app.use(cors());
app.use(express.json()); // Обробка JSON-даних у запитах від React-фронтенда

//
// 1. АВТЕНТИФІКАЦІЯ ТА РЕЄСТРАЦІЯ КОРИСТУВАЧІВ
//

// Роут реєстрації нового користувача
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Перевірка наявності всіх обов'язкових полів
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Будь ласка, заповніть усі поля" });
    }

    // Перевірка, чи існує користувач із таким же email або логіном
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username],
    );

    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Цей логін або email вже зайняті" });
    }

    // Хешування пароля перед збереженням у базу даних
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Внесення нового користувача до БД (за замовчуванням роль 'student')
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 'student') RETURNING id, username, email, role",
      [username, email, hashedPassword],
    );

    res.json({
      message: "Реєстрація пройшла успішно!",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error("Помилка реєстрації:", err.message);
    res.status(500).send("Помилка сервера при реєстрації");
  }
});

// Роут авторизації (входу) користувача
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Пошук користувача в базі даних за email
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Користувача з таким email не знайдено" });
    }

    // Порівняння введеного пароля із захешованим значенням з бази даних
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(401).json({ message: "Невірний пароль" });
    }

    res.json({
      message: "Вхід успішний",
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
    });
  } catch (err) {
    console.error("Помилка авторизації:", err.message);
    res.status(500).send("Помилка сервера при вході");
  }
});

//
// 2. КЕРУВАННЯ УРОКАМИ ТА ТЕСТАМИ (ОТРИМАННЯ ДАНИХ)
//

// Отримання повного списку уроків разом із тестами та варіантами відповідей
app.get("/lessons", async (req, res) => {
  try {
    // 1. Вибірка всіх наявних уроків
    const lessonsRes = await pool.query(
      "SELECT * FROM lessons ORDER BY id ASC",
    );
    const lessons = lessonsRes.rows;

    for (let lesson of lessons) {
      // 2. Вибірка пов'язаних тестів для кожного окремого уроку
      const testsRes = await pool.query(
        "SELECT * FROM tests WHERE lesson_id = $1 ORDER BY id ASC",
        [lesson.id],
      );
      let tests = testsRes.rows;

      for (let test of tests) {
        // 3. Завантаження варіантів відповідей для поточного тесту
        const optionsRes = await pool.query(
          "SELECT option_text, is_correct FROM options WHERE test_id = $1",
          [test.id],
        );
        const allOptions = optionsRes.rows;

        // Формування структури варіантів залежно від типу запитання
        if (test.type === "choice") {
          test.options = allOptions.map((opt) => opt.option_text);
        } else {
          test.options = []; // Для текстового типу варіанти вибору відсутні
        }

        // Визначення правильної відповіді для верифікації на фронтенді
        const correctRow = allOptions.find((opt) => opt.is_correct === true);
        test.correct = correctRow ? correctRow.option_text : "";
      }

      lesson.tests = tests;
    }

    res.json(lessons);
  } catch (err) {
    console.error("Помилка завантаження уроків:", err.message);
    res.status(500).send("Помилка сервера при отриманні уроків");
  }
});

// Отримання структури одного уроку для форми редагування
app.get("/lessons-edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const lessonRes = await pool.query("SELECT * FROM lessons WHERE id = $1", [
      id,
    ]);

    if (lessonRes.rows.length === 0) {
      return res.status(404).json({ error: "Урок не знайдено" });
    }

    const lesson = lessonRes.rows[0];
    const testsRes = await pool.query(
      "SELECT * FROM tests WHERE lesson_id = $1 ORDER BY id ASC",
      [id],
    );
    const tests = testsRes.rows;

    for (let test of tests) {
      const optionsRes = await pool.query(
        "SELECT option_text as text, is_correct FROM options WHERE test_id = $1",
        [test.id],
      );
      test.options_data = optionsRes.rows;

      const correctRow = optionsRes.rows.find((opt) => opt.is_correct);
      test.correct = correctRow ? correctRow.text : "";
    }

    lesson.tests = tests;
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// 3. ЗБЕРЕЖЕННЯ ТА ПЕРЕГЛЯД РЕЗУЛЬТАТІВ ТЕСТУВАННЯ

// Запис або оновлення результатів тестування за конкретним уроком
app.post("/results", async (req, res) => {
  try {
    const { user_id, lesson_id, score, total_questions, completed } = req.body;

    // Атомарна операція: додавання результату або оновлення існуючого при конфлікті унікальності
    const query = `
      INSERT INTO lesson_results (user_id, lesson_id, score, total_questions, completed, completed_at)
      VALUES ($1, $2, $3, $4, $5, NOW() AT TIME ZONE 'Europe/Kyiv')
      ON CONFLICT (user_id, lesson_id) 
      DO UPDATE SET 
        score = EXCLUDED.score,
        total_questions = EXCLUDED.total_questions,
        completed = EXCLUDED.completed,
        completed_at = NOW() AT TIME ZONE 'Europe/Kyiv'
      RETURNING *;
    `;

    const values = [user_id, lesson_id, score, total_questions, completed];
    const updatedResult = await pool.query(query, values);

    res.status(200).json(updatedResult.rows[0]);
  } catch (err) {
    console.error("Помилка збереження результатів:", err.message);
    res.status(500).json({ error: "Помилка сервера при записі результатів" });
  }
});

// Отримання всіх збережених результатів тестів для особистого профілю користувача
app.get("/lesson_results", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Не вказано ID користувача" });
  }

  try {
    const queryText = `
      SELECT lesson_id, score, total_questions, completed, completed_at
      FROM lesson_results 
      WHERE user_id = $1
    `;

    const results = await pool.query(queryText, [user_id]);
    res.json(results.rows);
  } catch (err) {
    console.error("Помилка виконання запиту результатів:", err);
    res
      .status(500)
      .json({ error: "Помилка сервера при отриманні результатів" });
  }
});

//
// 4. АДМІНІСТРУВАННЯ ВЕБДОДАТКА (ДОДАННЯ, РЕДАГУВАННЯ, ВИДАЛЕННЯ УРОКІВ)
//

// Додавання нового уроку та його тестів з використанням транзакції
app.post("/add-lesson", async (req, res) => {
  const client = await pool.connect();
  try {
    const { title, material, code, questions, created_by } = req.body;

    await client.query("BEGIN"); // Початок транзакції

    // 1. Збереження основної інформації уроку
    const lessonRes = await client.query(
      "INSERT INTO lessons (title, material, code, created_by, created_at) VALUES ($1, $2, $3, $4, NOW() AT TIME ZONE 'Europe/Kyiv') RETURNING id",
      [title, material, code, created_by],
    );
    const lessonId = lessonRes.rows[0].id;

    // 2. Циклічне додавання питань уроку
    for (const q of questions) {
      const testRes = await client.query(
        "INSERT INTO tests (lesson_id, question, type, created_by, created_at) VALUES ($1, $2, $3, $4, NOW() AT TIME ZONE 'Europe/Kyiv') RETURNING id",
        [lessonId, q.question, q.type, created_by],
      );
      const testId = testRes.rows[0].id;

      // 3. Додавання варіантів відповідей залежно від типу запитання
      if (q.type === "choice") {
        for (const opt of q.options) {
          await client.query(
            "INSERT INTO options (test_id, option_text, is_correct) VALUES ($1, $2, $3)",
            [testId, opt.text, opt.is_correct],
          );
        }
      } else if (q.type === "text") {
        await client.query(
          "INSERT INTO options (test_id, option_text, is_correct) VALUES ($1, $2, $3)",
          [testId, q.correct_text, true],
        );
      }
    }

    await client.query("COMMIT"); // Підтвердження транзакції
    res.status(201).json({ message: "Урок успішно додано", lessonId });
  } catch (err) {
    await client.query("ROLLBACK"); // Скасування змін у разі помилки
    console.error("Помилка додавання уроку:", err.message);
    res.status(500).json({ error: "Помилка сервера при створенні уроку" });
  } finally {
    client.release(); // Обов'язкове звільнення клієнта в пул
  }
});

// Редагування та повне оновлення контенту уроку через транзакцію
app.put("/edit-lesson/:id", async (req, res) => {
  const { id } = req.params;
  const { title, material, code, questions, created_by } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Оновлення текстового контенту уроку
    await client.query(
      "UPDATE lessons SET title = $1, material = $2, code = $3 WHERE id = $4",
      [title, material, code, id],
    );

    // 2. Очищення старих тестів (варіанти options видаляються каскадно за ON DELETE CASCADE)
    await client.query("DELETE FROM tests WHERE lesson_id = $1", [id]);

    // 3. Запис оновленої структури запитань
    for (const q of questions) {
      const testRes = await client.query(
        "INSERT INTO tests (lesson_id, question, type, created_by, created_at) VALUES ($1, $2, $3, $4, NOW() AT TIME ZONE 'Europe/Kyiv') RETURNING id",
        [id, q.question, q.type, created_by],
      );
      const testId = testRes.rows[0].id;

      if (q.type === "choice") {
        for (const opt of q.options) {
          await client.query(
            "INSERT INTO options (test_id, option_text, is_correct) VALUES ($1, $2, $3)",
            [testId, opt.text, opt.is_correct],
          );
        }
      } else if (q.type === "text") {
        // Виправлено: явна перевірка типу замість загального else
        await client.query(
          "INSERT INTO options (test_id, option_text, is_correct) VALUES ($1, $2, $3)",
          [testId, q.correct_text, true],
        );
      }
    }

    await client.query("COMMIT");
    res.json({ message: "Урок успішно оновлено" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Помилка редагування уроку:", err);
    res.status(500).json({ error: "Помилка при оновленні уроку" });
  } finally {
    client.release();
  }
});

// Повне видалення уроку з бази даних
app.delete("/lessons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM lessons WHERE id = $1", [id]);
    res.json({ message: "Урок видалено" });
  } catch (err) {
    console.error("Помилка видалення уроку:", err.message);
    res.status(500).send("Помилка сервера при видаленні уроку");
  }
});

//
// 5. ІНІЦІАЛІЗАЦІЯ СЕРВЕРА
//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
