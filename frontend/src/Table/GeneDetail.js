import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import 'mdbreact/dist/css/mdb.css';
import CytoscapeComponent from 'react-cytoscapejs';


function GeneDetail() {




  const [cytoscapeElements, setCytoscapeElements] = useState([
    // Central node (positioned at the center)
    { data: { id: 'center', label: 'Center Node' }, position: { x: 250, y: 250 } },
  ]);






  const tableStyle = {
    borderBottom: '1px solid black', // Add underline for rows
  };
  const tableClass = 'custom-table';

  const { index } = useParams();
  const [data, setData] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [dataC, setDataC] = useState(null);
  const [dataD, setDataD] = useState(null);
  const [dataE, setDataE] = useState(null);
  const [dataF, setDataF] = useState(null);

  const [CSCdata, setCSCdata] = useState(null); // new state variable
  const [CCdata, setCCdata] = useState(null); // new state variable
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Refdata, setRefdata] = useState(null);  
  const [Lipiddata, setLipiddata] = useState(null);


  const layout = {
    name: 'grid',
    rows: 1,
    columns: 1,
  };



  const MAX_URLS = 20; // Maximum number of URLs to catch
  useEffect(() => {
    fetch(`http://db.cmdm.tw:8000/search/table/Gene/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        //const dataBUrls = res.ref0427_url;

        const dataBUrls = res.gene_rna_urls.map(obj => obj.id_url);
        const dataCUrls = res.gene_ref_urls.map(obj => obj.id_url);
        //const dataDUrls = res.other_gene_ids.map(obj => obj.url);
        const dataDUrls = res.other_gene_ids
        
          //.filter(obj => obj.tissue === 'Colon'&& obj.cellType === 'cancer')
          .filter(obj => obj.cellType === 'CSC')
          .slice(0, MAX_URLS)
          .map(obj => obj.url);
         
        const dataEUrls = res.other_gene_ids
        
          //.filter(obj => obj.tissue === 'Colon'&& obj.cellType === 'cancer')
          .filter(obj => obj.cellType === 'cancer')
          .slice(0, MAX_URLS)
          .map(obj => obj.url);

        const dataFUrls = res.lipid_gene_urls.map(obj => obj.id_url);
        
        console.log('dataBUrls:', dataBUrls); // Add this line to log dataBUrls
        console.log('dataCUrls:', dataCUrls); // Add this line to log dataBUrls
        console.log('dataDUrls:', dataDUrls);
        console.log('dataFUrls:', dataFUrls);
        //const requests = dataBUrls.map(url => fetch(url).then(response => response.json()));
        //return Promise.all(requests);
        const requestsB = dataBUrls.map(url => fetch(url).then(response => response.json()));
        const requestsC = dataCUrls.map(url => fetch(url).then(response => response.json()));
        const requestsD = dataDUrls.map(url => fetch(url).then(response => response.json()));
        const requestsE = dataEUrls.map(url => fetch(url).then(response => response.json()));
        const requestsF = dataFUrls.map(url => fetch(url).then(response => response.json()));
        console.log('dataCUrls', dataCUrls);
        console.log('index', index);

        Promise.all(requestsD)
          .then((dataDs) => {
            setDataD(dataDs);
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
              CSCdata.rows.push({
                //gene: dataD.cargo,
                gene: <a href={`http://db.cmdm.tw:13007/gene/${dataD.id}`} style={{ color: 'blue' }}>{dataD.cargo}</a>,
                tissue: dataD.tissue,
                scroe: dataD.score,
                cellline:dataD.cellLine,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataD.pmcid}`} style={{ color: 'blue' }}>{dataD.pmcid}</a>

              });
            });
            setCSCdata(CSCdata);
          })
          .catch((error) => {
            console.error('Error fetching dataD:', error);
          });
          
          Promise.all(requestsE)
          .then((dataEs) => {
            setDataE(dataEs);
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
              CCdata.rows.push({
                //gene: dataE.cargo,
                //gene: <a href={`${dataE.id_url}`} style={{ color: 'blue' }}>{dataE.cargo}</a>,
                gene: <a href={`http://db.cmdm.tw:13007/gene/${dataE.id}`} style={{ color: 'blue' }}>{dataE.cargo}</a>,
                tissue: dataE.tissue,
                score: dataE.score,
                cellline:dataE.cellLine,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataE.pmcid}`} style={{ color: 'blue' }}>{dataE.pmcid}</a>
                
              });
            });
            setCCdata(CCdata);
          })
          .catch((error) => {
            console.error('Error fetching dataD:', error);
          });  



        Promise.all(requestsB)
          .then((dataBs) => {
            setDataB(dataBs);
            const mRNAdata = {
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
              mRNAdata.rows.push({
                //gene: dataB.cargo_rna,
                gene: <a href={`http://db.cmdm.tw:13007/rna/${dataB.rna_url}`} style={{ color: 'blue' }}>{dataB.cargo_rna}</a>,

                tissue: dataB.tissue,
                score: dataB.score_y,
                cellline:dataB.cellLine,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataB.pmcid}`} style={{ color: 'blue' }}>{dataB.pmcid}</a>

              });
            });
            setmRNAdata(mRNAdata);
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
                //pmcid: <span style={{ color: 'blue' }}>{dataC.pmcid}</span>,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataC.pmcid}`} style={{ color: 'blue' }}>{dataC.pmcid}</a>
                
              });
            });

            setRefdata(Refdata);
          })
          .catch((error) => {
            console.error('Error fetching dataC:', error);
          });

        Promise.all(requestsF)
          .then((dataFs) => {
            setDataB(dataFs);
            const Lipiddata = {
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
            dataFs.forEach((dataF) => {
              Lipiddata.rows.push({
               
                gene: <a href={`http://db.cmdm.tw:13007/lipid/${dataF.lipid_url}`} style={{ color: 'blue' }}>{dataF.cargo_lipid}</a>,

                tissue: dataF.tissue,
                score: dataF.score_y,
                cellline:dataF.cellLine,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataF.pmcid}`} style={{ color: 'blue' }}>{dataF.pmcid}</a>

              });
            });
            setLipiddata(Lipiddata);
          })
          .catch((error) => {
            console.error('Error fetching dataB:', error);
          });

          

          

      })
    // .then((dataBs) => {
    //   setDataB(dataBs);

    //   const Alldata = {
    //     columns: [
    //                 {
    //                   label: 'Title',
    //                   field: 'title',
    //                   sort: 'asc',
    //                   width: 270,
    //                 },
    //                 {
    //                   label: 'Journel',
    //                   field: 'journel',
    //                   sort: 'asc',
    //                   width: 270,
    //                 },
    //               //   {
    //               //     label: 'Abstract',
    //               //     field: 'abstract',
    //               //     sort: 'asc',
    //               //     width: 270,
    //               //   },
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
    //     rows: [],
    //   };

    //   const genedata = {
    //     columns: [
    //       {
    //         label: 'Concept Name',
    //         field: 'gene',
    //         sort: 'asc',
    //         width: 150,
    //       },


    //       {
    //         label: 'Tissue',
    //         field: 'tissue',
    //         sort: 'asc',
    //         width: 150,
    //       },
    //       {
    //         label: 'Weighted Score',
    //         field: 'scroe',
    //         sort: 'asc',
    //         width: 150,
    //       },
    //       {
    //         label: 'PMCID',
    //         field: 'pmcid',
    //         sort: 'asc',
    //         width: 150,
    //       },
    //     ],
    //     rows: [],
    //   };

    //   dataBs.forEach((dataB) => {
    //     // Add dataB to Alldata and genedata rows
    //     // Alldata.rows.push({
    //     //   pmcid: dataB.pmcid,
    //     //   title: dataB.title,
    //     //   author: dataB.author,
    //     //   abstract: dataB.abstract,
    //     // });

    //     genedata.rows.push({
    //       gene: dataB.cargo_rna,
    //       tissue: dataB.tissue,
    //       scroe: dataB.rna_id,
    //       pmcid: dataB.pmcid,
    //     });


    //   });

    //   setAlldata(Alldata);
    //   setgenedata(genedata);

    //   console.log('dataBs', dataBs);

    // });

  }, [index]);

  console.log('results', data)
  console.log('geneRNA', dataB);
  console.log('geneRef', dataC);
  console.log('CSC', dataD);
  console.log('CC', dataE);
  
  console.log('Refdata', Refdata);
  console.log('mRNAdata', mRNAdata);
  console.log('Lipiddata',Lipiddata);


  if (!data) {
    return <div>Loading...</div>;
  }



  return (
    <div className='detail'>


      <aside >
        <nav className="nav-bar flex-column sticky-top" >
          <h4>Menu</h4>
          <ul>
            <li>
              <a href="#description">Description</a>

            </li>

            <li>
              <a href="#geneCC">Associated genes in Cancer cell</a>
            </li>
            <li>
              <a href="#geneCSC">Associated genes in Cancer Stem cell</a>
            </li>
            <li>
              <a href="#gene-RNA">Associated miRNA</a>
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
          
          <table className='detailTable' style={{ fontSize: '10px' , width: '80%'}}>
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
              <tr>
                <th>Gene symbol</th>
                <td>{data.entrezName}</td>
              </tr>
              <tr>
                <th>Entrez Gene</th>
                <td>{data.entrezID}</td>
              </tr>
            </tbody>
          </table>
        </div>

       v

        <div id="geneCSC" style={{ marginTop: '50px'  }}>
          <h2>Associated genes in cancer stem cell exosome</h2>
          {CSCdata !== null && 
          <MDBDataTable striped 
          noBottomColumns={true} 
          searching={false} 
          paging={false} 
          data={CSCdata} 
          style={tableStyle}
          
          />}
        </div>

        <div id="geneCC" style={{ marginTop: '50px'  }}>
          <h2>Associated genes in cancer cell exosome</h2>
          {CCdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={CCdata} className={tableClass}/>}
        </div>

        <div id="gene-RNA" style={{ marginTop: '50px' }}>
          <h2>Associated miRNA</h2>
          {mRNAdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={mRNAdata} className={tableClass}/>}
        </div>

        <div id="gene-lipid" style={{ marginTop: '50px' }}>
          <h2>Associated Lipids</h2>
          {Lipiddata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Lipiddata} className={tableClass}/>}
        </div>
        <div id="references" style={{ marginTop: '50px' }}>
          <h2>Associated References</h2>
          {Refdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Refdata} className={tableClass}/>}
        </div>
        <footer><img src="../CMDM-Lab.png" style={{verticalAlign: "middle",width: "6%", textAlign: "left"}} />© 2023, Computational Molecular Design and Metabolomics Laboratory</footer>

      </div>
    </div>

  );




}

export default GeneDetail;


