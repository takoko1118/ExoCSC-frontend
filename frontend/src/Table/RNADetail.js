// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { HashRouter as Router, Route, Link } from 'react-router-dom';
// import { MDBDataTable } from 'mdbreact';
// import './Detail.css';
// import 'mdbreact/dist/css/mdb.css';
// function RNADetail() {
//   const { index } = useParams();
//   const [data, setData] = useState(null);
//   const [dataB, setDataB] = useState(null);
//   const [dataC, setDataC] = useState(null);
  
//   const [mRNAdata, setmRNAdata] = useState(null);
//   const [Refdata, setRefdata] = useState(null);
//   const MAX_URLS = 20; // Maximum number of URLs to catch
//   useEffect(() => {
//     fetch(`http://db.cmdm.tw:8000/search/table/RNA/${index}`)
//       .then((response) => response.json())
//       .then((res) => {
//         setData(res);

//         const dataBUrls = res.gene_rna_urls.map(obj => obj.id_url);
//         const dataCUrls = res.rna_ref_urls.map(obj => obj.id_url);
       
//         console.log('dataBUrls:', dataBUrls); // Add this line to log dataBUrls
//         console.log('dataCUrls:', dataCUrls); // Add this line to log dataBUrls
      
//         const requestsB = dataBUrls.map(url => fetch(url).then(response => response.json()));
//         const requestsC = dataCUrls.map(url => fetch(url).then(response => response.json()));
       
     

//         Promise.all(requestsB)
//           .then((dataBs) => {
//             setDataB(dataBs);
//             const mRNAdata = {
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
//             dataBs.forEach((dataB) => {
//               mRNAdata.rows.push({
//                 gene: dataB.cargo_gene,
//                 tissue: dataB.tissue,
//                 scroe: dataB.scroe,
//                 pmcid: <span style={{ color: 'blue' }}>{dataB.pmcid}</span>,

//               });
//             });
//             setmRNAdata(mRNAdata);
//           })
//           .catch((error) => {
//             console.error('Error fetching dataB:', error);
//           });


//         Promise.all(requestsC)
//           .then((dataCs) => {
//             setDataC(dataCs);
//             const Refdata = {
//               columns: [
//                 {
//                   label: 'Title',
//                   field: 'title',
//                   sort: 'asc',
//                   width: 270,
//                 },
//                 {
//                   label: 'Journal',
//                   field: 'journal',
//                   sort: 'asc',
//                   width: 270,
//                 },
//                 {
//                   label: 'Year',
//                   field: 'year',
//                   sort: 'asc',
//                   width: 270,
//                 },
//                 {
//                   label: 'Author',
//                   field: 'author',
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

//             dataCs.forEach((dataC) => {
//               Refdata.rows.push({
//                 title: dataC.title,
//                 journal: dataC.journal,
//                 year: dataC.year,
//                 author: dataC.author,
//                 pmcid: <span style={{ color: 'blue' }}>{dataC.pmcid}</span>,
                
//               });
//             });

//             setRefdata(Refdata);
//           })
//           .catch((error) => {
//             console.error('Error fetching dataC:', error);
//           });


          



//       })
    

//   }, [index]);

//   console.log('results', data)
//   console.log('geneRNA', dataB);
  
  
//   console.log('Refdata', Refdata);
//   console.log('RNAdata', mRNAdata);


//   if (!data) {
//     return <div>Loading...</div>;
//   }



//   return (
//     <div className='detail'>


//       <aside >
//         <nav className="nav-bar flex-column sticky-top" >
//           <h4>Menu</h4>
//           <ul>
//             <li>
//               <a href="#description">Description</a>

//             </li>

            
//             <li>
//               <a href="#gene-RNA">Associated Genes</a>
//             </li>
//             <li>
//               <a href="#gene-lipid">Associated Lipids</a>
//             </li>
//             <li>
//               <a href="#references">Reference</a>
//             </li>
//           </ul>
//         </nav>
//       </aside>
//       <div className="content">
//         <h1>{data.cargo}</h1>

//         <div id="description" style={{ marginTop: '50px' }}>
//           <h2>Description</h2>
//           <table className='detailTable' style={{ fontSize: '10px' , width: '500px'}}>
//             <thead>
//               <tr>
//                 <th colSpan="2">Description for {data.cargo}</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <th>Gene name</th>
//                 <td>{data.cargo}</td>
//               </tr>
              
//             </tbody>
//           </table>
//         </div>



        

