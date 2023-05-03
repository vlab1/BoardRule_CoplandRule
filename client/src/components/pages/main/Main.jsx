import React, { useState } from "react";
import { useHttp } from "../../../hooks/http.hook";
import "./Main.scss";
import Table from "../../layout/Table/Table.jsx";
import CoplandRuleSolve from "../../layout/coplandRuleSolve/CoplandRuleSolve.jsx";
import BoardRuleSolve from "../../layout/boardRuleSolve/BoardRuleSolve.jsx";

const Main = () => {
  const { loading, request } = useHttp();
  const [boardRuleTable, setBoardRuleTable] = useState([]);
  const [coplandRuleTable, setCoplandRuleTable] = useState([]);
  const [boardRuleSolve, setBoardRuleSolve] = useState({});
  const [coplandRuleSolve, setCoplandRuleSolve] = useState({});
  const [visibility, setVisibility] = useState(true);
  const [visibilityBoard, setVisibilityBoard] = useState(true);
  const [visibilityCopland, setVisibilityCopland] = useState(true);
  const [candidatesCount, setCandidatesCount] = useState(null);
  const [votersCount, setVotersCount] = useState(null);

  const handleCandidatesCountChange = (event) => {
    setCandidatesCount(parseInt(event.target.value));
  };

  const handleVotersCountChange = (event) => {
    setVotersCount(parseInt(event.target.value));
  };

  const handleBoardRule = async () => {
    try {
      await request("/api/vote/table/board-rule")
        .then((res) => {
          setBoardRuleTable(res.data);
          setVisibility(true);
          setVisibilityCopland(false);
          setVisibilityBoard(true);
        })
        .catch(() => {
          setBoardRuleTable([]);
        });
      await request("/api/vote/board-rule")
        .then((res) => {
          setBoardRuleSolve(res.data);
          setVisibility(true);
          setVisibilityCopland(false);
        })
        .catch(() => {
          setBoardRuleSolve({});
        });
    } catch (e) {
      throw new Error("Error");
    }
  };

  const handleCoplandRule = async () => {
    try {
      await request("/api/vote/table/copland-rule")
        .then((res) => {
          setCoplandRuleTable(res.data);
          setVisibility(true);
          setVisibilityBoard(false);
          setVisibilityCopland(true);
        })
        .catch(() => {
          setCoplandRuleTable([]);
        });
      await request("/api/vote/copland-rule")
        .then((res) => {
          setCoplandRuleSolve(res.data);
          setVisibility(true);
          setVisibilityBoard(false);
        })
        .catch(() => {
          setCoplandRuleSolve({});
        });
    } catch (e) {
      throw new Error("Error");
    }
  };

  const handleGenerateVotes = async () => {
    try {
      await request("/api/vote/generate", "POST");
      setVisibility(false);
    } catch (e) {
      throw new Error("Error");
    }
  };

  const handleGenerateVoters = async () => {
    try {
      await request("/api/voter/generate", "POST", { count: votersCount ? votersCount : 15 });
      setVisibility(false);
    } catch (e) {
      throw new Error("Error");
    }
  };

  const handleGenerateCandidates = async () => {
    try {
      await request("/api/candidate/generate", "POST", { count: candidatesCount ? candidatesCount : 5 });
      setVisibility(false);
    } catch (e) {
      throw new Error("Error");
    }
  };
  const handleDestroyVoters = async () => { 
    try { 
      await request("/api/voter/destroy", "DELETE"); 
      setVisibility(false); 
    } catch (e) { 
      throw new Error("Error"); 
    } 
  }; 
 
  const handleDestroyCandidates = async () => { 
    try { 
      await request("/api/candidate/destroy", "DELETE"); 
      setVisibility(false); 
    } catch (e) { 
      throw new Error("Error"); 
    } 
  };
  return (
    <div>
      <div className="menu">
        <div className="field">
          <input
            value={candidatesCount}
            onChange={handleCandidatesCountChange}
            placeholder="Candidates"
          ></input>
          <input
            value={votersCount}
            onChange={handleVotersCountChange}
            placeholder="Voters"
          ></input>
        </div>
        <div className="buttons">
          <button
            disabled={loading}
            onClick={handleGenerateVotes}
            className="action-button"
          >
            generate votes
          </button>
          <button
            votes
            disabled={loading}
            onClick={handleGenerateVoters}
            className="action-button"
          >
            generate voters
          </button>

          <button
            disabled={loading}
            onClick={handleGenerateCandidates}
            className="action-button"
          >
            generate candidates
          </button>
        </div>
        <div className="buttons"> 
          <button 
            disabled={loading} 
            className="action-button" 
            onClick={handleDestroyVoters} 
          > 
            Destroy voters 
          </button> 
 
          <button 
            disabled={loading} 
            className="action-button" 
            onClick={handleDestroyCandidates} 
          > 
            Destroy candidates 
          </button> 
        </div>
        <div className="buttons">
          <button
            disabled={loading}
            className="action-button"
            onClick={handleCoplandRule}
          >
            Copland Rule
          </button>

          <button
            disabled={loading}
            className="action-button"
            onClick={handleBoardRule}
          >
            Board Rule
          </button>
        </div>
      </div>

      {loading && (
        <div
          style={loading ? { display: "block" } : { display: "none" }}
          className="loader"
        ></div>
      )}

      {!loading && visibility && (
        <div>
          {visibilityBoard && (
            <div>
              <Table table={boardRuleTable} caption={"Board rule"}></Table>
              <BoardRuleSolve solve={boardRuleSolve}></BoardRuleSolve>
            </div>
          )}
          {visibilityCopland && (
            <div>
              {" "}
              <Table table={coplandRuleTable} caption={"Copland rule"}></Table>
              <CoplandRuleSolve solve={coplandRuleSolve}></CoplandRuleSolve>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Main;
