export default function QuizInProgress({
  questionNumber,
  question,
  score,
  inputRef,
  numberOfQuestions,
  handleSubmit,
}) {
  return (
    <div className="quesAns">
      <div className="ques">
        Q{questionNumber + 1}. What is &nbsp;
        {question} ? &nbsp;
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            required
            minLength="1"
            maxLength="5"
          />

          <input
            type="submit"
            value={numberOfQuestions - (questionNumber + 1) ? "Next" : "Finish"}
          />
        </form>
      </div>
      <br />
      <br />
      <div>Current Score : {score}</div>
    </div>
  );
}
