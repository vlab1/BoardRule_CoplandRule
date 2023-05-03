import React, { useState, useEffect, useCallback } from "react";
import { useHttp } from "../../../hooks/http.hook";
import Table from "../../layout/Table/Table";
import "./editVote.scss";

const EditVote = () => {
  const [name, setName] = useState(null);
  const { loading, request } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [candidatesTable, setCandidatesTable] = useState([]);
  const [voter, setVoter] = useState({});
  const fetchCandidates = useCallback(async () => {
    try {
      await request("/api/candidate/get").then((res) => {
        setCandidates(res.data);
        setCandidatesTable(() => {
          const result = [["name", "description", "place"]];
          res.data.forEach((item) => {
            result.push([item.name, item.description, ""]);
          });
          return result;
        });
        setIsLoading(false);
      });
    } catch (e) {
      setIsLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleCellChange = (event, rowIndex, columnIndex) => {
    const value = event.target.value;
    setCandidatesTable((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][columnIndex] = value;
      return newData;
    });
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleVote = async () => {
    try {
      const createMany = [];
      let places = [];
      for (let i = 1; i < candidatesTable.length; i++) {
        if (
          candidatesTable[i][2] === null ||
          candidatesTable[i][2] === undefined ||
          candidatesTable[i][2] === ""
        ) {
          alert("Point to the correct place");
          places = [];
          break;
        } else if (Number(candidatesTable[i][2]) > candidatesTable.length - 1) {
          alert("Seats must be in order");
          places = [];
          break;
        } else {
          places.push(Number(candidatesTable[i][2]));
        }
      }
      let uniqueArray = [...new Set(places)];
      if (uniqueArray.length !== places.length) {
        places = [];
        alert("Values ​​must not be repeated");
      }
      const voter1 = await request(`/api/voter/find?name=${name}`).then(
        async (res) => {
          if (res.data.length > 0) {
            await request(`/api/voter/delete?id=${res.data[0].id}`, "DELETE")
          } 
            await request("/api/voter/create", "POST", { name }).then(
              async (res) => {
                setVoter(res.data);
                for (let i = 0; i < places.length; i++) {
                  createMany.push({
                    candidateId: candidates[i].id,
                    voterId: res.data.id,
                    place: places[i],
                  });
                }
                console.log(createMany);
                await request("/api/vote/create-many", "POST", {votes: createMany}).then((res) => {
                  alert("You voted");
                }).catch(async () => {
                  alert("Error");
                  await request("/api/voter/delete", "DELETE", {id: res.data.id});
                });
              }
            );
          
        }
      );
    } catch (e) {
      throw new Error("Error");
    }
  };

  const handleGetVote = async () => {
    try {
      const voter = await request(`/api/voter/find?name=${name}`);
      if (!voter || voter.data.length <= 0) {
        alert("You didn't vote")
      }     
      const voterId= voter.data[0].id;
      const vote = await request(`/api/vote/find?voterId=${voterId}`);
      if (!vote || vote.data.length <= 0) {
        alert("You didn't vote")
      }
      const array = vote.data;
      await request("/api/candidate/get").then((res) => {
        setCandidates(res.data);
        setCandidatesTable(() => {
          const result = [["name", "description", "place"]];
          res.data.forEach((item, index) => {
            result.push([item.name, item.description, array[index].place + ""]);
          });
          return result;
        });
        setIsLoading(false);
      });
    } catch (e) {
      throw new Error("Error");
    }
  };


  return (
    !isLoading && (
      <div>
        <div className="menu">
          <div className="field">
            <input
              value={name}
              onChange={handleNameChange}
              placeholder="Voter's name"
            ></input>
             <button
              disabled={loading}
              onClick={handleGetVote}
              className="action-button"
            >
              get
            </button>
          </div>
        </div>
        {candidatesTable.length > 0 && (
          <table className="table-input">
            <caption>Data</caption>
            <tbody>
              {candidatesTable.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, columnIndex) => (
                    <td
                      key={columnIndex}
                      style={
                        rowIndex === 0
                          ? { background: "#efefef" }
                          : { background: "white" }
                      }
                    >
                      <input
                        disabled={
                          columnIndex === 0 ||
                          columnIndex === 1 ||
                          (columnIndex === 2 && rowIndex === 0)
                        }
                        type="text"
                        value={cell}
                        onChange={(event) =>
                          handleCellChange(event, rowIndex, columnIndex)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="menu">
          <div className="buttons">
            <button
              disabled={loading}
              onClick={handleVote}
              className="action-button"
            >
              vote
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditVote;
