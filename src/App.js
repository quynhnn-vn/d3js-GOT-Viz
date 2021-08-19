import React from "react";
import nodes from "./data/nodes.json";
import links from "./data/links.json";
import { ForceGraph } from "./components/forceGraph";
import "./App.css";
import characters from "./data/characters.json";

function App() {

  const nodeHoverTooltip = React.useCallback((node) => {
    const item = characters.filter((character) => {
      const name = character.characterName.split(" ").join("-");
      return name.includes(node.id);
    });
    if (item[0]) {
      return `<div>
      <h4>${item[0].characterName ? item[0].characterName : node.id}</h4>
      ${item[0].characterImageThumb ? `<img src=${item[0].characterImageThumb} alt=""/>` : ""}
      <p>${item[0].houseName ? "House: "+item[0].houseName : ""}</p>
      <p>${item[0].actorName ? "Actor: "+item[0].actorName : ""}</p>
      <p>${item[0].parents ? "Parents: "+item[0].parents : ""}</p>
      <p>${item[0].sibling ? "Siblings: "+item[0].siblings : ""}</p>
      <p>${item[0].marriedEngaged ? "Married or Engaged to: "+item[0].marriedEngaged : ""}</p>
      <p>${item[0].parentOf ? "Parent of: "+item[0].parentOf : ""}</p>
      <p>${item[0].killed ? "Killed: "+item[0].killed : ""}</p>
      <p>${item[0].killedBy ? "Killed by: "+item[0].killedBy : ""}</p>
    </div>`;
    } else {
      return `<div>
      ${node.id}
      </div>`;
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">Force Graph Example</header>
      <select id="selectButton"></select>
      <section className="Main">
        <ForceGraph
          linksData={links}
          nodesData={nodes}
          nodeHoverTooltip={nodeHoverTooltip}
          // filterId={filterId}
        />
      </section>
    </div>
  );
}

export default App;
