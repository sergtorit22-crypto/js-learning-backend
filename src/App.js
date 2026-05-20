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
import About from "./About";

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
      const response = await fetch(
        "https://js-learning-backend.onrender.com/lessons",
      );
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
        `https://js-learning-backend.onrender.com/lesson_results?user_id=${user.id}`,
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
          <Route path="/about" element={<About />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
