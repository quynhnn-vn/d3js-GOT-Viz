import React from "react";
import { runForceGraph } from "./forceGraphGenerator";
import styles from "./forceGraph.module.css";

export const ForceGraph = ({ linksData, nodesData, nodeHoverTooltip }) => {
    const containerRef = React.useRef(null);
    React.useEffect(() => {
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