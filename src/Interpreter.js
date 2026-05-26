import React from "react";
import "./index.css";

/* global CodeMirror */
/*import "./Leson.css";*/
import "./Interpreter.css";
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

export default Interpreter;
