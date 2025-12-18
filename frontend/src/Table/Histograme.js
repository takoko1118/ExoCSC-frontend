import React, { useEffect, useState } from 'react';
import Plotly from 'plotly.js-dist-min';
import list36Data from '../Data/list36.json';
import './Histograme.css';
import { MDBDataTable } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from './Cytoscape.js'
import Cyto from './Cyto.js'


function formatScientificNotation(number, decimalPlaces) {
    // Format the number in scientific notation with a fixed number of decimal places
    return Number(number).toExponential(decimalPlaces);
}
function Histograme({ index }) {
    const [elements, setElements] = useState([
        // Central node (positioned at the center)
        { data: { id: 'center', label: 'Center Node' }, position: { x: 250, y: 250 } },
      ]);
    
    const [tableData, setTableData] = useState({ columns: [], rows: [] });  
      useEffect(() => {
        // Generate more nodes dynamically and connect them to the central node
        const numNodes = 5; // Number of nodes to generate
    
        for (let i = 1; i <= numNodes; i++) {
          const newNodeId = `node${i}`;
    
          // Add a new node
          const newNode = { data: { id: newNodeId, label: `Node ${i}` } };
          setElements((prevElements) => [...prevElements, newNode]);
    
          // Create an edge from the new node to the central node
          const newEdge = {
            data: {
              source: newNodeId,
              target: 'center', // Connect to the central node
              label: `Edge from ${newNodeId} to Center Node`,
            },
          };
          setElements((prevElements) => [...prevElements, newEdge]);
        }


         // Dynamic import of data based on index

    const fetchData = async () => {
        
        try {
          //const dataModule = await import(`../Data/list${index}.json`);
          const dataModule = await import(`../Data/RNA_GO/RNA_id_${index}_geneClusterReport.json`);
          //RNA_id_25_geneClusterReport
          const listData = dataModule.default;
         
         console.log('listData:', listData);
         console.log('listData[0]:', listData[0]);
         console.log('listData[Category Term Data]:', listData[0]['Category Term Data']);
          // Your existing code that uses listData goes here
          // ...
          const goColorMap = {
            BP: { name: 'Biological Process', color: 'red' },
            MF: { name: 'Molecular Function', color: 'blue' },
            CC: { name: 'Cellular Component', color: 'green' },
            // Add more categories and colors as needed
        };
          const newTableData = {
            columns: [
    
                {
                    label: 'GO Term',
                    field: 'Category',
                    sort: 'asc',
                    // ... other column options
                },
                {
                    label: 'Functional Description',
                    field: 'Term',
                    sort: 'asc',
                    // ... other column options
                },
                {
                    label: 'Count',
                    field: 'Count',
                    sort: 'asc',
                    // ... other column options
                },
                {
                    label: 'Genes',
                    field: 'Genes',
                    sort: 'asc',
                    // ... other column options
                },
                {
                    label: 'p-value',
                    field: 'Pvalue',
                    sort: 'asc',
                    // ... other column options
                },
    
                {
                    label: 'FDR',
                    field: 'FDR',
                    sort: 'asc',
                    // ... other column options
                },
                // Add more column definitions as needed
            ],
            
            //rows: listData.map((item, index) => ({
            rows: listData[0]['Category Term Data'].map((item, index) => ({
                Category: item['Category Name'],
                //Term: `${item.Term}~${item['Term Description']}`,
                Term: item['Term Description'],
                Count: item['List Hits'],
                Genes: item.Genes,
                Pvalue: formatScientificNotation(item['P Value'], 2),
                FDR: formatScientificNotation(item.FDR, 2),
                
                //'Category': item.Category,
                //Term: item.Genes,
                // Count: item.Count,
                // Map other properties accordingly
                // For example: Count: item.Count, Pvalue: item.Pvalue, etc.
            })),
            
        };

        console.log(   'console.log(newTableData)', newTableData)
        setTableData(newTableData); // Set the table data


        const terms = listData[0]['Category Term Data'].map((item) => item['Term Description']);
        const pvalues = listData[0]['Category Term Data'].map((item) => formatScientificNotation(item['P Value'], 2));
        const goCategories = listData[0]['Category Term Data'].map((item) => item['Category Name']); 
        const goGO = listData[0]['Category Term Data'].map((item) => item['GO']); 


        console.log('goCategories:', goCategories); // Debugging: Check if goCategories contains the expected values
        console.log('terms', terms)
        console.log('goGO', goGO)
        //const colors = goCategories.map((goCategory) => goColorMap[goCategory]?.color || 'grey'); // Use 'gray' as a fallback
        const colors = goGO.map((GO) => goColorMap[GO]?.color || 'grey'); // Use 'gray' as a fallback

        console.log('colors:', colors); // Debugging: Check if colors are correctly mapped


        // Create a trace for the bar chart with colors
        const trace = {
            x: pvalues,
            y: terms,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: colors, // Assign colors based on 'GO' values
            },
        };
        console.log('trace', trace)
        
        const data = [trace];

        const layout = {
            title: 'Gene ontology (GO) enrichment analysis',
            xaxis: {
                title: '-log 10(p-value)',
                range: [0, 3], // Set the x-axis range
            },
            yaxis: {
                title: 'Term',
                automargin: true, // Enable automatic margin adjustment for y-axis labels
                fixedrange: true, // Disable zooming on the y-axis
            },
        };

            
        Plotly.newPlot('gd', data, layout);


        } catch (error) {
          console.error('Error loading data:', error);
        }
        
      };
      
  
      fetchData();

      

      }, [index]);
    



    
    

    

    // useEffect(() => {

    //     // Extract 'Term', 'Pvalue', and 'GO' data from list36.json
    //     //const terms = list36Data.map((item) => item.Term);

    //     const terms = list36Data.map((item) => item.Term);
    //     // const pvalues = list36Data.map((item) => item.Pvalue);
    //     const pvalues = list36Data.map((item) => formatScientificNotation(item.Pvalue, 2));
    //     const goCategories = list36Data.map((item) => item.GO); // Assuming 'GO' is a valid field in your JSON data

    //     //console.log('goCategories:', goCategories); // Debugging: Check if goCategories contains the expected values
    //     //console.log('terms', terms)
    //     // Create an array of colors based on 'GO' values
    //     const colors = goCategories.map((goCategory) => goColorMap[goCategory]?.color || 'gray'); // Use 'gray' as a fallback

    //     console.log('colors:', colors); // Debugging: Check if colors are correctly mapped
        
    //     // Create a trace for the bar chart with colors
    //     const trace = {
    //         x: pvalues,
    //         y: terms,
    //         type: 'bar',
    //         orientation: 'h',
    //         marker: {
    //             color: colors, // Assign colors based on 'GO' values
    //         },
    //     };
    //     console.log('trace', trace)
        
    //     const data = [trace];

    //     const layout = {
    //         title: 'Gene ontology (GO) enrichment analysis',
    //         xaxis: {
    //             title: '-log 10(p-value)',
    //             range: [0, 5], // Set the x-axis range
    //         },
    //         yaxis: {
    //             title: 'Term',
    //             automargin: true, // Enable automatic margin adjustment for y-axis labels
    //             fixedrange: true, // Disable zooming on the y-axis
    //         },
    //     };

    //    Plotly.newPlot('gd', data, layout);
    // }, []);

    return (
        <div>
        <>Index Value: {index}</>
        <div style={{ position: 'relative' }}>
          <div id="gd" style={{ width: '100%', height: '500px', position: 'absolute', top: 0, left: 0 }}>
            {/* This div will be used as the container for the bar chart */}
          </div>
  
          <div className="legend" style={{ position: 'absolute', top: 500, right: 0 }}>
            {/* Add any legend content here */}
            <MDBDataTable striped bordered hover data={tableData} />
          </div>
        </div>
  
        {/* Separate container for MDBDataTable */}
        <div className="data-container">
        
        </div>
      </div>
    );
}

export default Histograme;

