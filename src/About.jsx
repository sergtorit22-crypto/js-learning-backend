import React from "react";

const About = () => {
  return (
    <div className="container" style={{ textAlign: "left", maxWidth: "800px" }}>
      <h1>Про проєкт "JavaScript Learning"</h1>
      <p>
        Цей вебдодаток — це інтерактивна платформа для вивчення основ
        програмування мовою JavaScript. Ми поєднали теорію з практикою, щоб
        кожен користувач міг одразу відчути силу коду.
      </p>

      <h2 style={{ marginTop: "20px", color: "var(--orange-accent)" }}>
        Технологічний стек
      </h2>

      <h3>Frontend</h3>
      <ul>
        <li>
          <strong>React.js</strong> — динамічний інтерфейс.
        </li>
        <li>
          <strong>CodeMirror</strong> — професійний редактор коду з підсвіткою
          синтаксису.
        </li>
        <li>
          <strong>Zustand</strong> — легке керування станом програми.
        </li>
      </ul>

      <h3>Backend</h3>
      <ul>
        <li>
          <strong>Node.js & Express.js</strong> — серверна архітектура та API.
        </li>
        <li>
          <strong>PostgreSQL</strong> — надійна реляційна база даних.
        </li>
      </ul>

      <h3>Деплой та інфраструктура</h3>
      <p>
        Проєкт розгорнуто з використанням <strong>Netlify</strong> (Frontend) та{" "}
        <strong>Render</strong> (Backend). База даних базується на хмарному
        рішенні <strong>Neon</strong>.
      </p>

      <h2 style={{ marginTop: "20px", color: "var(--orange-accent)" }}>
        Чому це працює?
      </h2>
      <p>
        Кожен компонент системи відіграє свою роль: від швидкого обміну даними
        через <strong>Zustand</strong>
        до безпечного виконання коду на сервері через <strong>Express</strong>.
        Це забезпечує стабільну роботу навіть під навантаженням.
      </p>
    </div>
  );
};

export default About;
