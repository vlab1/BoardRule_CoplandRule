import React, { useState, useEffect, useCallback } from "react";
import { useHttp } from "../../../hooks/http.hook";
import Table from "../../layout/Table/Table";
const Candidates = () => {
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const { loading, request } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [candidatesTable, setCandidatesTable] = useState([]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleCreateCandidate = async () => {
    try {
      await request("/api/candidate/create", "POST", { name, description }).then((res) => {
        setCandidatesTable(() => {
            const res = candidatesTable;
            res.push([name, description]);
            return res;
        });
        setName(null);
        setDescription(null);
      });
    } catch (e) {
      throw new Error("Error");
    }
  };

  const fetchCandidates = useCallback(async () => {
    try {
      await request("/api/candidate/get").then((res) => {
        setCandidates(res.data);
        setCandidatesTable(() => {
            const result = [["name", "description"]];
            res.data.forEach((item) => {
                result.push([item.name, item.description]);
            })
            return result;
        })
        setIsLoading(false);
      });
    } catch (e) {
      setIsLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return !isLoading && (
    <div>
      <div className="menu">
        <div className="field">
          <input
            value={name}
            onChange={handleNameChange}
            placeholder="Name"
          ></input>
                <input
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Description"
          ></input>
        </div>
        <div className="buttons">
          <button
            disabled={loading}
            onClick={handleCreateCandidate}
            className="action-button"
          >
            create candidate
          </button>
        </div>
      </div>
      <Table  table={candidatesTable} caption={"Candidates"}></Table>
    </div>
  );
};

export default Candidates;
