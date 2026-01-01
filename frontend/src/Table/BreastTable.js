// import { useState, useEffect } from 'react';
// import { MDBDataTable } from 'mdbreact';

// import 'mdbreact/dist/css/mdb.css';
// import BreastCSCdata from '../Data/BreastCSC.json';
// import BreastCCdata from '../Data/BreastCC.json';
// import './page.css'

// const BreastTable = () => {
  
  
  
//   const [toggleState, setToggleState] = useState(1);  
//   const toggleTab = (index) => {
//         setToggleState(index);
//       };   



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
//         console.log('hekkko')
//         return result;
//       }    


//       const BreastCSC = {
//         columns: [
          
          
         
//           {
//             label: "Gene",
//             field: "cargo",
//             sort: "asc",
//             width: 150,
//           },
//           {
//             label: "Gene symbol",
//             field: "",
//             sort: "asc",
//             width: 150,
//           },
//           {
//             label: "Tissue",
//             field: "tissue",
//             sort: "asc",
//             width: 15,
//           },
//           {
//             label: "Cancer cell type",
//             field: "cellType",
//             sort: "asc",
//             width: 150,
//           },
//           {
//             label: "Specimen",
//             field: "clinicalUse",
//             sort: "asc",
//             width: 150,
//           },

//           {
//             label: "PMCID",
//             field: "pmcid",
//             sort: "asc",
//             width: 150,
//           },
//         ],
        
     
//         rows: BreastCSCdata.results.filter(el=> el.cargo.toLowerCase().startsWith(alphabet.toLowerCase())).map((apiData) => (
//           {molecularType: apiData.molecularType ,
//               cargo:apiData.cargo, 
//               tissue:apiData.tissue,
//               cellType:apiData.cellType, 
//               clinicalUse:apiData.clinicalUse,
//               // pmcid:apiData.pmcid,
//               pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`}>{apiData.pmcid}</a>,
//           })),
        


//       };
      
 
//       const BreastCC = {
//         columns: [
          
          
         
//           {
//             label: "Gene",
//             field: "cargo",
//             sort: "asc",
//             width: 150,
//           },
//           {
//             label: "Gene symbol",
//             field: "",
//             sort: "asc",
//             width: 150,
//           },
//           {
//             label: "Tissue",
//             field: "tissue",
//             sort: "asc",
//             width: 15,
//           },
//           {
//             label: "Cancer cell type",
//             field: "cellType",
//             sort: "asc",
//             width: 150,
//           },
//           {
//             label: "Specimen",
//             field: "clinicalUse",
//             sort: "asc",
//             width: 150,
//           },

//           {
//             label: "PMCID",
//             field: "pmcid",
//             sort: "asc",
//             width: 150,
//           },
//         ],
        
     
//         rows: BreastCCdata.results.filter(el=> el.cargo.toLowerCase().startsWith(alphabet.toLowerCase())).map((apiData) => (
//           {molecularType: apiData.molecularType ,
//               cargo:apiData.cargo, 
//               tissue:apiData.tissue,
//               cellType:apiData.cellType, 
//               clinicalUse:apiData.clinicalUse,
//               // pmcid:apiData.pmcid,
//               pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`}>{apiData.pmcid}</a>,
//           })),
        


//       };


  


  

  

//   return (
//     <div>
//          <p className='associated'>Associated Breast markers</p>
//         <div className="bloc-tabs">
//           <button
//             className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
//             onClick={() => toggleTab(1)}
//           >
//             <div>Cancer Stem Cell
         
//             </div>
            
            
//           </button>
//           <button
//             className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
//             onClick={() => toggleTab(2)}
//           >
//             <div>Cancer Cell
         
//             </div>
            
//           </button>
//         </div>

//         <div className="content-tabs">
//           <div className={toggleState === 1 ? "content  active-content" : "content"}>
//             <div className="justify-center">
              
//             <div style={{marginLeft:250}}>{prepareAlphabets()}</div>
//             <MDBDataTable striped bordered hover data={BreastCSC} />   
              
//             </div>
              
//           </div>
  
//           <div className={toggleState === 2 ? "content  active-content" : "content"}>
//             <div style={{width:"100%" }}>
//             <div style={{marginLeft:250}}>{prepareAlphabets()}</div>