//         <div id="gene-RNA" style={{ marginTop: '50px' }}>
//           <h2>Associated Genes</h2>
//           {mRNAdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={mRNAdata} />}
//         </div>

//         <div id="gene-lipid" style={{ marginTop: '50px' }}>
//           <h2>Associated Lipids</h2>
//           {Refdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Refdata} />}
//         </div>
//         <div id="references" style={{ marginTop: '50px' }}>
//           <h2>Associated References</h2>
//           {Refdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Refdata} />}
//         </div>
//         <footer>FOOTER</footer>
//       </div>
//     </div>

//   );




// }

// export default RNADetail;

import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import 'mdbreact/dist/css/mdb.css';
import Histograme from './Histograme.js';
import Cyto from './Cyto.js'







function RNADetail() {
  const { index } = useParams();
  const [data, setData] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [dataC, setDataC] = useState(null);
  const [dataD, setDataD] = useState(null);  
  const [dataE, setDataE] = useState(null); 
  const [Genedata, setGenedata] = useState(null);
  const [Lipiddata, setLipiddata] = useState(null);
  const [Proteindata, setProteindata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  const MAX_URLS = 20; // Maximum number of URLs to catch
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [ID,setID] = useState(null);
  useEffect(() => {
    setIsLoading(true); // Set isLoading to true when the effect starts

    fetch(`http://db.cmdm.tw:8000/search/table/RNA/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        const dataBUrls = res.gene_rna_urls.slice(0, MAX_URLS).map(obj => obj.id_url);
        const dataCUrls = res.rna_ref_urls.slice(0, MAX_URLS).map(obj => obj.id_url);
        const dataDUrls = res.lipid_rna_urls.slice(0, MAX_URLS).map(obj => obj.id_url);
        const dataEUrls = res.protein_rna_urls.slice(0, MAX_URLS).map(obj => obj.id_url);



        console.log('dataBUrls:', dataBUrls);
        console.log('dataCUrls:', dataCUrls);
        console.log('dataDUrls:', dataDUrls);
        console.log('dataEUrls:', dataDUrls);
        console.log('index:', index);
        console.log('rna_id:',res.rna_id)


        const requestsB = dataBUrls.map(url => fetch(url).then(response => response.json()));
        const requestsC = dataCUrls.map(url => fetch(url).then(response => response.json()));
        const requestsD = dataDUrls.map(url => fetch(url).then(response => response.json()));
        const requestsE = dataEUrls.map(url => fetch(url).then(response => response.json()));
        setID(res.rna_id)
        const rna=res.rna_id
        

        Promise.all(requestsE)
          .then((dataEs) => {
            setDataB(dataEs);
            const Proteindata = {
              columns: [
                {
                  label: 'Name',
                  field: 'gene',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'Tissue',
                  field: 'tissue',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'score',
                  field: 'score',
                  sort: 'asc',
                  width: 200,
                },
                {
                  label: 'Cell Line',
                  field: 'cellline',
                  sort: 'asc',
                  width: 150,
                },
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
              Proteindata.rows.push({
                gene: <a href={`http://db.cmdm.tw:13007/protein/${dataE.protein_url}`} style={{ color: 'blue' }}>{dataE.cargo_protein}</a>,
                tissue: dataE.tissue,
                score: dataE.score_x,
                cellline:dataE.cellLine,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataE.pmcid}`} style={{ color: 'blue' }}>{dataE.pmcid}</a>
              });
            });
            setProteindata(Proteindata);
          })
          .catch((error) => {
            console.error('Error fetching dataB:', error);
          });





        Promise.all(requestsD)
          .then((dataDs) => {
            setDataB(dataDs);
            const Lipiddata = {
              columns: [
                {
                  label: 'Name',
                  field: 'gene',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'Tissue',
                  field: 'tissue',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'score',
                  field: 'score',
                  sort: 'asc',
                  width: 200,
                },
                {
                  label: 'Cell Line',
                  field: 'cellline',
                  sort: 'asc',
                  width: 150,
                },
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
              Lipiddata.rows.push({
                gene:<a href={`http://db.cmdm.tw:13007/Lipid/${dataD.lipid_url}`} style={{ color: 'blue' }}>{dataD.cargo_lipid}</a>,
                tissue: dataD.tissue,
                score: dataD.score_x,
                cellline:dataD.cellLine,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataD.pmcid}`} style={{ color: 'blue' }}>{dataD.pmcid}</a>
              });
            });
            setLipiddata(Lipiddata);
          })
          .catch((error) => {
            console.error('Error fetching dataB:', error);
          });



        Promise.all(requestsB)
          .then((dataBs) => {
            setDataB(dataBs);
            const Genedata = {
              columns: [
                {
                  label: 'Name',
                  field: 'gene',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'Tissue',
                  field: 'tissue',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'score',
                  field: 'score',
                  sort: 'asc',
                  width: 200,
                },
                {
                  label: 'Cell Line',
                  field: 'cellline',
                  sort: 'asc',
                  width: 150,
                },
                {
                  label: 'PMCID',
                  field: 'pmcid',
                  sort: 'asc',
                  width: 150,
                },
              ],
              rows: [],
            };
            dataBs.forEach((dataB) => {
              Genedata.rows.push({
                gene:  <a href={`http://db.cmdm.tw:13007/gene/${dataB.gene_url}`} style={{ color: 'blue' }}>{dataB.cargo_gene}</a>,
                tissue: dataB.tissue,
                score: dataB.score_x,
                cellline:dataB.cellLine,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataB.pmcid}`} style={{ color: 'blue' }}>{dataB.pmcid}</a>
              });
            });
            setGenedata(Genedata);
          })
          .catch((error) => {
            console.error('Error fetching dataB:', error);
          });

        Promise.all(requestsC)
          .then((dataCs) => {
            setDataC(dataCs);
            const Refdata = {
              columns: [
                {
                  label: 'Title',
                  field: 'title',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'Journal',
                  field: 'journal',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'Year',
                  field: 'year',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'Author',
                  field: 'author',
                  sort: 'asc',
                  width: 200,
                },
                {
                  label: 'PMCID',
                  field: 'pmcid',
                  sort: 'asc',
                  width: 150,
                },
              ],
              rows: [],
            };

            dataCs.forEach((dataC) => {
              Refdata.rows.push({
                title: dataC.title,
                journal: dataC.journal,
                year: dataC.year,
                author: dataC.author,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataC.pmcid}`} style={{ color: 'blue' }}>{dataC.pmcid}</a>
              });
            });

            setRefdata(Refdata);
          })
          .catch((error) => {
            console.error('Error fetching dataC:', error);
          })
          .finally(() => {
            setIsLoading(false); // Set isLoading to false when the requests are complete
          });
      });
  }, [index]);

  console.log('results', data);
  console.log('geneRNA', dataB);
  console.log('Refdata', Refdata);
  console.log('Proteindata', Proteindata);
  console.log('setrna:',ID)
  if (isLoading) {
    return <div>Loading...</div>; // Display the loading screen while isLoading is true
  }

  return (
    <div className='detail'>
      <aside>
        <nav className="nav-bar flex-column sticky-top">
          <h4>Menu</h4>
          <ul>
            <li>
              <a href="#description">Description</a>
            </li>
            <li>
              <a href="#gene-gene">Associated Genes</a>
            </li>
            <li>
              <a href="#gene-protein">Associated Proteins</a>
            </li>
         
            <li>
              <a href="#gene-lipid">Associated Lipids</a>
            </li>
            <li>
              <a href="#references">Reference</a>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="content">
        <h1>{data.cargo}</h1>

        <div id="description" style={{ marginTop: '50px' }}>
          <h2>Description</h2>
          <table className='detailTable' style={{ fontSize: '10px', width: '80%' }}>
            <thead>
              <tr>
              <th colSpan="2">
                  <>{data.description}</>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Gene name</th>
                <td>{data.cargo}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id="gene-gene" style={{ marginTop: '50px' }}>
          <h2>Associated Genes</h2>
          {Genedata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Genedata} />}
        </div>
        <div id="gene-protein" style={{ marginTop: '50px' }}>
          <h2>Associated Proteins</h2>
          {Proteindata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Proteindata} />}
        </div>

        

        <div id="gene-lipid" style={{ marginTop: '50px' }}>
          <h2>Associated Lipids</h2>
          {Lipiddata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Lipiddata} />}
        </div>

        <div id="references" style={{ marginTop: '50px' }}>
          <h2>Associated References</h2>
          {Refdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Refdata} />}
        </div>
        
        <footer><img src="../CMDM-Lab.png" style={{verticalAlign: "middle",width: "6%", textAlign: "left"}} />© 2023, Computational Molecular Design and Metabolomics Laboratory</footer>
    
        <Histograme index={ID} />

        {/* <Cyto/> */}

      </div>
    </div>
  );
}

export default RNADetail;
