import { useState, useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import React from 'react';
import 'mdbreact/dist/css/mdb.css';
import data from '../Data/gene.json';

function MyComponent() {
    const [alphabet,setAlphabet]=useState('');
  const onAlphabetClick = (e) => {
    
        setAlphabet(e.target.value)
        console.log('setAlphabet',setAlphabet)
      }
    
  const prepareAlphabets = () => {
        let result = [];
        for(let i=65; i<91; i++) {
          result.push(
            <button style={{
              color: 'blue',
              // 需改為駝峰式命名
              fontSize:14,
              fontWeight:600,
              width:30 ,
              height:30 ,
              textAlign: 'center',
              // color: isHover ? 'red' : 'green',
            }}type="button" key={i} onClick={onAlphabetClick} value={String.fromCharCode(i)} >{String.fromCharCode(i)}</button>
          )
        }
        console.log('hekkko')
        return result;
      }    

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
            field: "",
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
        
     
        rows: data.results.filter(el=> el.cargo.toLowerCase().startsWith(alphabet.toLowerCase())).map((apiData) => (
          {molecularType: apiData.molecularType ,
              cargo:apiData.cargo, 
              tissue:apiData.tissue,
              cellType:apiData.cellType, 
              clinicalUse:apiData.clinicalUse,
              // pmcid:apiData.pmcid,
              pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`}>{apiData.pmcid}</a>,
          })),
        


      };
  return (
    <div>
       <div>
         <p className='associated'>Associated Gene markers</p>
        
        
         <div style={{marginLeft:250}}>{prepareAlphabets()}</div>
            <MDBDataTable striped bordered hover data={Genedata} />   
    </div>
      
    </div>
  );
}

export default MyComponent;

// function MyComponent() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//         const response = await fetch('/api/Gene');
        
//         const text = await response.text();
//         console.log('this is',text);
//         const json = JSON.parse(text);
//         setData(json);
//       }
  
//     fetchData();
//   }, []);
  
//   console.log('this is testing')
//   return (
   
//     <div>
//         hello api
//       {/* {data.map(item => (
//         <p>{item.name}</p>
//       ))} */}
//     </div>
//   );
// }

// export default MyComponent;
