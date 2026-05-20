/*import React from "react";
import logo192 from "../img/logo192.png";

import { Link, NavLink } from "react-router-dom";

import useUserStore from "../store/useUserStore";
import useNotificationStore from "../store/useNotificationStore";

export default function Header() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const notify = useNotificationStore((state) => state.notify);

  const handleLogout = () => {
    logout();
    notify("Ви вийшли з системи", "info");
  };

  return (
    <>
      <header>
        <div className="containerHeader">
          <img src={logo192} style={{ width: "100px" }} alt="logo" />

          <NavLink to="/" end>
            Головна
          </NavLink>

          <NavLink to="/lessons">Уроки</NavLink>

          <NavLink to="/tests">Тести</NavLink>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginLeft: "auto",
              marginRight: "10px ",
            }}
          >
            {user ? (
              <>
                <span
                  style={{ color: "var(--text-muted)", fontWeight: "bold" }}
                >
                  {user.username}
                </span>

                <NavLink to="/profile">Профіль</NavLink>

                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Вийти
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Увійти</NavLink>
                <NavLink to="/register">Реєстрація</NavLink>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
*/

import React from "react";
import logo192 from "../img/logo192.png";
import { Link, NavLink } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import useNotificationStore from "../store/useNotificationStore";
//import "./Header.css"; // Підключення файлу стилів

export default function Header() {
  // Отримання даних користувача та функцій керування станом
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const notify = useNotificationStore((state) => state.notify);

  // Обробка виходу користувача із системи
  const handleLogout = () => {
    logout();
    notify("Ви вийшли з системи", "info");
  };

  return (
    <header className="header">
      <div className="containerHeader">
        {/* Логотип вебдодатка */}
        <img src={logo192} className="header-logo" alt="logo" />

        {/* Навігаційні посилання */}
        <NavLink to="/" end>
          Головна
        </NavLink>
        <NavLink to="/lessons">Уроки</NavLink>
        <NavLink to="/tests">Тести</NavLink>

        {/* Блок автентифікації користувача */}
        <div className="header-auth-block">
          {user ? (
            <>
              {/* Відображення імені авторизованого користувача */}
              <span className="header-username">{user.username}</span>

              <NavLink to="/profile">Профіль</NavLink>

              {/* Кнопка виходу з аккаунту */}
              <button onClick={handleLogout} className="header-logout-btn">
                Вийти
              </button>
            </>
          ) : (
            <>
              {/* Посилання для гостей програми */}
              <NavLink to="/login">Увійти</NavLink>
              <NavLink to="/register">Реєстрація</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
