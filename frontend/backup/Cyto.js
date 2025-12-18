import React, { useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import './Cytoscape.css'; // Import your CSS file for styling

function Cytoscape() {
//   const [elements, setElements] = useState([
//     // Central node (positioned at the center)
//     { data: { id: 'center', label: 'Center Node' }, position: { x: 250, y: 250 } },
//   ]);

//   const [focusedNodeId, setFocusedNodeId] = useState(null); // Track the ID of the focused node

//   useEffect(() => {
//     // Generate more nodes dynamically and connect them to the central node
//     const numNodes = 5; // Number of nodes to generate

//     for (let i = 1; i <= numNodes; i++) {
//       const newNodeId = `node${i}`;

//       // Add a new node
//       const newNode = { data: { id: newNodeId, label: `Node ${i}` } };
//       setElements((prevElements) => [...prevElements, newNode]);

//       // Create an edge from the new node to the central node
//       const newEdge = {
//         data: {
//           source: newNodeId,
//           target: 'center', // Connect to the central node
//           label: `Edge from ${newNodeId} to Center Node`,
//         },
//       };
//       setElements((prevElements) => [...prevElements, newEdge]);
//     }
//   }, []);

//   useEffect(() => {
//     // Check if a node ID is set for focusing
//     if (focusedNodeId) {
//       // Use Cytoscape's center method to focus on the specified node
//       const cy = window.cy; // Assuming you have a reference to the Cytoscape instance

//       if (cy) {
//         cy.center(cy.$(`#${focusedNodeId}`)); // Center the viewport on the specified node
//       }
//     }
//   }, [focusedNodeId]);

//   // Function to handle focusing on a node
//   const focusOnNode = (nodeId) => {
//     setFocusedNodeId(nodeId); // Set the node ID to focus on
//   };

//   return (
//     <div className="cytoscape-container">
//       <CytoscapeComponent
//   elements={CytoscapeComponent.normalizeElements({
//     nodes: [
//       { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
//       { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } }
//     ],
//     edges: [
//       {
//         data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' }
//       }
//     ]
//   })}
// />
//     </div>
//   );
const elements = [
  { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
  { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
  { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
];

return <CytoscapeComponent elements={elements} style={ { width: '600px', height: '600px' } } />;









}

export default Cytoscape;
