import React from "react";
import "../index.css";
import TestSystem from "../TestSystem";
/* global CodeMirror */
import "./Leson.css";
import Interpreter from "../Interpreter";
const { useState, useEffect, useRef } = React;

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
