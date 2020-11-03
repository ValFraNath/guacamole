import React from "react";
import { Link } from "react-router-dom";

const Root = () => {
  return (
    <div id="menu">
      <div id="list">
        <Link to="/train">Entraînement libre</Link>
        <Link to="/hello_world">Informations</Link>
      </div>
    </div>
  );
};

export default Root;
