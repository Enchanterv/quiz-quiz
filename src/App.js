import React, { useState, useMemo, useEffect } from "react";
import Quiz from "./Quiz";
import "./App.css";

function App() {
  const [result, setResult] = useState({
    score1: 0,
    score2: 0,
    total1: 0,
    total2: 0,
  });
  const onUpdateScore = (score, total) => {
    setResult((r) => ({ ...r, score1: score, total1: total }));
  };
  const onUpdateScore1 = (score, total) => {
    setResult((r) => ({ ...r, score2: score, total2: total }));
  };

  return (
    <div className="game">
      <div>
        Cumulative Score : {result.score1 + result.score2} out of{" "}
        {result.total1 + result.total2}
      </div>
      <div className="quizSet">
        <Quiz key="quiz1" updateScore={onUpdateScore} />
     {/*    <Quiz key="quiz" updateScore={onUpdateScore1} /> */}
      </div>
    </div>
  );
}

export default App;
