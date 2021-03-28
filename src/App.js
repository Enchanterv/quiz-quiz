import React, { useState} from "react";
import Note from "./Note";
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
      <div
        style={{ display: "flex", alignSelf: "flex-end", paddingRight: "10px" }}
      >
        Cumulative Score : {result.score1 + result.score2}
        <br />
        Questions Answered : {result.total1 + result.total2}
      </div>
      <Note />
      <div className="quizSet">
        <Quiz uniqueKey="quiz1" updateScore={onUpdateScore} />
        {<Quiz uniqueKey="qui2" updateScore={onUpdateScore1} />}
      </div>
    </div>
  );
}

export default App;
