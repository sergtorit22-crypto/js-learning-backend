/*
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Додаємо навігацію
import useNotificationStore from "./store/useNotificationStore";
import "./ManageLessons.css";

export default function ManageLessons() {
  const [lessons, setLessons] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const notify = useNotificationStore((state) => state.notify);
  const navigate = useNavigate(); // Ініціалізуємо навігацію

  const fetchLessons = async () => {
    try {
      const res = await fetch("http://localhost:5000/lessons");
      const data = await res.json();
      setLessons(data);
    } catch (err) {
      console.error("Помилка завантаження:", err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const confirmDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/lessons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        notify("Видалено успішно", "success");
        setDeletingId(null);
        fetchLessons();
      }
    } catch (err) {
      notify("Помилка сервера", "error");
    }
  };

  return (
    <div className="manage-lessons-container">
      <h2 className="lessons-title">Керування уроками</h2>
      <div className="lessons-list">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <div className="lesson-header">
              <span className="lesson-title-text">{lesson.title}</span>

              <div
                className="button-group"
                style={{ display: "flex", gap: "10px" }}
              >
                {/* КНОПКА РЕДАГУВАННЯ }
                {deletingId !== lesson.id && (
                  <button
                    onClick={() => navigate(`/edit-lesson/${lesson.id}`)}
                    className="edit-btn"
                    style={{
                      backgroundColor: "#ffc107",
                      color: "#000",
                      border: "none",
                      padding: "5px 15px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Редагувати
                  </button>
                )}

                {/* КНОПКА ВИДАЛЕННЯ }
                {deletingId !== lesson.id && (
                  <button
                    onClick={() => setDeletingId(lesson.id)}
                    className="delete-btn"
                  >
                    Видалити
                  </button>
                )}
              </div>
            </div>

            {/* ПЛАЖКА ПІДТВЕРДЖЕННЯ ВИДАЛЕННЯ }
            {deletingId === lesson.id && (
              <div className="confirm-box">
                <p className="confirm-text">
                  Ви точно хочете видалити цей урок?
                </p>
                <button
                  onClick={() => confirmDelete(lesson.id)}
                  className="confirm-yes-btn"
                >
                  ТАК
                </button>
                <button
                  onClick={() => setDeletingId(null)}
                  className="confirm-no-btn"
                >
                  НІ
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Кнопка повернення }
      <button
        onClick={() => navigate("/profile")}
        className="back-to-profile"
        style={{ marginTop: "20px", cursor: "pointer" }}
      >
        ← Назад до профілю
      </button>
    </div>
  );
}
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNotificationStore from "./store/useNotificationStore";
import "./ManageLessons.css"; // Імпорт оновленого CSS файлу

export default function ManageLessons() {
  // Стейт для збереження списку уроків та ID уроку, що видаляється
  const [lessons, setLessons] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const notify = useNotificationStore((state) => state.notify);
  const navigate = useNavigate();

  // Завантаження списку уроків з сервера
  const fetchLessons = async () => {
    try {
      const res = await fetch("http://localhost:5000/lessons");
      const data = await res.json();
      setLessons(data);
    } catch (err) {
      console.error("Помилка завантаження:", err);
    }
  };

  // Виклик завантаження при монтуванні компонента
  useEffect(() => {
    fetchLessons();
  }, []);

  // Підтвердження та видалення уроку за його ID
  const confirmDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/lessons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        notify("Видалено успішно", "success");
        setDeletingId(null);
        fetchLessons(); // Оновлення списку після видалення
      }
    } catch (err) {
      notify("Помилка сервера", "error");
    }
  };

  return (
    <div className="manage-lessons-container">
      <h2 className="lessons-title">Керування уроками</h2>

      <div className="lessons-list">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <div className="lesson-header">
              <span className="lesson-title-text">{lesson.title}</span>

              {/* Блок керування кнопками дій */}
              <div className="button-group">
                {/* Кнопка переходу до редагування уроку */}
                {deletingId !== lesson.id && (
                  <button
                    onClick={() => navigate(`/edit-lesson/${lesson.id}`)}
                    className="edit-btn"
                  >
                    Редагувати
                  </button>
                )}

                {/* Кнопка ініціалізації видалення */}
                {deletingId !== lesson.id && (
                  <button
                    onClick={() => setDeletingId(lesson.id)}
                    className="delete-btn"
                  >
                    Видалити
                  </button>
                )}
              </div>
            </div>

            {/* Модальне вікно/плашка підтвердження видалення уроку */}
            {deletingId === lesson.id && (
              <div className="confirm-box">
                <p className="confirm-text">
                  Ви точно хочете видалити цей урок?
                </p>
                <button
                  onClick={() => confirmDelete(lesson.id)}
                  className="confirm-yes-btn"
                >
                  ТАК
                </button>
                <button
                  onClick={() => setDeletingId(null)}
                  className="confirm-no-btn"
                >
                  НІ
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Кнопка навігації назад до профілю */}
      <button onClick={() => navigate("/profile")} className="back-to-profile">
        ← Назад до профілю
      </button>
    </div>
  );
}