//               <MDBDataTable striped bordered hover data={BreastCC} />     
//             </div>
//           </div>


          
//         </div>
        
            


    
    
    
    
    
    
//     </div>
       
//   );
// };

// export default BreastTable;



// import { useState, useEffect } from 'react';
// import { MDBDataTable } from 'mdbreact';
// import { Link } from 'react-router-dom';

// import 'mdbreact/dist/css/mdb.css';

// import './page.css'

// const LungTable = () => {
  
//   const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  
  
//   const [toggleState, setToggleState] = useState(1);  
//   const toggleTab = (index) => {
//         setToggleState(index);
//       };   



//   const [alphabet,setAlphabet]=useState('');
//   const onAlphabetClick = (e) => {
//     setAlphabet(e.target.value);
//     console.log('Selected Alphabet:', e.target.value);
//   };
    
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
//         console.log('This is LungTable')
//         return result;
//       }    


   
//     const [dataD, setDataD] = useState(null);

//     const [CSCdata, setCSCData] = useState([]);  
//     useEffect(() => {
//         setIsLoading(true); // Set isLoading to true before starting the fetch request
//         fetch("http://db.cmdm.tw:8000/search/table/Cancer/")
//   .then((response) => response.json())
//   .then((res) => {
//     const CancerGene = res.results.filter(obj =>
//       obj.tissue === 'Lung' &&
//       obj.cellType === 'cancer' &&
//       (
//         obj.cancer_gene_urls.length === 1 ||
//         obj.cancer_protein_urls.length === 1 ||
//         obj.cancer_rna_urls.length === 1 ||
//         obj.cancer_lipid_urls.length === 1
//       )
//     );

//     const updatedCancerGene = CancerGene.map((obj) => {
//       const combinedUrls = [
//         ...obj.cancer_gene_urls,
//         ...obj.cancer_protein_urls,
//         ...obj.cancer_rna_urls,
//         ...obj.cancer_lipid_urls,
//       ];
      
//       const selectedUrl = combinedUrls[0]; // Choose the first URL, you can modify this selection logic as needed
//       return { ...obj, combined_url: selectedUrl };
//     });


//     const dataDUrls = updatedCancerGene.map(obj => obj.combined_url.id_url);
//     const requestsD = dataDUrls.map(url => fetch(url).then(response => response.json()));

//     console.log('CancerGene length:', CancerGene.length);
//     console.log('Updated CancerGene:', updatedCancerGene);
//     console.log('dataDUrls', dataDUrls);
//     Promise.all(requestsD)
//           .then((dataDs) => {
//             setDataD(dataDs);
//             const  CSCdata = {
//               columns: [
//                 {
//                   label: 'Name',
//                   field: 'gene',
//                   sort: 'asc',
//                   width: 270,
//                 },

//                 {
//                   label: 'tissue',
//                   field: 'tissue',
//                   sort: 'asc',
//                   width: 270,
//                 },
//                 {
//                   label: 'scroe',
//                   field: 'scroe',
//                   sort: 'asc',
//                   width: 200,
//                 },
//                 {
//                   label: 'PMCID',
//                   field: 'pmcid',
//                   sort: 'asc',
//                   width: 150,
//                 },
//               ],
//               rows: [],
//             };
//             dataDs.forEach((dataD) => {
//               let Url;
//               if (dataD.molecularType === 'gene') {
//                 Url = dataD.gene_url;
//               } else if (dataD.molecularType === 'protein') {
//                 Url = dataD.protein_url;
//               } else if (dataD.molecularType === 'lipid') {
//                 Url = dataD.lipid_url;
//               } else if (dataD.molecularType === 'rna') {
//                 Url = dataD.rna_url;
//               } else {
//                 // Handle other molecular types here
//                 Url = dataD.cancer_url;
//               }
            
//                CSCdata.rows.push({
                
//                 gene:<a href={`http://db.cmdm.tw:13007/${dataD.molecularType}/${Url}`} style={{ color: 'blue' }}>{dataD.cargo}</a>,
//                 tissue: dataD.tissue,
//                 scroe: dataD.scroe,
//                 pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataD.pmcid}`} style={{ color: 'blue' }}>{dataD.pmcid}</a>

