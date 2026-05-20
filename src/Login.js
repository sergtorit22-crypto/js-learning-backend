import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "./store/useUserStore";
import useNotificationStore from "./store/useNotificationStore";
import "./Auth.css"; // Імпортуємо стилі

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Дістаємо функції зі сторів
  const login = useUserStore((state) => state.login);
  const notify = useNotificationStore((state) => state.notify);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Викликаємо сповіщення через окремий стор
        notify(`Вітаємо, ${data.user.username}!`, "success");

        // Зберігаємо користувача в його стор
        login(data.user);
        navigate("/");
      } else {
        // 2. Помилка (невірний пароль або пошта)
        notify(data.message || "Помилка входу", "error");
      }
    } catch (err) {
      // 3. Проблема з мережею
      console.error("Помилка підключення:", err);
      notify("Сервер недоступний. Перевірте з'єднання", "error");
    }
  };

  return (
    <div className="auth-container">
      {" "}
      <form onSubmit={handleLogin} className="auth-form">
        <h2 className="auth-title">Вхід</h2>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Увійти
        </button>
      </form>
    </div>
  );
}
