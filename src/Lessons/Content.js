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
    <div className="main-page-wrapper">
      {/* СУЧАСНИЙ ПРИВІТАЛЬНИЙ БАНЕР */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Інтерактивний курс JavaScript для початківців</h1>
          <p>
            Опануй базові концепції програмування, виконуй практичні завдання
            прямо у вбудованому інтерпретаторі коду та відстежуй свій прогрес у
            реальному часі!
          </p>

          {/* Акуратні кольорові теги-бейджики */}
          <div className="hero-badges">
            <span className="badge-js">JS 2026</span>
            <span className="badge-level">Рівень: Базовий</span>
          </div>
        </div>

        {/* Права частина: Ефектна емблема JavaScript із неоновим підсвічуванням */}
        <div className="hero-image">
          <div className="js-logo-glow">JS</div>
        </div>
      </div>
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
    </div>
  );
}
