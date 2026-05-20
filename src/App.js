/*import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FullLessonPage from "./leson";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./Profile";
import Registration from "./Registration";
import Login from "./Login";
import { useLocation } from "react-router-dom";
import AddLesson from "./AddLesson";
import ManageLessons from "./ManageLessons";
import EditLesson from "./EditLesson";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";

// Імпорт сторів
import useUserStore from "./store/useUserStore";
import useNotificationStore from "./store/useNotificationStore";

function Content({ lessons, results, fetchUserResults, user, fetchLessons }) {
  useEffect(() => {
    // Оновлюємо список уроків щоразу, коли відкриваємо головну сторінку
    if (typeof fetchLessons === "function") {
      fetchLessons();
    }

    if (user?.id && typeof fetchUserResults === "function") {
      fetchUserResults();
    }
  }, []);
  // Цей рядок гарантує, що у нас ЗАВЖДИ буде масив, навіть якщо з сервера прийшла помилка або null
  const safeResults = Array.isArray(results) ? results : [];

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
    <div className="contentContainer">
      {lessons.map((lesson) => {
        // Тепер ми впевнені, що safeResults має метод .find()
        const lessonResult = safeResults.find(
          (res) => String(res.lesson_id) === String(lesson.id),
        );
        const isFinished = lessonResult && lessonResult.completed;

        return (
          <Link
            to={`/lesson/${lesson.id}`}
            key={lesson.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className="oneContainer"
              style={{
                backgroundColor: isFinished ? "#89faa3" : "#fff",
                border: isFinished ? "1px solid #c3e6cb" : "1px solid #ccc",
              }}
            >
              <p>{lesson.title}</p>
              {isFinished && (
                <div
                  style={{
                    marginTop: "10px",
                    borderTop: "1px dashed #c3e6cb",
                    paddingTop: "5px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#155724",
                      fontWeight: "bold",
                    }}
                  >
                    Результат: {lessonResult.score} /{" "}
                    {lessonResult.total_questions}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#666",
                      fontStyle: "italic",
                    }}
                  >
                    Завершено: {formatDate(lessonResult.completed_at)}
                  </div>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
function LessonWrapper({ lessons }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const selectedLesson = lessons.find(
    (lesson) => String(lesson.id) === String(id),
  );

  if (!selectedLesson) return <div>Урок не знайдено</div>;

  return (
    <div>
      <button onClick={() => navigate("/")}>← Назад на головну</button>
      {/* Передаємо дані уроку та користувача далі }
      <FullLessonPage data={selectedLesson} lessonId={selectedLesson.id} />
    </div>
  );
}

export default function App() {
  const [lessons, setLessons] = useState([]); // Стан для списку уроків з БД

  const [loading, setLoading] = useState(true);

  const { notification } = useNotificationStore();
  // В App.js
  const [userResults, setUserResults] = useState([]); // Стан для результатів
  const { user } = useUserStore(); // Отримуємо поточного юзера зі стору

  const fetchUserResults = async () => {
    if (!user || !user.id) return;
    try {
      // Робимо запит до таблиці LESSON_RESULTS за id користувача
      const response = await fetch(
        `http://localhost:5000/lesson_results?user_id=${user.id}`,
      );
      const data = await response.json();
      setUserResults(data);
    } catch (error) {
      console.error("Помилка завантаження результатів:", error);
    }
  };

  useEffect(() => {
    fetchLessons();
    if (user?.id) {
      fetchUserResults();
    }
  }, user); // Перезавантажуємо, коли користувач логіниться
  // Функція для отримання даних з сервера
  const fetchLessons = async () => {
    try {
      const response = await fetch("http://localhost:5000/lessons");
      const data = await response.json();
      setLessons(data);
      setLoading(false);
    } catch (error) {
      console.error("Помилка завантаження даних:", error);
      setLoading(false);
    }
  };

  // Викликаємо завантаження один раз при монтуванні компонента
  /*useEffect(() => {
    fetchLessons();
  }, []);

  if (loading) return <div>Завантаження уроків...</div>;

  return (
    <BrowserRouter>
      <div className="Wrapper">
        {/* Виводимо  повідомлення }
        {notification && (
          <div className={`custom-notification ${notification.type}`}>
            {notification.text}
          </div>
        )}

        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <Content
                lessons={lessons}
                results={userResults}
                fetchUserResults={fetchUserResults}
                user={user}
                fetchLessons={fetchLessons} // ПЕРЕДАЙ ЦЮ ФУНКЦІЮ СЮДИ
              />
            }
          />
          <Route
            path="/lesson/:id"
            element={<LessonWrapper lessons={lessons} />}
          />
          <Route path="/profile" element={<Profile />} />

          <Route path="/add-content" element={<AddLesson />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manage-lessons" element={<ManageLessons />} />
          <Route path="/edit-lesson/:id" element={<EditLesson />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
*/

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Імпорт головних компонентів та сторінок
import Header from "./components/Header";
import Footer from "./components/Footer";
import Content from "./Content";
import LessonWrapper from "./LessonWrapper";
import Profile from "./Profile";
import Registration from "./Registration";
import Login from "./Login";
import AddLesson from "./AddLesson";
import ManageLessons from "./ManageLessons";
import EditLesson from "./EditLesson";

// Імпорт глобальних сторів стану
import useUserStore from "./store/useUserStore";
import useNotificationStore from "./store/useNotificationStore";

import "./App.css"; // Твої глобальні стилі (включаючи сповіщення)

export default function App() {
  const [lessons, setLessons] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const { notification } = useNotificationStore();
  const { user } = useUserStore();

  // Функція для отримання списку уроків з бази даних
  const fetchLessons = async () => {
    try {
      const response = await fetch("http://localhost:5000/lessons");
      const data = await response.json();
      setLessons(data);
      setLoading(false);
    } catch (error) {
      console.error("Помилка завантаження даних:", error);
      setLoading(false);
    }
  };

  // Функція для отримання результатів тестування поточного користувача
  const fetchUserResults = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(
        `http://localhost:5000/lesson_results?user_id=${user.id}`,
      );
      const data = await response.json();
      setUserResults(data);
    } catch (error) {
      console.error("Помилка завантаження результатів:", error);
    }
  };

  // Завантаження базових даних при зміні стану авторизації користувача
  useEffect(() => {
    fetchLessons();
    if (user?.id) {
      fetchUserResults();
    }
  }, [user]); // Виправлено: масив залежностей тепер оформлений коректно

  if (loading)
    return <div className="loading-screen">Завантаження уроків...</div>;

  return (
    <BrowserRouter>
      <div className="Wrapper">
        {/* Глобальні спливаючі сповіщення системи */}
        {notification && (
          <div className={`custom-notification ${notification.type}`}>
            {notification.text}
          </div>
        )}

        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <Content
                lessons={lessons}
                results={userResults}
                fetchUserResults={fetchUserResults}
                user={user}
                fetchLessons={fetchLessons}
              />
            }
          />
          <Route
            path="/lesson/:id"
            element={<LessonWrapper lessons={lessons} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-content" element={<AddLesson />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manage-lessons" element={<ManageLessons />} />
          <Route path="/edit-lesson/:id" element={<EditLesson />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
