import React, { useState, useEffect, useMemo, useRef } from "react";
import _ from "lodash";

import ShowResults from "./ShowResults";
import "./Quiz.css";

//Function for generating a question-Answer pair
const generateQuestionAnswer = (maxOperand) => {
  const firstDigit = Math.floor(Math.random() * maxOperand + 1);
  const lastDigit = Math.floor(Math.random() * maxOperand + 1);
  const operator = ["+", "-", "*", "/"][Math.floor(Math.random() * 3)];

  const calculateResult = {
    "+": (x, y) => {
      return x + y;
    },
    "-": (x, y) => {
      return x - y;
    },
    "*": (x, y) => {
      return x * y;
    },
    "/": (x, y) => {
      return x / y;
    },
  };

  const question = firstDigit + " " + operator + " " + lastDigit;
  const answer = calculateResult[operator](firstDigit, lastDigit).toFixed(2);

  return { question, answer };
};

export default function Quiz({ updateScore, uniqueKey }) {
  const [numberOfQuestions, setNumberOfQuestions] = useState(3);
  const [maxOperand, setMaxOperand] = useState(10);
  const [isGameInProgress, setGameInProgress] = useState(false);
  const [questionWithAnswer, setQuestionWithAnswer] = useState([]);
  const [inTime, setInTime] = useState(false);
  let currentQuestion = useMemo(() => generateQuestionAnswer(maxOperand), [
    maxOperand,
    questionWithAnswer.length,
  ]);
  let timer;

  //Get state to localStorage
  useEffect(() => {
    let quesAns = localStorage.getItem(`${uniqueKey}-question-answer-set`);
    if (quesAns) {
      setQuestionWithAnswer(JSON.parse(quesAns));
    }
    let curQues = localStorage.getItem(`${uniqueKey}-currentQuestion-set`);
    if (curQues) {
      currentQuestion = JSON.parse(curQues);
    }

    let variousStates = JSON.parse(
      localStorage.getItem(`${uniqueKey}-various-states`)
    );
    if (variousStates) {
      setNumberOfQuestions(variousStates.numberOfQuestions);
      setMaxOperand(variousStates.maxOperand);
      setGameInProgress(variousStates.isGameInProgress);
      setInTime(variousStates.inTime);
    }
  }, []);

  //Save current state to localStorage
  useEffect(() => {
    localStorage.setItem(
      `${uniqueKey}-various-states`,
      JSON.stringify({
        numberOfQuestions,
        maxOperand,
        isGameInProgress,
        inTime,
      })
    );
    localStorage.setItem(
      `${uniqueKey}-question-answer-set`,
      JSON.stringify(questionWithAnswer)
    );
    localStorage.setItem(
      `${uniqueKey}-currentQuestion-set`,
      JSON.stringify(currentQuestion)
    );
  }, [questionWithAnswer.length]);

  useEffect(() => {
    updateScore(
      questionWithAnswer.filter((q) => q.result).length,
      questionWithAnswer.length
    );
  }, [questionWithAnswer.length]);
  useEffect(() => {
    if (
      isGameInProgress &&
      numberOfQuestions > questionWithAnswer.length &&
      !inTime
    ) {
      timer = setTimeout(() => {
        setQuestionWithAnswer((data) =>
          _.uniqBy(
            [...data, { ...currentQuestion, result: false }],
            (e) => e.question
          )
        );
      }, 20000);
    }
    if (numberOfQuestions === questionWithAnswer.length) {
      clearTimeout(timer);
    }
    setInTime(false);
  }, [questionWithAnswer.length, isGameInProgress, inTime]);

  const score =
    questionWithAnswer.filter((q) => q.result).length +
    " out of " +
    questionWithAnswer.length;
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setInTime(true);
    clearTimeout(timer);
    const inp = inputRef.current.value;
    const result = currentQuestion.answer === parseFloat(inp).toFixed(2);
    setQuestionWithAnswer((data) =>
      _.uniqBy([...data, { ...currentQuestion, result }], (e) => e.question)
    );
    inputRef.current.value = "";
  };
  return (
    <>
      {isGameInProgress ? (
        <div>
          <button
            onClick={() => {
              setGameInProgress(false);
              setQuestionWithAnswer([]);
              localStorage.removeItem(`${uniqueKey}-question-answer-set`);
              localStorage.removeItem(`${uniqueKey}-currentQuestion-set`);
              localStorage.removeItem(`${uniqueKey}-various-states`);
            }}
          >
            Reset Quiz
          </button>
          <div className="quiz">
            {numberOfQuestions <= questionWithAnswer.length ? (
              <ShowResults
                questionWithAnswer={questionWithAnswer}
                numberOfQuestions={numberOfQuestions}
              />
            ) : (
              <div className="quesAns">
                <div className="ques">
                  Q{questionWithAnswer.length + 1}. What is &nbsp;
                  {currentQuestion?.question} ? &nbsp;
                  <form onSubmit={(e) => handleSubmit(e)}>
                    <input
                      ref={inputRef}
                      type="text"
                      required
                      minLength="1"
                      maxLength="5"
                    />

                    <input
                      type="submit"
                      value={
                        numberOfQuestions - (questionWithAnswer.length + 1)
                          ? "Next"
                          : "Finish"
                      }
                    />
                  </form>{" "}
                </div>
                <br />
                <br />
                <div>Current Score : {score}</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="quizConditions">
          <label>
            Number of Questions :
            <input
              maxLength="2"
              value={numberOfQuestions}
              onChange={(n) => {
                if (!isNaN(n.target.value))
                  setNumberOfQuestions((_) => parseInt(n.target.value));
              }}
            />
          </label>{" "}
          <br />{" "}
          <label>
            {" Max Operand : "}
            <input
              maxLength="3"
              value={maxOperand}
              onChange={(n) => {
                if (!isNaN(n.target.value))
                  setMaxOperand((_) => parseInt(n.target.value));
              }}
            />{" "}
          </label>
          <br />
          <button onClick={(_) => setGameInProgress((_) => true)}>
            Start Quiz
          </button>
        </div>
      )}
    </>
  );
}
