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
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  // Get width and height of the container
  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  // Calculate number of links connected to a node in order to define the radius of node
  const getNodeSize = (d) => {
    let count = 0;
    linksData.forEach((link) => {
      if (link.source === d.id || link.target === d.id) {
        count++;
      }
    });
    return count;
  };

  // Handle the behavior of drag events
  const dragGraph = (simulation) => {
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
        .style("top", `${y - 28}px`);
    };
    // Handle mouse out event: hide the tooltip
    const removeTooltip = () => {
      div.transition().duration(200).style("opacity", 0);
    };
  
  // Create a simulation with the array of nodes
  // and assign the force for the specified name
  const simulation = d3
  .forceSimulation(nodes)
  .force("link", d3
      .forceLink(links)
      .id((d) => d.id)
      .distance(200)
  )
  .force("charge", d3.forceManyBody().strength(-150))
  .force("center", d3.forceCenter(width / 2, height / 2));
  
  // Add a svg element to draw nodes and links
  // and call zoom function
  const svg = d3
  .select(container)
  .append("svg")
  .attr("viewBox", [0, 0, width, height])
  .call(
    d3.zoom().on("zoom", function (event) {
      g.attr("transform", event.transform);
    })
  );
  
  // Add a g element to svg in order to group svg shapes together
  const g = svg.append("g");

  // Create a link element to the graph and assign its data as links array
  let link = g
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.2)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));
  
  // Create a node element to the graph and assign its data as nodes array
  let node = g
    .append("g")
    .attr("stroke", "#fff")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", (d) => (getNodeSize(d) ? getNodeSize(d) : 5))
    .attr("fill", "white")
    .attr("opacity", 0.3)
    .call(dragGraph(simulation));
  
  // Add a text label to the graph and assign its data as node.id
  let label = g
    .append("g")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "start")
    .attr("dominant-baseline", "central")
    .attr("fill", "white")
    .text((d) => d.id)
    .attr("font-size", "10px")
    .call(dragGraph(simulation));

    d3.select("#selectButton")
    .selectAll("myOptions")
    .data(nodes)
    .enter()
    .append("option")
    .text((d) => d.id)
    .attr("value", (d) => d.id);
  
  const updateGraph = (filterId) => {

    const filteredLinks = linksData.filter(d => d.source === filterId || d.target === filterId).map(d => Object.assign({}, d));
    const relatedNodes = filteredLinks.map(d => d.source !== filterId ? d.source : d.target)
    const filteredNodes = nodesData.filter(d => d.id === filterId || relatedNodes.indexOf(d.id) >= 0).map(d => Object.assign({}, d));
    
    node.data(filteredNodes);
    node.exit().remove();
    const newNode = node.join("circle").attr("r", (d) => (getNodeSize(d) ? getNodeSize(d) * 1.5 : 5)).attr("fill", "white").attr("opacity", 0.3).call(dragGraph(simulation));
    node = node.merge(newNode);

    link.data(filteredLinks);
    link.exit().remove();
    const newLink = link.join("line").attr("stroke-width", (d) => Math.sqrt(d.value));
    link = link.merge(newLink);

    // Handle tick event
    simulation.on("tick", () => {
      // Update link positions
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
  
      // Update node positions
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  
      // Update label positions
      label
        .attr("x", (d) => {
          return d.x;
        })
        .attr("y", (d) => {
          return d.y;
        });
    })

    // label.data(filteredNodes).enter().append("text")
    // .attr("text-anchor", "start")
    // .attr("dominant-baseline", "central")
    // .attr("fill", "white")
    // .text((d) => d.id)
    // .attr("font-size", "17px")
    // .call(drag(simulation));
  }

  d3.select("#selectButton").on("change", (d) => {
    let filterId = d3.select("#selectButton").node().value;
    console.log(filterId);
    updateGraph(filterId);
  })

  // Call mouse over and mouse out event on label element
  label
    .on("mouseover", (event, d) => {
      addTooltip(nodeHoverTooltip, d, event.pageX, event.pageY);
    })
    .on("mouseout", () => {
      removeTooltip();
    });
  
  // Handle tick event
  simulation.on("tick", () => {
    // Update link positions
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    // Update node positions
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    // Update label positions
    label
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y;
      });
  });

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