//               });
//             });
//             setCSCData(CSCdata);
//             console.log('dataDs', dataDs);
//           })
//           .catch((error) => {
//             console.error('Error fetching dataB:', error);
//           });
//     // const allUrls = CancerGene.reduce((urls, obj) => {
//     //   const geneUrls = obj.cancer_gene_urls || [];
//     //   const lipidUrls = obj.cancer_lipid_urls || [];
//     //   const proteinUrls = obj.cancer_protein_urls || [];
//     //   const rnaUrls = obj.cancer_rna_urls || [];

//     //   return urls.concat(geneUrls, lipidUrls, proteinUrls, rnaUrls);
//     // }, []);
//         // fetch("http://db.cmdm.tw:8000/search/table/Cancer/")
//         //   .then((response) => response.json())
//         //   .then((res) => {
//         //   const CancerGene = res.results

        
//         //   .filter(obj => obj.tissue === 'Lung'&& obj.cellType === 'cancer')
//         //   //if cancer_gene_urls/cancer_lipid_urls/cancer_protein_urls/cancer_rna_urls =![]

//         //   .map(obj => obj.cancer_gene_urls);
//             console.log('CancerGene',CancerGene)
            
//             console.log('res',res)
//             // const CSCdata = {
//             //   columns: [
//             //     {
//             //       label: "Name",
//             //       field: "cargo",
//             //       sort: "asc",
//             //       width: 150,
//             //     },
//             //     {
//             //       label: "Gene symbol",
//             //       field: "",
//             //       sort: "asc",
//             //       width: 150,
//             //     },
//             //     {
//             //       label: "Tissue",
//             //       field: "tissue",
//             //       sort: "asc",
//             //       width: 15,
//             //     },
//             //     {
//             //       label: "Cancer cell type",
//             //       field: "cellType",
//             //       sort: "asc",
//             //       width: 150,
//             //     },
//             //     {
//             //       label: "Specimen",
//             //       field: "clinicalUse",
//             //       sort: "asc",
//             //       width: 150,
//             //     },
//             //     {
//             //       label: "PMCID",
//             //       field: "pmcid",
//             //       sort: "asc",
//             //       width: 150,
//             //     },
//             //   ],
//             //   rows: updatedCancerGene.filter(el => el.cargo.toLowerCase().startsWith(alphabet.toLowerCase())).map((apiData) => ({
//             //     molecularType: apiData.molecularType,
//             //     // cargo: (
//             //     //   <Link to={`/Cancer/${apiData.id}`} style={{ color: 'blue' }}>{apiData.cargo}</Link>
//             //     // ),
                
//             //     //cargo:apiData.cargo,
//             //     // cargo:
//             //     //   apiData.combined_url && apiData.combined_url.id_url ? (
//             //     //     <a href={apiData.combined_url.id_url} style={{ color: 'blue' }}>
//             //     //       {apiData.cargo}
//             //     //     </a>
                    
//             //     //   ) : (
//             //     //     <span>{apiData.cargo}</span>
//             //     //   ),
//             //       cargo: (
//             //         <Link to={`/${apiData.molecularType}/${apiData.id}`} style={{ color: 'blue' }}>
//             //           {apiData.cargo}
//             //         </Link>
//             //       ),
//             //     tissue: apiData.tissue,
//             //     cellType: apiData.cellType,
//             //     clinicalUse: apiData.clinicalUse,
//             //     pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`} style={{ color: 'blue' }}>{apiData.pmcid}</a>,
//             //   })),
//             // };
    
//             // setCSCData(CSCdata);
//             setIsLoading(false); // Set isLoading to false when the data is fetched
//           })
//           .catch((error) => {
//             console.error('Error fetching gene data:', error);
//             setIsLoading(false); // Set isLoading to false even if an error occurs
//           });
//       }, [alphabet]);


  

  

//   return (
//     <div>
//          <p className='associated'>Associated Lung markers</p>
//         <div className="bloc-tabs">
//           <button
//             className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
//             onClick={() => toggleTab(1)}
//           >
//             <div>Cancer Stem Cell
         
