import React, { useState } from "react";
import useNotificationStore from "../store/useNotificationStore";
import useUserStore from "../store/useUserStore";
import "./Tests.css";
export default function TestSystem({ questions, lessonId }) {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUserStore((state) => state.user);
  const notify = useNotificationStore((state) => state.notify);
  const isCorrect = (q, index) => {
    const userAns = answers[index];
    if (!userAns || !q.correct) return false;
    return (
      userAns.toString().toLowerCase().trim() ===
      q.correct.toString().toLowerCase().trim()
    );
  };

  const handleSubmit = async () => {
    const score = questions.reduce(
      (acc, q, idx) => (isCorrect(q, idx) ? acc + 1 : acc),
      0,
    );
    setShowResults(true);

    // Якщо користувач увійшов — зберігаємо в БД (image_d53973.png)
    if (user && user.id) {
      setIsSubmitting(true);
      try {
        const response = await fetch("http://localhost:5000/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            lesson_id: lessonId,
            score: score,
            total_questions: questions.length,
            completed: true,
          }),
        });
        if (response.ok) {
          // ТУТ ВСТАВЛЯЄМО ПОВІДОМЛЕННЯ ПРО УСПІХ
          notify("Результат тесту успішно збережено! ", "success");
        } else {
          notify("Не вдалося зберегти результат на сервері", "error");
        }
      } catch (err) {
        console.error("Помилка збереження:", err);
        notify(`Помилка підключення до сервера: ${err.message}`, "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="test-container">
      <h3>Тестування</h3>
      {questions.map((q, index) => (
        <div
          key={index}
          style={{
            marginBottom: "15px",
            padding: "10px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <p>
            <strong>{q.question}</strong>
          </p>

          {q.type === "choice" ? (
            q.options.map((opt) => (
              <label key={opt} style={{ display: "block" }}>
                <input
                  type="radio"
                  name={`q-${index}`}
                  disabled={showResults}
                  onChange={() => setAnswers({ ...answers, [index]: opt })}
                />{" "}
                {opt}
              </label>
            ))
          ) : (
            <input
              style={{
                fontSize: "20px",
                width: "50%",
              }}
              type="text"
              disabled={showResults}
              placeholder="Ваша відповідь..."
              onChange={(e) =>
                setAnswers({ ...answers, [index]: e.target.value })
              }
            />
          )}

          {showResults && (
            <span style={{ color: isCorrect(q, index) ? "green" : "red" }}>
              {isCorrect(q, index)
                ? " ✅ Вірно"
                : ` ❌ Помилка (Правильно: ${q.correct})`}
            </span>
          )}
        </div>
      ))}

      {!showResults ? (
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Збереження..." : "Завершити тест"}
        </button>
      ) : (
        <div className="result-info"></div>
      )}
    </div>
  );
}
