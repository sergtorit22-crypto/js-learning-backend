import React from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "./store/useUserStore";
import "./Profile.css";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Вітаю, {user?.username}!</h1>
        <h1>Ваша пошта, {user?.email}</h1>
        <p>
          Ваша роль: <strong>{user?.role}</strong>
        </p>

        {user.role === "admin" && (
          <div className="admin-actions">
            <h3>Панель керування:</h3>
            <button onClick={() => navigate("/add-content")}>
              Додати новий урок
            </button>
            {/* 
            <button onClick={() => navigate(`/edit-lesson/${lesson.id}`)}>
              Змінити контент
            </button>
*/}
            <button
              className="delete-btn"
              onClick={() => navigate("/manage-lessons")}
            >
              Змінити або Видалити контент
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
