import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "./store/useUserStore";
import useNotificationStore from "./store/useNotificationStore";
import "./Auth.css";

export default function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = useUserStore((state) => state.login);
  const notify = useNotificationStore((state) => state.notify);
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username.length < 3) {
      setError("Логін має бути не менше 3 символів");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Введіть коректну електронну адресу");
      return false;
    }
    if (password.length < 6) {
      setError("Пароль має містити принаймні 6 символів");
      return false;
    }
    setError("");
    return true;
  };
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        "https://js-learning-backend.onrender.com/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        // 1. Повідомляємо про успіх
        notify("Реєстрація успішна! Вітаємо у системі ", "success");

        // 2. АВТОМАТИЧНИЙ ВХІД:

        login(data.user);

        // 3. Перенаправляємо на головну
        navigate("/");
      } else {
        notify(data.message || "Помилка реєстрації", "error");
      }
    } catch (err) {
      console.error("Помилка підключення:", err);
      notify("Сервер недоступний", "error");
    }
  };
  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        <h2 className="auth-title">Реєстрація</h2>

        {error && <div className="error-box">{error}</div>}

        <div className="input-group">
          <label>Логін (Нікнейм)</label>
          <input
            type="text"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ваш логін"
            required
          />
        </div>

        <div className="input-group">
          <label>Електронна пошта</label>
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>

        <div className="input-group">
          <label>Пароль</label>
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Мінімум 6 символів"
            required
          />
        </div>

        <button type="submit" className="auth-button register-btn">
          Створити акаунт
        </button>
      </form>
    </div>
  );
}
