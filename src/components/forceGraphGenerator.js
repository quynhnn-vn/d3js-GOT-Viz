import * as d3 from "d3";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./forceGraph.module.css";
import "d3-transition";

export const runForceGraph = (
  container,
  linksData,
  nodesData,
  nodeHoverTooltip
) => {
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  const width = 960;
  const height = 900;

  const getNodeSize = (nodeId) => {
    let radius;
    const filteredLinks = linksData.filter(
      (link) => link.source === nodeId
    );
    if (filteredLinks) {
      filteredLinks.forEach((link) => {
        const value = parseInt(link.value)
        if (value > 30) { radius = 30 }
        else { radius = 5 };
      });
    } else {
      radius = 5;
    }
    console.log(radius);
    return radius;
  };

  const drag = (simulation) => {
    const dragstarted = (event) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
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

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(200)
    )
    .force("charge", d3.forceManyBody().strength(-150))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .call(
      d3.zoom().on("zoom", function (event) {
        g.attr("transform", event.transform);
      })
    );
  const g = svg.append("g");

  const link = g
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.2)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const node = g
    .append("g")
    .attr("stroke", "#fff")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", (d) => getNodeSize(d.id))
    .attr("fill", "white")
    .attr("opacity", 0.3)
    .call(drag(simulation));

  const label = g
    .append("g")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "start")
    .attr("dominant-baseline", "central")
    .attr("fill", "white")
    .text((d) => d.id)
    .attr("font-size", "17px")
    .call(drag(simulation));

  label
    .on("mouseover", (event, d) => {
      addTooltip(nodeHoverTooltip, d, event.pageX, event.pageY);
    })
    .on("mouseout", () => {
      removeTooltip();
    });

  simulation.on("tick", () => {
    //update link positions
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    // update node positions
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    //update label positions
    label
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y;
      });
  });
  // Add the tooltip element to the graph
  const tooltip = document.querySelector("#graph-tooltip");
  if (!tooltip) {
    const tooltipDiv = document.createElement("div");
    tooltipDiv.classList.add(styles.tooltip);
    tooltipDiv.style.opacity = "0";
    tooltipDiv.id = "graph-tooltip";
    document.body.appendChild(tooltipDiv);
  }
  const div = d3.select("#graph-tooltip");
  const addTooltip = (hoverTooltip, d, x, y) => {
    div.transition().duration(200).style("opacity", 0.9);
    div
      .html(hoverTooltip(d))
      .style("left", `${x}px`)
      .style("top", `${y - 28}px`);
  };
  const removeTooltip = () => {
    div.transition().duration(200).style("opacity", 0);
  };

  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    },
  };
};
