/*import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import useNotificationStore from "../store/useNotificationStore";
import "./AddLesson.css";

/* global CodeMirror

export default function AddLesson() {
  const user = useUserStore((state) => state.user);
  const notify = useNotificationStore((state) => state.notify);
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState({
    title: "",
    material: "",
    code: "",
  });

  const [questions, setQuestions] = useState([]);

  // Рефи для CodeMirror
  const codeTextAreaRef = useRef(null);
  const editorInstance = useRef(null);

  // Ініціалізація CodeMirror для поля введення коду
  useEffect(() => {
    if (codeTextAreaRef.current && !editorInstance.current) {
      editorInstance.current = window.CodeMirror.fromTextArea(
        codeTextAreaRef.current,
        {
          mode: "javascript",
          lineNumbers: true,
          theme: "monokai",
        },
      );

      editorInstance.current.setSize("100%", "200px");

      // Слідкуємо за змінами в редакторі та записуємо їх у стейт React
      editorInstance.current.on("change", (instance) => {
        const currentCode = instance.getValue();
        setLessonData((prev) => ({ ...prev, code: currentCode }));
      });
    }

    // Очищення при розмонтуванні компонента
    return () => {
      if (editorInstance.current) {
        editorInstance.current.toTextArea();
        editorInstance.current = null;
      }
    };
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "choice",
        options: [{ text: "", is_correct: false }],
        correct_text: "",
      },
    ]);
  };

  const autoResize = (e) => {
    const element = e.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
    notify("Питання видалено", "info");
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "", is_correct: false });
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter(
      (_, i) => i !== oIndex,
    );
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questions.length === 0) {
      return notify("Додайте хоча б одне питання до тесту!", "error");
    }

    const payload = {
      ...lessonData,
      questions,
      created_by: user.id,
    };

    try {
      const response = await fetch(
        "https://js-learning-backend.onrender.com/add-lesson",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        notify("Урок та тести успішно збережено!", "success");
        navigate("/profile");
      } else {
        notify(data.error || "Помилка при збереженні", "error");
      }
    } catch (err) {
      console.error("Помилка:", err);
      notify("Сервер недоступний. Спробуйте пізніше", "error");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Створення уроку</h1>
      <form onSubmit={handleSubmit} className="lesson-form">
        <section className="section">
          <h2>1. Теоретична Bamboo частина</h2>
          <input
            type="text"
            className="admin-input"
            placeholder="Заголовок уроку"
            value={lessonData.title}
            onChange={(e) =>
              setLessonData({ ...lessonData, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Текст уроку (матеріал)"
            value={lessonData.material}
            onChange={(e) =>
              setLessonData({ ...lessonData, material: e.target.value })
            }
            onInput={autoResize}
            className="auto-resize-textarea"
            required
          />

          {/* Блок для коду з підключеним CodeMirror *}
          <div
            className="code-editor-wrapper"
            style={{ marginBottom: "20px", textAlign: "left" }}
          >
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Початковий JavaScript код для інтерпретатора:
            </label>
            <textarea
              ref={codeTextAreaRef}
              defaultValue={lessonData.code}
              placeholder="Приклад JavaScript коду..."
            />
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>2. Тестові завдання</h2>
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="question-block">
              <div className="q-header">
                <h3>Питання №{qIndex + 1}</h3>
                <button
                  type="button"
                  className="del-btn"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Видалити
                </button>
              </div>
              <textarea
                className="question-textarea"
                placeholder="Введіть текст питання..."
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question", e.target.value)
                }
                onInput={autoResize}
                required
              />

              <select
                className="type-select"
                value={q.type}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "type", e.target.value)
                }
              >
                <option value="choice">Вибір (choice)</option>
                <option value="text">Введення (text)</option>
              </select>

              {q.type === "choice" ? (
                <div className="options-area">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="option-row">
                      <input
                        type="text"
                        placeholder="Варіант відповіді"
                        value={opt.text}
                        onChange={(e) => {
                          const upd = [...questions];
                          upd[qIndex].options[oIndex].text = e.target.value;
                          setQuestions(upd);
                        }}
                        required
                      />
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={opt.is_correct}
                        onChange={() => {
                          const upd = [...questions];
                          upd[qIndex].options.forEach(
                            (o, i) => (o.is_correct = i === oIndex),
                          );
                          setQuestions(upd);
                        }}
                      />
                      <button
                        type="button"
                        className="del-opt"
                        onClick={() => removeOption(qIndex, oIndex)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-opt-btn"
                    onClick={() => addOption(qIndex)}
                  >
                    + Варіант
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  className="text-answer-input"
                  placeholder="Впишіть правильну відповідь"
                  value={q.correct_text}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "correct_text", e.target.value)
                  }
                  required
                />
              )}
            </div>
          ))}

          <button type="button" onClick={addQuestion} className="add-btn">
            + Додати питання
          </button>
        </section>

        <button type="submit" className="save-btn">
          Опублікувати урок
        </button>
      </form>
    </div>
  );
}
*/

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import useNotificationStore from "../store/useNotificationStore";
import "./AddLesson.css";

