import React from "react";
import "./App.scss";
import nodes from "./data/nodes.json";
import links from "./data/links.json";
import characters from "./data/characters.json";
import { ForceDirectedGraph } from "./components/forceDirectedGraph";

const App = () => {
  const renderTooltip = React.useCallback((node) => {
    const filteredCharacters = characters.filter((character) => {
      const name = character.characterName.split(" ").join("-");
      return name.includes(node.id);
    });
    // Select the first matched item of filteredCharacters array to render tooltip
    if (filteredCharacters[0]) {
      return `<div>
        <h4>${filteredCharacters[0].characterName ? filteredCharacters[0].characterName : node.id}</h4>
        ${
          filteredCharacters[0].characterImageThumb
            ? `<img src=${filteredCharacters[0].characterImageThumb} alt=""/>`
            : ""
        }
        <p>${filteredCharacters[0].houseName ? "House: " + filteredCharacters[0].houseName : ""}</p>
        <p>${filteredCharacters[0].actorName ? "Actor: " + filteredCharacters[0].actorName : ""}</p>
        <p>${filteredCharacters[0].parents ? "Parents: " + filteredCharacters[0].parents : ""}</p>
        <p>${filteredCharacters[0].sibling ? "Siblings: " + filteredCharacters[0].siblings : ""}</p>
        <p>${
          filteredCharacters[0].marriedEngaged
            ? "Married or Engaged to: " + filteredCharacters[0].marriedEngaged
            : ""
        }</p>
        <p>${filteredCharacters[0].parentOf ? "Parent of: " + filteredCharacters[0].parentOf : ""}</p>
        <p>${filteredCharacters[0].killed ? "Killed: " + filteredCharacters[0].killed : ""}</p>
        <p>${filteredCharacters[0].killedBy ? "Killed by: " + filteredCharacters[0].killedBy : ""}</p>
      </div>`;
    } else {
      return `<div>
        <h4>${node.id}</h4>
      </div>`;
    }
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Game&nbsp;of&nbsp;Thrones Character&nbsp;Network</h1>
        <div className="filter">
          <select id="selectList"></select>
          <button id="selectStark">House Stark</button>
          <button id="selectBaratheon">House Baratheon</button>
          <button id="selectLannister">House Lannister</button>
          <button id="selectTargaryen">House Targaryen</button>
        </div>
      </header>
      <section className="main">
        <ForceDirectedGraph
          linksData={links}
          nodesData={nodes}
          renderTooltip={renderTooltip}
        />
      </section>
    </div>
  );
}

export default App;
