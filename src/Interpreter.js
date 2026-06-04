/*import React from "react";
import "./index.css";

/* global CodeMirror 
/*import "./Leson.css";
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
  /*
  function runCode() {
    const code = editorInstance.current.getValue();
    const output = outputRef.current;
    output.textContent = "";

    // Створюємо тимчасовий проксі для консолі
    const customLog = (msg) => {
      output.textContent +=
        (typeof msg === "object" ? JSON.stringify(msg) : msg) + "\n";
    };

  function runCode() {
    const code = editorInstance.current.getValue();
    const output = outputRef.current;
    output.textContent = "";

    // 1. Створюємо "пісочницю" через iframe
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const iWindow = iframe.contentWindow;

    // 2. Захист від зависання
    const timer = setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
        output.textContent = "Помилка: Час виконання вичерпано (таймаут).";
      }
    }, 2000);

    try {
      // 3. Підміна консолі всередині фрейму
      iWindow.console.log = (...args) => {
        output.textContent += args.join(" ") + "\n";
      };
      const protectedCode = `
  const startTime = Date.now();
  const check = () => {
    if (Date.now() - startTime > 1500) throw new Error("Перевищено час виконання (1.5с)");
  };
  
  // Вставляємо перевірку в кожен цикл
  (function() {
    ${code.replace(/while\s*\(/g, "check(); while(")}
  })();
`;
setTimeout(() => {
  try {
    iWindow.eval(protectedCode);
    clearTimeout(timer);
  } catch (e) {
    output.textContent = "Помилка: " + e.message;
  } finally {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
}, 0);
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
*/
import React, { useEffect, useRef } from "react";
import "./index.css";
import "./Interpreter.css";

function Interpreter({ initialCode }) {
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    if (editorInstance.current) {
      editorInstance.current.setValue(initialCode || "");
      return;
    }

    editorInstance.current = window.CodeMirror.fromTextArea(editorRef.current, {
      mode: "javascript",
      lineNumbers: true,
      theme: "monokai",
    });

    editorInstance.current.setSize("100%", "300px");

    editorInstance.current.setValue(
      initialCode || 'console.log("Успіхів у навчанні!");',
    );

    return () => {
      if (editorInstance.current) {
        editorInstance.current.toTextArea();
        editorInstance.current = null;
      }
    };
  }, [initialCode]);
  /*
  function runCode() {
    const code = editorInstance.current.getValue();
    const output = outputRef.current;

    output.textContent = "";

    const workerCode = `
      self.console = {
        log: (...args) => {
          self.postMessage({
            type: "log",
            data: args.join(" ")
          });
        }
      };

      self.onmessage = function(e) {
        try {
          new Function(e.data)();
        } catch(err) {
          self.postMessage({
            type: "error",
            data: err.message
          });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });

    const worker = new Worker(URL.createObjectURL(blob));

    worker.onmessage = (e) => {
      switch (e.data.type) {
        case "log":
          output.textContent += e.data.data + "\n";
          break;

        case "error":
          output.textContent += "Помилка: " + e.data.data + "\n";
          break;

        default:
          break;
      }
    };

    worker.postMessage(code);

    const timeout = setTimeout(() => {
      worker.terminate();

      output.textContent += "\nПомилка: перевищено ліміт часу (2 секунди)";
    }, 2000);

    worker.addEventListener("message", () => {
      clearTimeout(timeout);
    });
  }
*/

  function runCode() {
    const code = editorInstance.current.getValue();
    const output = outputRef.current;

    output.textContent = "";

    const workerCode = `
    self.console = {
      log: (...args) => {
        self.postMessage({
          type: "log",
          data: args.join(" ")
        });
      }
    };

    self.onmessage = function(e) {
      try {
        new Function(e.data)();

        self.postMessage({
          type: "finished"
        });

      } catch(err) {
        self.postMessage({
          type: "error",
          data: err.message
        });
      }
    };
  `;

    const blob = new Blob([workerCode], { type: "application/javascript" });

    const worker = new Worker(URL.createObjectURL(blob));

    const timeout = setTimeout(() => {
      worker.terminate();

      output.textContent += "\nПомилка: перевищено ліміт часу (2 секунди)";
    }, 2000);

    worker.onmessage = (e) => {
      switch (e.data.type) {
        case "log":
          output.textContent += e.data.data + "\n";
          break;

        case "error":
          clearTimeout(timeout);

          output.textContent += "Помилка: " + e.data.data + "\n";

          worker.terminate();
          break;

        case "finished":
          clearTimeout(timeout);
          worker.terminate();
          break;

        default:
          break;
      }
    };

    worker.postMessage(code);
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
