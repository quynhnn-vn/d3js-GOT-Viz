# Game of Thrones Character Network: React & D3js Visualization

Game of Thrones is a hit fantasy tv show based on the equally famous book series "A Song of Fire and Ice" by George RR Martin. The show is well known for its vastly complicated political landscape, large number of characters, and its frequent character deaths.

This project was builed with [Create React App](https://github.com/facebook/create-react-app) and [D3js](https://d3js.org/).

## Dataset

This project uses (Game of Thrones Book 1)[https://www.kaggle.com/mmmarchetti/game-of-thrones-dataset] dataset from [Kaggle](https://www.kaggle.com/), which was saved in `/data/links.json` file. This dataset constitutes 5 columns: `source`, `target`, `type`, `value` and `book`. `Source` and `target` are the two nodes are linked by an edge. A network can have directed or undirected edges and in this network all the edges are undirected `type`. The `value` attribute of every edge tells us the number of interactions that the characters have had over the book, and the `book` column tells us the book number.

In data directory, there are also a `nodes.json` file where saved all nodes data and will become `source` or `target` in `links.json` file, and `characters.json` file contains the detailed information of the characters.

## Force-directed Graph

A Force-Directed Graph, or Force-Based Graph, is a type of layout commonly used in network visualization. It is used to visualize the connections between objects in a network. By grouping the objects connected to each other in a natural way, a Force-Directed Graph is visually interesting and also makes it possible to discover subtle relationships between groups.

These graphs have the particularity of being drawn by algorithms called "force-directed graph drawing algorithms" or "force-directed graph drawing algorithms".

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

Open [https://got-viz-qnn.netlify.app/](https://got-viz-qnn.netlify.app/) to view it in deployed version.