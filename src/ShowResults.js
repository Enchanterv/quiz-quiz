import _ from "lodash";
export default function ShowResults({ questionWithAnswer, numberOfQuestions }) {
  const score =
    _.uniqBy(questionWithAnswer, (e) => e.question).filter((q) => q.result)
      .length +
    " out of " +
    _.uniqBy(questionWithAnswer, (e) => e.question).length;

  const questionSet = _.uniqBy(questionWithAnswer, (e) => e.question).map(
    (qA, index) => (
      <div
        key={index}
        style={qA.result ? { color: "green" } : { color: "red" }}
      >
        Q{index} : {qA.question} = {qA.answer}
      </div>
    )
  );

  return (
    <>
      <div> "Game Finished"</div>
      {questionSet.length === numberOfQuestions ? (
        <>
          {" "}
          <div style={{ border: "solid black 2px" }}> ScoreCard </div>
          {questionSet}
          <div>YourScore : {score}</div>
        </>
      ) : (
        <span>Processing...</span>
      )}
    </>
  );
}
