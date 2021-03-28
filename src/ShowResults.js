export default function ShowResults({ questionWithAnswer }) {
  const score =
    questionWithAnswer.filter((q) => q.result).length +
    " out of " +
    questionWithAnswer.length;

  const questionSet = questionWithAnswer.map((qA, index) => (
    <div key={index} style={qA.result ? { color: "green" } : { color: "red" }}>
      Q{index} : {qA.question} = {qA.answer}
    </div>
  ));
  return (
    <>
      <div> "Game Finished"</div>
      <div style={{ border: "solid black 2px" }}> ScoreCard </div>
      {questionSet}
      <div>YourScore : {score}</div>
    </>
  );
}
