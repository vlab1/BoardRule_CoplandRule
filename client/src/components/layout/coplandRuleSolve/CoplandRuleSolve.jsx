import React from "react";
import "./CoplandRuleSolve.scss";

const CoplandRuleSolve = ({ solve }) => {
  return Object.keys(solve).length > 0 ? (
    <div class="solve-copland">
      {Object.keys(solve.coplandRuleCountingSteps).map((key) => {
        return <div class="item">{`${solve.coplandRuleCountingSteps[key]}`}</div>;
      })}
      {Object.keys(solve.coplandRuleCounting).map((key) => {
        return (
          <div class="item">{`Scores (${key}) = ${solve.coplandRuleCounting[key]}`}</div>
        );
      })}
      {Object.keys(solve.coplandRuleSolve).map((key) => {
        return (
          <div class="item">{`
            The Copeland winner with the highest of these scores - candidate ${key}`}</div>
        );
      })}
    </div>
  ) : (
    <div></div>
  );
};

export default CoplandRuleSolve;
