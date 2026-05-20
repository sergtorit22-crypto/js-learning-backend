import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Content.css"; // Стилі для сітки та карток уроків

export default function Content({
  lessons,
  results,
  fetchUserResults,
  user,
  fetchLessons,
}) {
  // Оновлення списків при переході користувача на Головну сторінку
  useEffect(() => {
    if (typeof fetchLessons === "function") fetchLessons();
    if (user?.id && typeof fetchUserResults === "function") fetchUserResults();
  }, []);

  // Безпечна перевірка масиву результатів
  const safeResults = Array.isArray(results) ? results : [];

  // Хелпер для форматування дати у локальний формат
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="contentContainer">
      {lessons.map((lesson) => {
        // Пошук проходження тесту для поточного уроку
        const lessonResult = safeResults.find(
          (res) => String(res.lesson_id) === String(lesson.id),
        );
        const isFinished = lessonResult && lessonResult.completed;

        return (
          <Link
            to={`/lesson/${lesson.id}`}
            key={lesson.id}
            className="lesson-link"
          >
            <div
              className={`oneContainer ${isFinished ? "finished" : "not-finished"}`}
            >
              <p className="lesson-card-title">{lesson.title}</p>

              {/* Відображення блоку з балами, якщо урок успішно здано */}
              {isFinished && (
                <div className="result-badge-block">
                  <div className="result-score">
                    Результат: {lessonResult.score} /{" "}
                    {lessonResult.total_questions}
                  </div>
                  <div className="result-date">
                    Завершено: {formatDate(lessonResult.completed_at)}
                  </div>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
