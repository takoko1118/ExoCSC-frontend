import { useState, useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import React from 'react';
import 'mdbreact/dist/css/mdb.css';
// import data from '../Data/ALL.json';
import './page.css'
import { Link } from 'react-router-dom';

  
  

  function ALLTable() {
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
        console.log('this is from api maybe ALLtable')
        return result;
      }    

  const [Alldata, setAllData] = useState([]); 
      
  useEffect(() => {
    fetch("http://db.cmdm.tw:8000/ALL/")
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        
        
        const Alldata = {
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
          
       
          rows: res.results.filter(el=> el.cargo.toLowerCase().startsWith(alphabet.toLowerCase())).map((apiData) => (
            {molecularType: apiData.molecularType ,
                //cargo: <a href={`http://db.cmdm.tw:13007/search/${apiData.id}`}>{apiData.cargo}</a>,
                // apiData.cargo,
                cargo: 
                (
                  // wrap the cargo value with Link component
                  <Link to={`/all/${apiData.id}`}>{apiData.cargo}</Link>
                ),
                tissue:apiData.tissue,
                cellType:apiData.cellType, 
                clinicalUse:apiData.clinicalUse,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`}>{apiData.pmcid}</a>,
            })),
          


        };
        
        setAllData(Alldata);
        // console.log('isres',res)
        console.log('isAlldata',Alldata)
        console.log('isalpha',alphabet)
        
        
      });
  }, [alphabet]);
    
  return (
    <div>
       <div>
         <p className='associated'> markers</p>
        
        
         <div style={{marginLeft:250}}>{prepareAlphabets()}</div>
            <MDBDataTable striped bordered hover data={Alldata} />   
    </div>
      
    </div>
  );
}

export default ALLTable;



