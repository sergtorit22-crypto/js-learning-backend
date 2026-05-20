import React from "react";

const About = () => {
  return (
    <div
      className="container"
      style={{
        textAlign: "left",
        maxWidth: "850px",
        margin: "40px auto",
        padding: "0 20px",
      }}
    >
      <h1>Про проєкт: JavaScript Learning Platform</h1>

      <p style={{ fontSize: "18px", color: "#64748b", marginBottom: "30px" }}>
        Інтерактивна освітня платформа, створена для ефективного вивчення мови
        програмування JavaScript. Система поєднує теоретичний контент із
        практичним середовищем розробки.
      </p>

      <h2 style={{ color: "var(--orange-accent)" }}>Технологічний стек</h2>

      <h3>Frontend (Клієнтська частина)</h3>
      <ul>
        <li>
          <strong>React.js:</strong> побудова динамічного інтерфейсу
          користувача.
        </li>
        <li>
          <strong>CodeMirror:</strong> інтегрований редактор коду з підсвіткою
          синтаксису.
        </li>
        <li>
          <strong>Zustand:</strong> централізоване сховище стану для управління
          даними користувача (авторизація, сесія)
        </li>
      </ul>

      <h3>Backend та База даних</h3>
      <ul>
        <li>
          <strong>Node.js & Express.js:</strong> серверна архітектура для
          обробки API-запитів та логіки виконання коду.
        </li>
        <li>
          <strong>PostgreSQL:</strong> реляційна база даних для зберігання
          прогресу навчання та результатів тестів.
        </li>
      </ul>

      <h2 style={{ color: "var(--orange-accent)", marginTop: "30px" }}>
        Система тестування
      </h2>
      <p>На платформі реалізована дворівнева підсистема оцінки знань:</p>
      <ul>
        <li>
          <strong>Тестування:</strong> набір контрольних питань після кожного
          уроку для перевірки теоретичних знань.
        </li>
        <li>
          <strong>Аналітика:</strong> система записує результати кожного тесту в
          базу даних, що дозволяє користувачу бачити свою успішність, кількість
          спроб та динаміку навчання в особистому кабінеті.
        </li>
      </ul>

      <h2 style={{ color: "var(--orange-accent)", marginTop: "30px" }}>
        Інфраструктура
      </h2>
      <p>
        Проєкт розгорнуто за допомогою <strong>Netlify</strong> (для Frontend)
        та <strong>Render</strong> (для Backend). Стабільність зберігання даних
        забезпечується хмарним рішенням <strong>Neon (PostgreSQL)</strong>.
      </p>
    </div>
  );
};

export default About;
