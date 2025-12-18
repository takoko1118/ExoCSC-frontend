import React, { useState } from "react";
import "./Cytoscape.css";
import CytoscapeComponent from "react-cytoscapejs";

export default function Cytoscape() {
  const [width, setWith] = useState("100%");
  const [height, setHeight] = useState("400px");
  const [graphData, setGraphData] = useState({
    nodes: [
      { data: { id: "1", label: "C", type: "center" } },
      { data: { id: "2", label: "Device 1", type: "device" } },
      { data: { id: "3", label: "Center", type: "center" } },
      { data: { id: "4", label: "Device 2", type: "device" } },
      { data: { id: "5", label: "Device 3", type: "device" } },
     
    ],
    edges: [
      {
        data: { source: "3", target: "1", label: "center" }
      },
      {
        data: { source: "3", target: "2", label: "center" }
      },
      {
        data: { source: "3", target: "4", label: "Node4" }
      },
      {
        data: { source: "3", target: "5", label: "Node5" }
      },
     
    ]
  });

  const layout = {
    name: "breadthfirst",
    fit: true,
    // circle: true,
    directed: true,
    padding: 50,
    // spacingFactor: 1.5,
    animate: true,
    animationDuration: 1000,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: false
  };

  const styleSheet = [
    {
      selector: "node",
      style: {
        backgroundColor: "#4a56a6",
        width: 30,
        height: 30,
        label: "data(label)",

        // "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "text-valign": "center",
        // "text-halign": "center",
        "overlay-padding": "6px",
        "z-index": "10",
        //text props
        "text-outline-color": "#4a56a6",
        "text-outline-width": "2px",
        color: "white",
        fontSize: 20
      }
    },
    {
      selector: "node:selected",
      style: {
        "border-width": "6px",
        "border-color": "#AAD8FF",
        "border-opacity": "0.5",
        "background-color": "#77828C",
        width: 50,
        height: 50,
        //text props
        "text-outline-color": "#77828C",
        "text-outline-width": 8
      }
    },
    {
      selector: "node[type='device']",
      style: {
        shape: "rectangle"
      }
    },
    {
      selector: "edge",
      style: {
        width: 3,
        // "line-color": "#6774cb",
        "line-color": "#AAD8FF",
        "target-arrow-color": "#6774cb",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier"
      }
    }
  ];

  let myCyRef;

  return (
    <>
      <div>
        <h1>Cytoscape example</h1>
        <div
          style={{
            border: "1px solid",
            backgroundColor: "#f5f6fe"
          }}
        >
          <CytoscapeComponent
            elements={CytoscapeComponent.normalizeElements(graphData)}
            // pan={{ x: 200, y: 200 }}
            style={{ width: width, height: height }}
            zoomingEnabled={true}
            maxZoom={3}
            minZoom={0.1}
            autounselectify={false}
            boxSelectionEnabled={true}
            layout={layout}
            stylesheet={styleSheet}

            panningEnabled={true}
            userPanningEnabled={true}
            userZoomingEnabled={true}
            cy={cy => {
              myCyRef = cy;

              console.log("EVT", cy);

              cy.on("tap", "node", evt => {
                var node = evt.target;
                console.log("EVT", evt);
                console.log("TARGET", node.data());
                console.log("TARGET TYPE", typeof node[0]);
              });
            
               // Ensure elements are grabbable (movable)
               cy.nodes().grabify();
               cy.edges().grabify();
             
            }}
            abc={console.log("myCyRef", myCyRef)}
          />
        </div>
      </div>
    </>
  );
}
