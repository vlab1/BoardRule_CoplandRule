import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import { useHttp } from "../../../hooks/http.hook";

const Header = () => {

  return (<header>
    <div class="container">
      <nav>
        <div class="close-icon"><i class="fa-solid fa-xmark"></i></div>
        <Link to="/main" style={{ textDecoration: 'none', color: "black" }} >Main</Link>
        <Link to="/candidates" style={{ textDecoration: 'none', color: "black"  }}>Candidates</Link>
        <Link to="/votes" style={{ textDecoration: 'none', color: "black"  }}>Votes</Link>
      </nav>
      <div class="bar-icon"><i class="fa-solid fa-bars"></i></div>
      <div class="overlay"></div>
    </div>
  </header>);
};

export default Header;
