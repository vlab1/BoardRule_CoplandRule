import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/pages/main/Main.jsx";
import Votes from "./components/pages/votes/Votes.jsx";
import Candidates from "./components/pages/candidates/Candidates.jsx";
import EditVote from "./components/pages/editVote/editVote.jsx";
export const useRoutes = () => {
  return (
    <Routes>
      <Route path="/main" exact element={<Main />} />
      <Route path="/editvote" exact element={<EditVote />} />
      <Route path="/votes" exact element={<Votes />} />
      <Route path="/candidates" exact element={<Candidates />} />
      <Route path="/*" element={<Navigate replace to="/main" />} />
    </Routes>
  );
};
