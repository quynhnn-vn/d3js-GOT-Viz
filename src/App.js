import React from 'react';
//import data from './data/data.json';
import nodes from './data/nodes.json';
import links from './data/links.json';
import { ForceGraph } from "./components/forceGraph";
import './App.css';

function App() {
  //To modify
  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div>${node.id}</div>`;
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        Force Graph Example
      </header>
      <section className="Main">
        <ForceGraph linksData={links} nodesData={nodes} nodeHoverTooltip={nodeHoverTooltip} />
      </section>
    </div>
  );
}

export default App;