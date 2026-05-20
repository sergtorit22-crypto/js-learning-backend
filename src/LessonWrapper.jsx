import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import FullLessonPage from "./leson"; // Твій компонент сторінки уроку

export default function LessonWrapper({ lessons }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Пошук потрібного уроку в загальному масиві за параметром з URL
  const selectedLesson = lessons.find(
    (lesson) => String(lesson.id) === String(id),
  );

  if (!selectedLesson) {
    return <div className="error-message">Урок не знайдено</div>;
  }

  return (
    <div className="lesson-wrapper">
      <button onClick={() => navigate("/")} className="back-btn">
        ← Назад на головну
      </button>
      {/* Передача даних конкретного уроку у детальний перегляд */}
      <FullLessonPage data={selectedLesson} lessonId={selectedLesson.id} />
    </div>
  );
}
