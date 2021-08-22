import * as d3 from "d3";
import styles from "./forceGraph.module.css";

// Function that will be responsibe to generate the graph
export const runForceGraph = (
  container,
  linksData,
  nodesData,
  nodeHoverTooltip,
) => {
  // Copy the data to new arrays
  let links = linksData.map((d) => Object.assign({}, d));
  let nodes = nodesData.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  let linkElements, nodeElements, textElements;

  const simulation = d3.forceSimulation()
                       .force("link", d3.forceLink().id((d) => d.id).distance(200))
                       .force("charge", d3.forceManyBody().strength(-150))
                       .force("center", d3.forceCenter(width / 2, height / 2))
  
  // Add a svg element to draw nodes and links and call zoom function
  const svg = d3.select(container).append("svg")
                .attr("viewBox", [0, 0, width, height])
                .call(d3.zoom().on("zoom", (event) => g.attr("transform", event.transform))
  );
  
  // Add a g element to svg in order to group svg shapes together
  const g = svg.append("g");

  // Use svg groups to logically group the elements together
  const linkGroup = g.append('g').attr('class', 'links').attr("stroke", "#999").attr("stroke-opacity", 0.2)
  const nodeGroup = g.append('g').attr('class', 'nodes')
  const textGroup = g.append('g').attr('class', 'texts')

  d3.select("#selectStark").on("click", () => changeGraph("Stark"));
  d3.select("#selectBaratheon").on("click", () => changeGraph("Baratheon"));
  d3.select("#selectLannister").on("click", () => changeGraph("Lannister"));
  d3.select("#selectTargaryen").on("click", () => changeGraph("Targaryen"));

  const changeGraph = (houseName) => {
    const houseNodes = nodesData.filter(d => d.id.includes(houseName));
    let newFilteredLinks = [];
    let newFilteredNodes = [];
    houseNodes.forEach(node => {
      const filteredLinks = linksData.filter(d => d.source === node.id || d.target === node.id).map(d => Object.assign({}, d));
      newFilteredLinks.push(filteredLinks);
      const relatedNodes = filteredLinks.map(d => d.source !== node.id ? d.source : d.target)
      newFilteredNodes.push(nodesData.filter(d => d.id === node.id || relatedNodes.indexOf(d.id) >= 0).map(d => Object.assign({}, d)));
    });
    newFilteredLinks = [].concat(...newFilteredLinks);
    const flattedFilteredNodes = [].concat(...newFilteredNodes);
    newFilteredNodes = [...new Map(flattedFilteredNodes.map(item => [item["id"], item])).values()];
    links = newFilteredLinks;
    nodes = newFilteredNodes;

    updateSimulation();
  }

  // Calculate number of links connected to a node in order to define the radius of node
  const getNodeSize = (d) => {
    let count = 0;
    linksData.forEach((link) => {
      if (link.source === d.id || link.target === d.id) count++;
    });
    return count;
  };

  // Handle the behavior of drag events
  const dragHandler = (simulation) => {
    const dragstarted = (event) => {
      if (!event.active) simulation.alphaTarget(0.5).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    };
    const dragged = (event) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    };
    const dragended = (event) => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    };
    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  // Handle the behavior of tick event: update link/node/label positions
  const tickHandler = () => {
    linkElements.attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);
    nodeElements.attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y);
    textElements.attr("x", (d) => d.x)
                .attr("y", (d) => d.y);
  }

  // Create div element for tooltip
  const tooltip = document.querySelector("#graph-tooltip");
    if (!tooltip) {
      const tooltipDiv = document.createElement("div");
      tooltipDiv.classList.add(styles.tooltip);
      tooltipDiv.style.opacity = "0";
      tooltipDiv.id = "graph-tooltip";
      document.body.appendChild(tooltipDiv);
    }
  const div = d3.select("#graph-tooltip");

  // Handle mouse over event: show the tooltip
  const addTooltip = (hoverTooltip, d, x, y) => {
    div.transition().duration(200).style("opacity", 0.9);
    div
      .html(hoverTooltip(d))
      .style("left", `${x}px`)
      .style("top", `${y - 12}px`);
    };
  // Handle mouse out event: hide the tooltip
  const removeTooltip = () => {
    div.transition().duration(200).style("opacity", 0);
  };
  
  nodes = nodes.sort((a,b) => d3.ascending(a.id, b.id));
  nodes.unshift({
    "id": "All Characters"
  });
  d3.select("#selectList")
                    .selectAll("myOptions")
                    .data(nodes)
                    .enter()
                    .append("option")
                    .text((d) => d.id.split("-").join(" "))
                    .attr("value", (d) => d.id);

  const filterData = (filterId) => {
    if (filterId !== "All Characters") {
      const filteredLinks = linksData.filter(d => d.source === filterId || d.target === filterId).map(d => Object.assign({}, d));
      const relatedNodes = filteredLinks.map(d => d.source !== filterId ? d.source : d.target)
      const filteredNodes = nodesData.filter(d => d.id === filterId || relatedNodes.indexOf(d.id) >= 0).map(d => Object.assign({}, d));
      links = filteredLinks;
      nodes = filteredNodes;
    } else {
      links = linksData.map((d) => Object.assign({}, d));
      nodes = nodesData.map((d) => Object.assign({}, d));
    }
    updateSimulation();
  }

  const updateGraph = () => {
    linkElements = linkGroup.selectAll("line").data(links);
    linkElements.exit().remove();
    const linkEnter = linkElements.join("line")
                                  .attr("stroke-width", (d) => Math.sqrt(d.value));
    linkElements = linkEnter.merge(linkElements);

    nodeElements = nodeGroup.selectAll("circle").data(nodes);
    nodeElements.exit().remove();
    const nodeEnter = nodeElements.join("circle")
                                  .attr("r", (d) => (getNodeSize(d) ? getNodeSize(d) * 1.5 : 5))
                                  .attr("fill", "white").attr("opacity", 0.5)
                                  .call(dragHandler(simulation));
    nodeElements = nodeEnter.merge(nodeElements);

    textElements = textGroup.selectAll("text").data(nodes);
    textElements.exit().remove();
    const textEnter = textElements.join("text")
                                  .attr("text-anchor", "start")
                                  .attr("dominant-baseline", "central")
                                  .attr("fill", "white")
                                  .text((d) => d.id.split("-").join(" "))
                                  .attr("font-size", 12)
                                  .call(dragHandler(simulation));
    textElements = textEnter.merge(textElements);

    // Call mouse over and mouse out event on label element
    textElements.on("mouseover", (event, d) => addTooltip(nodeHoverTooltip, d, event.pageX, event.pageY))
                .on("mouseout", () => removeTooltip())

    d3.select("#selectList").on("change", (d) => {
      let filterId = d3.select("#selectList").node().value;
      filterData(filterId);
    })
  }

  const updateSimulation = () => {
    updateGraph();
    simulation.nodes(nodes).on("tick", () => tickHandler())
    simulation.force('link').links(links);
    simulation.alphaTarget(0.5).restart();
  }
  updateSimulation()

  // return destroy function for ForceGraph component and nodes object to update svg element
  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    },
  };
};
