import React from "react";
import "./BoardRuleSolve.scss";

const BoardRuleSolve = ({ solve }) => {
  return Object.keys(solve).length > 0 ? (
    <div class="solve-board">
      {Object.keys(solve.boardRuleCountingSteps).map((key) => {
        return (<div class="item">{`n(${key}) = ${solve.boardRuleCountingSteps[key]} = ${solve.boardRuleCounting[key]}`}</div>)
      })}
       {Object.keys(solve.boardRuleSolve).map((key) => {
        return (<div class="item">{`As a result, the candidate becomes the winner ${key}`}</div>)
      })}
    </div>
  ) : <div></div>;
};

export default BoardRuleSolve;
