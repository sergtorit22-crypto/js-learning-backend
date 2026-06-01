import React from "react";
import logo192 from "../img/logo192.png";
import jsLogo from "../img/JS logo.png";
import { Link, NavLink } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import useNotificationStore from "../store/useNotificationStore";

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
        <NavLink to="/">
          <img src={jsLogo} className="header-logo" alt="logo" />
        </NavLink>
        {/* Навігаційні посилання */}
        <NavLink to="/" end>
          Головна
        </NavLink>
        <NavLink to="/about">Про проєкт</NavLink>

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