//             </div>
            
            
//           </button>
//           <button
//             className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
//             onClick={() => toggleTab(2)}
//           >
//             <div>Cancer Cell
         
//             </div>
            
//           </button>
//         </div>

//         <div className="content-tabs">
//           <div className={toggleState === 1 ? "content  active-content" : "content"}>
//             <div className="justify-center">
              
//             <div style={{marginLeft:250}}>{prepareAlphabets()}</div>
//             <MDBDataTable striped bordered hover data={CSCdata} />   
              
//             </div>
              
//           </div>
  
//           <div className={toggleState === 2 ? "content  active-content" : "content"}>
//             <div style={{width:"100%" }}>
//             <div style={{marginLeft:250}}>{prepareAlphabets()}</div>
//             <MDBDataTable striped bordered hover data={CSCdata} />   
//               {/* <MDBDataTable striped bordered hover data={BreastCC} />      */}
//             </div>
//           </div>


          
//         </div>
        
            


    
    
    
    
    
    
//     </div>
       
//   );
// };

// export default LungTable;


import React, { useState, useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom';

import 'mdbreact/dist/css/mdb.css';
import './page.css';

const BreastTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [toggleState, setToggleState] = useState(1);
  const [alphabet, setAlphabet] = useState('');
  const [CSCdata, setCSCData] = useState([]);
  const [CCdata, setCCData] = useState([]);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const onAlphabetClick = (e) => {
    setAlphabet(e.target.value);
  };

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
  };

  useEffect(() => {
    setIsLoading(true);
    fetch('  ')
      .then((response) => response.json())
      .then((res) => {
        const CancerStem = res.results
        .filter(
          (obj) =>
          obj.tissue === 'Breast' &&
          obj.cellType === 'CSC' &&
          (
            obj.cancer_gene_urls.length === 1 ||
            obj.cancer_protein_urls.length === 1 ||
            obj.cancer_rna_urls.length === 1 ||
            obj.cancer_lipid_urls.length === 1
          )
       );
       
      console.log('CancerStem',CancerStem);
        const updatedCancerStem = CancerStem.map((obj) => {
          const combinedCancerStemUrls = [
            ...obj.cancer_gene_urls,
            ...obj.cancer_protein_urls,
            ...obj.cancer_rna_urls,
            ...obj.cancer_lipid_urls,
          ];

          const selectedCancerStemUrl = combinedCancerStemUrls[0];
          return { ...obj, combined_url: selectedCancerStemUrl };
        });
        
        const dataEUrls = updatedCancerStem.map(
          (obj) => obj.combined_url.id_url
        );
        const requestsE = dataEUrls.map((url) =>
          fetch(url).then((response) => response.json())
        );
          

        Promise.all(requestsE)
        .then((dataEs) => {
          const CCdata = {
            columns: [
              {
                label: 'Name',
                field: 'gene',
                sort: 'asc',
                width: 270,
              },
              {
                label: 'tissue',
                field: 'tissue',
                sort: 'asc',
                width: 270,
              },
              // {
              //   label: 'score',
              //   field: 'score',
              //   sort: 'asc',
              //   width: 200,
              // },
              {
                label: 'PMCID',
                field: 'pmcid',
                sort: 'asc',
                width: 150,
              },
            ],
            rows: [],
          };

          dataEs.forEach((dataE) => {
            let Url;
            if (dataE.molecularType === 'gene') {
              Url = dataE.gene_url;
            } else if (dataE.molecularType === 'protein') {
              Url = dataE.protein_url;
            } else if (dataE.molecularType === 'lipid') {
              Url = dataE.lipid_url;
            } else if (dataE.molecularType === 'rna') {
              Url = dataE.rna_url;
            } else {
              Url = dataE.cancer_url;
            }

            CCdata.rows.push({
              gene: (
                <a
                  href={`http://db.cmdm.tw:13007/${dataE.molecularType}/${Url}`}
                  style={{ color: 'blue' }}
                >
                  {dataE.cargo}
                </a>
              ),
              tissue: dataE.tissue,
              score: dataE.score,
              pmcid: (
                <a
                  href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataE.pmcid}`}
                  style={{ color: 'blue' }}
                >
                  {dataE.pmcid}
                </a>
              ),
            });
          });

          setCCData(CCdata);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching dataD:', error);
          setIsLoading(false);
        });



        const CancerGene = res.results.filter(
          (obj) =>
            obj.tissue === 'Breast' &&
            obj.cellType === 'cancer' &&
            (obj.cancer_gene_urls.length === 1 ||
              obj.cancer_protein_urls.length === 1 ||
              obj.cancer_rna_urls.length === 1 ||
              obj.cancer_lipid_urls.length === 1)
        );

        const updatedCancerGene = CancerGene.map((obj) => {
          const combinedUrls = [
            ...obj.cancer_gene_urls,
            ...obj.cancer_protein_urls,
            ...obj.cancer_rna_urls,
            ...obj.cancer_lipid_urls,
          ];

          const selectedUrl = combinedUrls[0];
          return { ...obj, combined_url: selectedUrl };
        });

        const dataDUrls = updatedCancerGene.map(
          (obj) => obj.combined_url.id_url
        );
        const requestsD = dataDUrls.map((url) =>
          fetch(url).then((response) => response.json())
        );
        console.log('updatedCancerGene ',updatedCancerGene );
        Promise.all(requestsD)
          .then((dataDs) => {
            const CSCdata = {
              columns: [
                {
                  label: 'Name',
                  field: 'gene',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'tissue',
                  field: 'tissue',
                  sort: 'asc',
                  width: 270,
                },
                // {
                //   label: 'score',
                //   field: 'score',
                //   sort: 'asc',
                //   width: 200,
                // },
                {
                  label: 'PMCID',
                  field: 'pmcid',
                  sort: 'asc',
                  width: 150,
                },
              ],
              rows: [],
            };

            dataDs.forEach((dataD) => {
              let Url;
              if (dataD.molecularType === 'gene') {
                Url = dataD.gene_url;
              } else if (dataD.molecularType === 'protein') {
                Url = dataD.protein_url;
              } else if (dataD.molecularType === 'lipid') {
                Url = dataD.lipid_url;
              } else if (dataD.molecularType === 'rna') {
                Url = dataD.rna_url;
              } else {
                Url = dataD.cancer_url;
              }

              CSCdata.rows.push({
                gene: (
                  <a
                    href={`http://db.cmdm.tw:13007/${dataD.molecularType}/${Url}`}
                    style={{ color: 'blue' }}
                  >
                    {dataD.cargo}
                  </a>
                ),
                tissue: dataD.tissue,
                score: dataD.score,
                pmcid: (
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataD.pmcid}`}
                    style={{ color: 'blue' }}
                  >
                    {dataD.pmcid}
                  </a>
                ),
              });
            });

            setCSCData(CSCdata);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching dataD:', error);
            setIsLoading(false);
          });
          
      })
      .catch((error) => {
        console.error('Error fetching gene data:', error);
        setIsLoading(false);
      });
  }, [alphabet]);

  return (
    <div>
      <p className="associated">Associated Breast markers</p>
      <div className="bloc-tabs">
        {/* <button
          className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'}
          onClick={() => toggleTab(1)}
        >
          Cancer Stem Cell
        </button>
        <button
          className={toggleState === 2 ? 'tabs active-tabs' : 'tabs'}
          onClick={() => toggleTab(2)}
        >
          Cancer Cell
        </button> */}
      </div>
      
      <div className="content-tabs">
        <div className={toggleState === 1 ? 'content active-content' : 'content'}>
          <div className="justify-center">
          <h1 className="associated" style={{ textAlign: 'left' ,marginLeft:0}}>Cancer cell</h1>
            <div style={{ marginLeft: 250 }}>{prepareAlphabets()}</div>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              
              <MDBDataTable striped bordered hover data={CSCdata} />
            )}
          </div>
        </div>

        <div className={toggleState === 2 ? 'content active-content' : 'content'}>
          <div style={{ width: '100%' }}>
          <h1 className="associated" style={{ textAlign: 'left' ,marginLeft:0 }}>Cancer Stem cell</h1>
            <div style={{ marginLeft: 250 }}>{prepareAlphabets()}</div>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <MDBDataTable striped bordered hover data={CCdata} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreastTable;

