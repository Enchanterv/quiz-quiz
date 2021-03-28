import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import ShowResults from "./ShowResults";
import "./App.css";

const generateQuestionAnswer = () => {
  console.log("here");
  const firstDigit = Math.floor(Math.random() * 11);
  const lastDigit = Math.floor(Math.random() * 11);
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

export default function Quiz({ updateScore }) {
  const [numberOfQuestions, setNumberOfQuestions] = useState(3);
  const [isGameInProgress, setGameInProgress] = useState(false);
  const [questionWithAnswer, setQuestionWithAnswer] = useState([]);
  const currentQuestion = useMemo(() => generateQuestionAnswer(), [
    questionWithAnswer.length,
  ]);
  let timer;

  useEffect(() => {
    updateScore(
      questionWithAnswer.filter((q) => q.result).length,
      questionWithAnswer.length
    );
    console.log("here2");

    if (isGameInProgress) {
      timer = setTimeout(() => {
        setQuestionWithAnswer((data) => [
          ...data,
          { ...currentQuestion, result: false },
        ]);
      }, 3000);
    }
    if (numberOfQuestions === questionWithAnswer.length) {
      clearTimeout(timer);
    }
  }, [questionWithAnswer.length, isGameInProgress]);

  const score =
    questionWithAnswer.filter((q) => q.result).length +
    " out of " +
    questionWithAnswer.length;
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    clearTimeout(timer);
    const inp = inputRef.current.value;
    const result = currentQuestion.answer === parseFloat(inp).toFixed(2);
    setQuestionWithAnswer((data) => [...data, { ...currentQuestion, result }]);
    inputRef.current.value = "";
  };
  return (
    <>
      {isGameInProgress ? (
        <div className="quiz">
          {numberOfQuestions === questionWithAnswer.length ? (
            <ShowResults questionWithAnswer={questionWithAnswer} />
          ) : (
            <>
              <div>
                Q{questionWithAnswer.length + 1}. What is
                {currentQuestion?.question} ?
              </div>
              <form onSubmit={(e) => handleSubmit(e)}>
                <label>
                  :
                  <input
                    ref={inputRef}
                    type="text"
                    required
                    minLength="1"
                    maxLength="5"
                  />
                </label>
                <input
                  type="submit"
                  value={
                    numberOfQuestions - (questionWithAnswer.length + 1)
                      ? "Next"
                      : "Finish"
                  }
                />
              </form>
              <div>Current Score : {score}</div>
            </>
          )}
        </div>
      ) : (
        <>
          <input
            maxLength="2"
            value={numberOfQuestions}
            onChange={(n) => {
              if (!isNaN(n.target.value))
                setNumberOfQuestions((_) => parseInt(n.target.value));
            }}
          />
          <button onClick={(_) => setGameInProgress((_) => true)}>
            Start Quiz
          </button>
        </>
      )}
    </>
  );
}
