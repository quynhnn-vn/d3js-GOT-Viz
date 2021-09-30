import React from "react";
import "./header.scss";
import { Soundtrack } from "./soundtrack";

export const Header = () => {
  return (
    <header className="header">
      <div className="title">
        <h1>Game&nbsp;of&nbsp;Thrones Character&nbsp;Network</h1>
        <Soundtrack />
      </div>
      <div className="filterNav">
        <select id="selectList"></select>
        <div>
          <button id="selectStark" className="houseButton">
            House Stark
          </button>
          <button id="selectBaratheon" className="houseButton">
            House Baratheon
          </button>
          <button id="selectLannister" className="houseButton">
            House Lannister
          </button>
          <button id="selectTargaryen" className="houseButton">
            House Targaryen
          </button>
        </div>
      </div>
    </header>
  );
};
