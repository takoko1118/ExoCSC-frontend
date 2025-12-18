// import { useState, useEffect } from 'react';
// import { MDBDataTable } from 'mdbreact';
// import 'mdbreact/dist/css/mdb.css';

// import data from '../Data/gene.json';
// import './page.css'

// import { Link } from 'react-router-dom';



// const GeneTable = () => {
  
  

//   const [alphabet,setAlphabet]=useState('');
//   const onAlphabetClick = (e) => {
    
//         setAlphabet(e.target.value)
//         console.log('setAlphabet',setAlphabet)
//       }
    
//   const prepareAlphabets = () => {
//         let result = [];
//         for(let i=65; i<91; i++) {
//           result.push(
//             <button style={{
//               color: 'blue',
//               // 需改為駝峰式命名
//               fontSize:14,
//               fontWeight:600,
//               width:30 ,
//               height:30 ,
//               textAlign: 'center',
//               // color: isHover ? 'red' : 'green',
//             }}type="button" key={i} onClick={onAlphabetClick} value={String.fromCharCode(i)} >{String.fromCharCode(i)}</button>
//           )
//         }
        
//         return result;
//       }    



      
//   const [Genedata, setGeneData] = useState([]);


      


//   useEffect(() => {
//     fetch("http://db.cmdm.tw:8000/search/table/Gene/")
//       .then((response) => {
//         return response.json();
//       })
//       .then((res) => {
        
        
//         const Genedata = {
//           columns: [
            
            
           
//             {
//               label: "Gene",
//               field: "cargo",
//               sort: "asc",
//               width: 150,
//             },
//             {
//               label: "Gene symbol",
//               field: "",
//               sort: "asc",
//               width: 150,
//             },
//             {
//               label: "Tissue",
//               field: "tissue",
//               sort: "asc",
//               width: 15,
//             },
//             {
//               label: "Cancer cell type",
//               field: "cellType",
//               sort: "asc",
//               width: 150,
//             },
//             {
//               label: "Specimen",
//               field: "clinicalUse",
//               sort: "asc",
//               width: 150,
//             },

//             {
//               label: "PMCID",
//               field: "pmcid",
//               sort: "asc",
//               width: 150,
//             },
//           ],
          
       
//           rows: res.results.filter(el=> el.cargo.toLowerCase().startsWith(alphabet.toLowerCase())).map((apiData) => (
//             {molecularType: apiData.molecularType ,
//               cargo: 
//               (
//                 // wrap the cargo value with Link component
//                 <Link to={`/gene/${apiData.id}`}style={{ color: 'blue' }}>{apiData.cargo}</Link>
//               ),
//                 tissue:apiData.tissue,
//                 cellType:apiData.cellType, 
//                 clinicalUse:apiData.clinicalUse,
//                 // pmcid:apiData.pmcid,
//                 pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`}style={{ color: 'blue' }}>{apiData.pmcid}</a>,
//             })),
          


//         };
        
//         setGeneData(Genedata);
//         // console.log('isres',res)
//         console.log('isGenedata',Genedata)
//         console.log('isalpha',alphabet)
        
//       });
//   }, [alphabet]);
  


  

//   return (
//     <div>
//          <p className='associated'>Associated Gene markers</p>
        
        
//          <div style={{marginLeft:250}}>{prepareAlphabets()}</div>
//             <MDBDataTable striped bordered hover data={Genedata} />   
//     </div>
       
//   );
// };

// export default GeneTable;

import React from 'react';
import { useState, useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

import data from '../Data/gene.json';
import './page.css'

import { Link } from 'react-router-dom';

const GeneTable = () => {
  const [alphabet, setAlphabet] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state variable

  const onAlphabetClick = (e) => {
    setAlphabet(e.target.value);
  }

  const prepareAlphabets = () => {
    let result = [];
    for (let i = 65; i < 91; i++) {
      result.push(
        <button
          style={{
            color: 'blue',
            fontSize: 14,
            fontWeight: 600,
            width: 30,
            height: 30,
            textAlign: 'center',
          }}
          type="button"
          key={i}
          onClick={onAlphabetClick}
          value={String.fromCharCode(i)}
        >
          {String.fromCharCode(i)}
        </button>
      );
    }

    return result;
  }

  const [Genedata, setGeneData] = useState([]);

  useEffect(() => {
    setIsLoading(true); // Set isLoading to true before starting the fetch request

    fetch("http://db.cmdm.tw:8000/search/table/Gene/")
      .then((response) => response.json())
      .then((res) => {
        const Genedata = {
          columns: [
            {
              label: "Gene",
              field: "cargo",
              sort: "asc",
              width: 150,
            },
            {
              label: "Gene symbol",
              field: "entrezname",
              sort: "asc",
              width: 150,
            },
            {
              label: "Tissue",
              field: "tissue",
              sort: "asc",
              width: 15,
            },
            {
              label: "Cancer cell type",
              field: "cellType",
              sort: "asc",
              width: 150,
            },
            {
              label: "Specimen",
              field: "clinicalUse",
              sort: "asc",
              width: 150,
            },
            {
              label: "PMCID",
              field: "pmcid",
              sort: "asc",
              width: 150,
            },
          ],
          rows: res.results.filter(el => el.cargo.toLowerCase().startsWith(alphabet.toLowerCase())).map((apiData) => ({
            molecularType: apiData.molecularType,
            cargo: (
              <Link to={`/gene/${apiData.id}`} style={{ color: 'blue' }}>{apiData.cargo}</Link>
            ),
            entrezname:apiData.entrezName,
            tissue: apiData.tissue,
            cellType: apiData.cellType,
            clinicalUse: apiData.clinicalUse,
            pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`} style={{ color: 'blue' }}>{apiData.pmcid}</a>,
          })),
        };

        setGeneData(Genedata);
        setIsLoading(false); // Set isLoading to false when the data is fetched
      })
      .catch((error) => {
        console.error('Error fetching gene data:', error);
        setIsLoading(false); // Set isLoading to false even if an error occurs
      });
  }, [alphabet]);

  return (
    <div>
      <p className='associated'>Associated potential genes</p>

      <div style={{ marginLeft: 250 }}>{prepareAlphabets()}</div>

      {isLoading ? (
        <div>Loading...</div> // Show loading message while isLoading is true
      ) : (
        <MDBDataTable striped bordered hover data={Genedata} />
      )}
    </div>
  );
};

export default GeneTable;





