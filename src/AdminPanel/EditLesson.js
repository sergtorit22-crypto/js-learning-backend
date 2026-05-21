import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import useNotificationStore from "../store/useNotificationStore";
import "./AddLesson.css"; // Використовуємо ті ж стилі

export default function EditLesson() {
  const { id } = useParams(); // Отримуємо ID уроку з URL
  const user = useUserStore((state) => state.user);
  const notify = useNotificationStore((state) => state.notify);
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState({
    title: "",
    material: "",
    code: "",
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Завантаження даних існуючого уроку
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(
          `https://js-learning-backend.onrender.com/lessons-edit/${id}`,
        );
        if (!response.ok) throw new Error("Урок не знайдено");
        const data = await response.json();

        setLessonData({
          title: data.title,
          material: data.material,
          code: data.code,
        });

        // Форматуємо питання під структуру стейту
        const formattedQuestions = data.tests.map((t) => ({
          id: t.id, // зберігаємо ID для БД
          question: t.question,
          type: t.type,
          options: t.options_data, // масив об'єктів {text, is_correct}
          correct_text: t.type === "text" ? t.correct : "",
        }));
        setQuestions(formattedQuestions);
        setLoading(false);
      } catch (err) {
        notify("Помилка завантаження даних", "error");
        navigate("/profile");
      }
    };
    fetchLesson();
  }, [id, navigate, notify]);

  const autoResize = (e) => {
    const element = e.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "choice",
        options: [{ text: "", is_correct: false }],
        correct_text: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
    notify("Питання видалено локально", "info");
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questions.length === 0)
      return notify("Додайте хоча б одне питання!", "error");

    const payload = { ...lessonData, questions, created_by: user.id };

    try {
      const response = await fetch(
        `https://js-learning-backend.onrender.com/edit-lesson/${id}`,
        {
          method: "PUT", // Використовуємо PUT для оновлення
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        notify("Урок успішно оновлено!", "success");
        navigate("/profile");
      } else {
        const data = await response.json();
        notify(data.error || "Помилка при збереженні", "error");
      }
    } catch (err) {
      notify("Сервер недоступний", "error");
    }
  };

  if (loading) return <div className="admin-container">Завантаження...</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Редагування уроку</h1>
      <form onSubmit={handleSubmit} className="lesson-form">
        {/* Секція 1: Теорія */}
        <section className="section">
          <h2>1. Теоретична частина</h2>
          <input
            type="text"
            className="admin-input"
            value={lessonData.title}
            onChange={(e) =>
              setLessonData({ ...lessonData, title: e.target.value })
            }
            required
          />
          <textarea
            className="auto-resize-textarea"
            value={lessonData.material}
            onChange={(e) =>
              setLessonData({ ...lessonData, material: e.target.value })
            }
            onInput={autoResize}
            required
          />
          <textarea
            className="code-input auto-resize"
            value={lessonData.code}
            onChange={(e) =>
              setLessonData({ ...lessonData, code: e.target.value })
            }
            onInput={autoResize}
          />
        </section>

        {/* Секція 2: Тести */}
        <section className="section">
          <h2>2. Тестові завдання</h2>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="question-block">
              <div className="q-header">
                <h3>Питання №{qIndex + 1}</h3>
                <button
                  type="button"
                  className="del-btn"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Видалити
                </button>
              </div>
              <textarea
                className="question-textarea"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question", e.target.value)
                }
                required
                onInput={autoResize}
              />
              <select
                className="type-select"
                value={q.type}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "type", e.target.value)
                }
              >
                <option value="choice">Вибір (choice)</option>
                <option value="text">Введення (text)</option>
              </select>

              {q.type === "choice" ? (
                <div className="options-area">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="option-row">
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const upd = [...questions];
                          upd[qIndex].options[oIndex].text = e.target.value;
                          setQuestions(upd);
                        }}
                        required
                      />
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={opt.is_correct}
                        onChange={() => {
                          const upd = [...questions];
                          upd[qIndex].options.forEach(
                            (o, i) => (o.is_correct = i === oIndex),
                          );
                          setQuestions(upd);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-opt-btn"
                    onClick={() => {
                      const upd = [...questions];
                      upd[qIndex].options.push({ text: "", is_correct: false });
                      setQuestions(upd);
                    }}
                  >
                    + Варіант
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  className="text-answer-input"
                  placeholder="Правильна відповідь"
                  value={q.correct_text}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "correct_text", e.target.value)
                  }
                  required
                />
              )}
            </div>
          ))}
          <button type="button" onClick={addQuestion} className="add-btn">
            + Додати питання
          </button>
        </section>

        <button type="submit" className="save-btn">
          Зберегти зміни
        </button>
      </form>
    </div>
  );
}
