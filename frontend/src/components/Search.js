import React, { Component,useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

import { MDBDataTable, MDBTable, MDBTableHead } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
// import './Table/page.css'
import "../components/Tab/Tab.js"
import './Search.css'
// import { MDBBtn } from 'mdb-react-ui-kit';

import Alphabet from '../components/alphbet.js';
import { render } from "@testing-library/react";

const Fetch =async word =>{
      const url='http://127.0.0.1:8000/search/'

      

      const {data} =await axios.get(
        
        `http://127.0.0.1:8000/search/${word}/`
      );
      return data;
      
}


const SearchPlusTab =()=>{
  const[query,setQuery]=useState('table/ALL');
  const [tab, setTab] = useState([]);
  const [toggleState, setToggleState] = useState(1);  
  const [alphaData,setAlpha]=useState();
  const [alphabet,setAlphabet]=useState('');

  const filterAlpha=()=>{
    
    let alpharesult=[];
    
    const alphaTable={
      
      beta:data.results.map((apiData) => (
        {
         molecularType: apiData.molecularType ,
         cargo:apiData.cargo, 
         tissue:apiData.tissue,
         cellType:apiData.cellType, 
         clinicalUse:apiData.clinicalUse,
         pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`}>{apiData.pmcid}</a>,
        }
        )),
  
    };
  
  
    // result = alphaTable.beta.filter((element) => (element.charAt(0).toLowerCase() === this.alphabet.toLowerCase()));
    // alpharesult ='a'
    // alpharesult = alphaTable.beta[0].filter((element) => (element.charAt(0).toLowerCase() === 'A'));
    
    // let result=alphaTable.beta[0]
    // alpharesult = result.filter((element) => (element.charAt(0).toLowerCase() === 'A'));
    
    // alpharesult=alphaTable.beta.filter(el=> el.cellType == 'CSC');
    alpharesult=alphaTable.beta.filter(el=> el.cargo.toLowerCase().startsWith('p'));
    const results=[5,3,4];
    // setAlpha(results);
    // const results = {
    //   columns: [
    //     {
    //       label: "Marker",
    //       field: "cargo",
    //       sort: "asc",
    //       width: 150,
    //     },
    //   ],
  
    //   rows:alpharesult.map((api) => (
    //     {
    //      molecularType: api.molecularType ,
    //      cargo:api.cargo, 
    //     }
    //     )),
        
    // }
  
   
    // window.alert('hello')
    // return alpharesult;
    // console.log("isbeta",alphaTable.beta[0]);
    console.log("isalpharesult",alpharesult);
    // console.log("type",typeof(alpharesult));
    console.log("isresults",results);
    
  
    // const result=alphaTable.beta
    // console.log("isresult",result);
  
    // const arr = [2, 3, 4];
    // const result = arr.filter(el=> el < 3);
    // console.log("isalpharesult",result);
    
    
  };
  



  const toggleTab = (index) => {
    setToggleState(index);
  };  

  const{data,error,isSuccess,
    isError,
    isLoading,
    }=useQuery(["SearchAPI",query], ()=>Fetch(query));
  
    if (isError) {
      return <h1>{error.message}</h1>;
    }
  
    if (isLoading) {
      return <h1>Loading...</h1>;
    }
  
  console.log("typrData", typeof(data));

  console.log("isData", data);

  console.log('res',)
  
  console.log("isSuccess", isSuccess);

  console.log("isError", isError);

  console.log("isquery", query);

  
  
  // const prepareAlphabets = () => {
  //   let result = [];
  //   for(let i=65; i<91; i++) {
  //     result.push(
  //       <button type="button" key={i} onClick={this.onAlphabetClick} value={String.fromCharCode(i)} >{String.fromCharCode(i)}</button>
  //     )
  //   }
  //   return result;
  // }
  //https://stackoverflow.com/questions/53652111/how-to-create-alphabet-and-input-search-in-react-js
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
 

  const RefTable = {
    columns: [
      {
        label: "Title",
        field: "title",
        sort: "asc",
        width: 15,
        
      },
      {
        label: "Journal",
        field: "journal",
        sort: "asc",
        width: 150,
      },
      {
        label: "Year",
        field: "year",
        sort: "asc",
        width: 150,
      },
      {
        label: "Authors",
        field: "authors",
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
        
    rows: 
    data.results.map((apiData) => (
        {
         molecularType: apiData.molecularType ,
        //  cargo:apiData.cargo, 
        //  tissue:apiData.tissue,
        //  cellType:apiData.cellType, 
        //  clinicalUse:apiData.clinicalUse,
         pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`}>{apiData.pmcid}</a>,
        //  clickEvent:()=>this.handleClick(apiData.pmcid)
        }
        // clickEvent:()=>handleClick(apiData.pmcid),
        )),
    
    
};

  const table = {
    columns: [
      {
        label: "Marker",
        field: "cargo",
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
        label: "Cell Type",
        field: "cellType",
        sort: "asc",
        width: 150,
      },
      {
        label: "Molecular Type",
        field: "molecularType",
        sort: "asc",
        width: 150,
      },
      
      {
        label: "Source",
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
        
    rows: 
    data.results.map((apiData) => (
        {
         molecularType: apiData.molecularType ,
         cargo:apiData.cargo, 
         tissue:apiData.tissue,
         cellType:apiData.cellType, 
         clinicalUse:apiData.clinicalUse,
         pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`}>{apiData.pmcid}</a>,
        //  clickEvent:()=>this.handleClick(apiData.pmcid)
        }
        // clickEvent:()=>handleClick(apiData.pmcid),
        )),
    
    
};
  const alphaTable={
    columns: [
      {
        label: "Marker",
        field: "cargo",
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
        label: "Cancer Cell Type",
        field: "cellType",
        sort: "asc",
        width: 150,
      },
      {
        label: "Content Type",
        field: "molecularType",
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
    rows:
      data.results.filter(el=> el.cargo.toLowerCase().startsWith(alphabet.toLowerCase())).map((apiData) => (
      {
       molecularType: apiData.molecularType ,
       cargo:apiData.cargo, 
       tissue:apiData.tissue,
       cellType:apiData.cellType, 
       clinicalUse:apiData.clinicalUse,
       pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`}>{apiData.pmcid}</a>,
      }
      ))
    


  };
  // setData(data);
  console.log("isAAAlphatable", alphaTable);
  console.log("isdata.results", data.results);
  
  
  // console.log("isbeta", filterAlpha);
  

  return (
    <div >
      
      
        {/* {filterAlpha()} */}
        {/* <button type='button' onClick={filterAlpha()} >p</button>  */}





        <form className="SearchBox"
          onSubmit={(e)=>{
            e.preventDefault();
            
          }}>
          <input onBlur={(e)=>setQuery(e.target.value)} type='text'/>
          <button type='submit'>search</button>
        </form>
        {/* {prepareAlphabets()} */}

        {/* <Alphabet/> */}

        {/* <div className="SearchResult">
            Total Tab:{data.count} 
            cargo:{data.results[0].cargo}
        </div> */}

        

        <div className="container-page">
          {/* <h1 className='text-primary mb-3'>CSC_Result</h1> */}
     
        <div className="bloc-tabs">
          <button
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
          >
            <div>Marker
            <span className="count">{ data.count}</span>
            </div>
            
            
          </button>
          {/* <button
            className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
          >
            <div>Reference 
            <span className="count">{RefTable.count}</span>
            </div>
            
          </button> */}

          {/* <button
            className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(3)}
          >
            <div>Alpha
            <span className="count">{alphaTable.rows.length}</span>
            </div>
            
          </button> */}
    
          
        </div>
  
        <div className="content-tabs">
          <div className={toggleState === 1 ? "content  active-content" : "content"}>
            <div className="justify-center">
              {/* <div>Total Tab:{data.count}</div> */}
              <div style={{marginLeft:250}}>{prepareAlphabets()}</div>
              <MDBDataTable striped bordered hover data={alphaTable} />   
              {/* <MDBDataTable striped bordered hover data={ table} />    */}
            </div>
              
          </div>
  
          <div className={toggleState === 2 ? "content  active-content" : "content"}>
            <div style={{width:"100%" }}>
              <MDBDataTable striped bordered hover data={RefTable} />     
            </div>
          </div>


          {/* <div className={toggleState === 3 ? "content  active-content" : "content"}>
            <div style={{width:"100%" }}>
            <div style={{marginLeft:250}}>{prepareAlphabets()}</div>
            <MDBDataTable striped bordered hover data={alphaTable} />     
            </div>
          </div> */}

        </div>
      </div>



        
       
    </div>
    
  );

};

export default SearchPlusTab;