/* global CodeMirror */

export default function AddLesson() {
  const user = useUserStore((state) => state.user);
  const notify = useNotificationStore((state) => state.notify);
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState({
    title: "",
    material: "",
    code: "",
  });

  const [questions, setQuestions] = useState([]);

  // Рефи для CodeMirror
  const codeTextAreaRef = useRef(null);
  const editorInstance = useRef(null);

  // Ініціалізація CodeMirror для поля введення коду
  useEffect(() => {
    if (codeTextAreaRef.current && !editorInstance.current) {
      editorInstance.current = window.CodeMirror.fromTextArea(
        codeTextAreaRef.current,
        {
          mode: "javascript",
          lineNumbers: true,
          theme: "monokai",
          viewportMargin: Infinity, // Важливо для автовисоти: змушує CodeMirror рендерити весь контент відразу
        },
      );

      // Встановлюємо висоту в "auto", щоб редактор розтягувався разом із кодом
      editorInstance.current.setSize("100%", "auto");

      // Слідкуємо за змінами в редакторі та записуємо їх у стейт React
      editorInstance.current.on("change", (instance) => {
        const currentCode = instance.getValue();
        setLessonData((prev) => ({ ...prev, code: currentCode }));
      });
    }

    // Очищення при розмонтуванні компонента
    return () => {
      if (editorInstance.current) {
        editorInstance.current.toTextArea();
        editorInstance.current = null;
      }
    };
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "choice",
        options: [{ text: "", is_correct: false }],
        correct_text: "",
      },
    ]);
  };

  const autoResize = (e) => {
    const element = e.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
    notify("Питання видалено", "info");
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "", is_correct: false });
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter(
      (_, i) => i !== oIndex,
    );
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questions.length === 0) {
      return notify("Додайте хоча б одне питання до тесту!", "error");
    }

    const payload = {
      ...lessonData,
      questions,
      created_by: user.id,
    };

    try {
      const response = await fetch(
        "https://js-learning-backend.onrender.com/add-lesson",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        notify("Урок та тести успішно збережено!", "success");
        navigate("/profile");
      } else {
        notify(data.error || "Помилка при збереженні", "error");
      }
    } catch (err) {
      console.error("Помилка:", err);
      notify("Сервер недоступний. Спробуйте пізніше", "error");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Створення уроку</h1>
      <form onSubmit={handleSubmit} className="lesson-form">
        <section className="section">
          <h2>1. Теоретична частина</h2>
          <input
            type="text"
            className="admin-input"
            placeholder="Заголовок уроку"
            value={lessonData.title}
            onChange={(e) =>
              setLessonData({ ...lessonData, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Текст уроку (матеріал)"
            value={lessonData.material}
            onChange={(e) =>
              setLessonData({ ...lessonData, material: e.target.value })
            }
            onInput={autoResize}
            className="auto-resize-textarea"
            required
          />

          {/* Блок для коду з підключеним CodeMirror */}
          <div
            className="code-editor-wrapper"
            style={{ marginBottom: "20px", textAlign: "left" }}
          >
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Початковий JavaScript код для інтерпретатора:
            </label>
            <textarea
              ref={codeTextAreaRef}
              defaultValue={lessonData.code}
              placeholder="Приклад JavaScript коду..."
            />
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>2. Тестові завдання</h2>
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="question-block">
              <div className="q-header">
                <h3>Питання №{qIndex + 1}</h3>
                <button
                  type="button"
                  className="del-btn"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Видалити
                </button>
              </div>
              <textarea
                className="question-textarea"
                placeholder="Введіть текст питання..."
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question", e.target.value)
                }
                onInput={autoResize}
                required
              />

              <select
                className="type-select"
                value={q.type}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "type", e.target.value)
                }
              >
                <option value="choice">Вибір (choice)</option>
                <option value="text">Введення (text)</option>
              </select>

              {q.type === "choice" ? (
                <div className="options-area">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="option-row">
                      <input
                        type="text"
                        placeholder="Варіант відповіді"
                        value={opt.text}
                        onChange={(e) => {
                          const upd = [...questions];
                          upd[qIndex].options[oIndex].text = e.target.value;
                          setQuestions(upd);
                        }}
                        required
                      />
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={opt.is_correct}
                        onChange={() => {
                          const upd = [...questions];
                          upd[qIndex].options.forEach(
                            (o, i) => (o.is_correct = i === oIndex),
                          );
                          setQuestions(upd);
                        }}
                      />
                      <button
                        type="button"
                        className="del-opt"
                        onClick={() => removeOption(qIndex, oIndex)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-opt-btn"
                    onClick={() => addOption(qIndex)}
                  >
                    + Варіант
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  className="text-answer-input"
                  placeholder="Впишіть правильну відповідь"
                  value={q.correct_text}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "correct_text", e.target.value)
                  }
                  required
                />
              )}
            </div>
          ))}

          <button type="button" onClick={addQuestion} className="add-btn">
            + Додати питання
          </button>
        </section>

        <button type="submit" className="save-btn">
          Опублікувати урок
        </button>
      </form>
    </div>
  );
}
