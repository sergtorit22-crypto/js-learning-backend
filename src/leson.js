import React from "react";
import "./index.css";
import TestSystem from "./components/TestSystem";
/* global CodeMirror */
import "./Leson.css";
const { useState, useEffect, useRef } = React;

function Interpreter({ initialCode }) {
  // Отримуємо код із пропсів
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    // 1. Перевіряємо, чи не створено вже редактора. Якщо створено, просто змінюємо в ньому текст.
    if (editorInstance.current) {
      editorInstance.current.setValue(initialCode || "");
      return;
    }

    // 2. Якщо редактора немає, створюємо його
    editorInstance.current = window.CodeMirror.fromTextArea(editorRef.current, {
      mode: "javascript",
      lineNumbers: true,
      theme: "monokai",
    });

    editorInstance.current.setSize("100%", "300px");
    editorInstance.current.setValue(
      initialCode || 'console.log("Успіхів у навчанні!");',
    );

    // 3. Очищення при видаленні компонента (важливо, щоб не було "двох консолей")
    return () => {
      if (editorInstance.current) {
        editorInstance.current.toTextArea();
        editorInstance.current = null;
      }
    };
  }, [initialCode]); // Цей ефект спрацює знову, якщо initialCode зміниться
  /*
  function runCode() {
    const code = editorInstance.current.getValue();
    const output = outputRef.current;

    try {
      output.textContent = "";
      const originalLog = console.log;
      console.log = function (msg) {
        output.textContent += msg + "\n";
      };

      new Function(code)();

      console.log = originalLog;
    } catch (e) {
      output.textContent = "Помилка: " + e.message;
    }
  }
*/

  function runCode() {
    const code = editorInstance.current.getValue();
    const output = outputRef.current;
    output.textContent = "";

    // Створюємо тимчасовий проксі для консолі
    const customLog = (msg) => {
      output.textContent +=
        (typeof msg === "object" ? JSON.stringify(msg) : msg) + "\n";
    };

    try {
      // Виконуємо код, передаючи нашу функцію замість стандартного console.log
      const execute = new Function("console", code);
      execute({ log: customLog });
    } catch (e) {
      output.textContent = "Помилка: " + e.message;
    }
  }
  return (
    <div className="interpreterBox">
      <textarea ref={editorRef}></textarea>
      <br />
      <button onClick={runCode}>Запустити</button>
      <h3>Виведення:</h3>
      <pre id="output" ref={outputRef}></pre>
    </div>
  );
}
export default function FullLessonPage({ data, lessonId }) {
  const [view, setView] = useState("theory");

  if (!data) return <div>Завантаження...</div>;

  const tests = data.tests;

  return (
    <div className="full-page">
      {view === "theory" ? (
        /* --- РЕЖИМ ТЕОРІЇ --- */
        <>
          <div className="lessonLayout">
            <div className="lesonCont">
              <h1>{data.title}</h1>
              <p>{data.material}</p>
            </div>

            <div className="interpreterBox">
              <Interpreter initialCode={data.code} />
            </div>
          </div>

          <div className="tabs">
            <button
              onClick={() => setView("test")}
              className="start-test-btn"
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              Перейти до тесту
            </button>
          </div>
        </>
      ) : (
        /* --- РЕЖИМ ТЕСТУ --- */
        <div className="testLayout">
          {tests && tests.length > 0 ? (
            <TestSystem questions={data.tests} lessonId={lessonId} />
          ) : (
            <div className="no-data">
              У цього уроку ще немає тестів.
              <button onClick={() => setView("theory")}>
                Повернутися до теорії
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
