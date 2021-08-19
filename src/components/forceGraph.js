import React from "react";
import { runForceGraph } from "./forceGraphGenerator";
import styles from "./forceGraph.module.css";

// Create the container for the generated force graph
export const ForceGraph = ({ linksData, nodesData, nodeHoverTooltip }) => {
    // Create a reference to the div which will wrap the graph
    const containerRef = React.useRef(null);
    React.useEffect(() => {
        // Create a destroy function to handle the clean up if the component is removed from the DOM
        let destroyFn;
        if(containerRef.current) {
            const { destroy } = runForceGraph(containerRef.current, linksData, nodesData, nodeHoverTooltip);
            destroyFn = destroy;
        }
        return destroyFn;
    }, [linksData, nodesData, nodeHoverTooltip]);
    return (
        <div ref={containerRef} className={styles.container}></div>
    )
}