import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import 'mdbreact/dist/css/mdb.css';
import React from 'react';
function ProteinDetail() {
  const { index } = useParams();
  const [data, setData] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [dataC, setDataC] = useState(null);
  const [dataD, setDataD] = useState(null);
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  const [Lipiddata, setLipiddata] = useState(null);
  
  useEffect(() => {
    fetch(`http://db.cmdm.tw:8000/search/table/Protein/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        

        const dataBUrls = res.protein_rna_urls.map(obj => obj.id_url);
        const dataCUrls = res.protein_ref_urls.map(obj => obj.id_url);
        const dataDUrls = res.protein_lipid_urls.map(obj => obj.id_url);
       
        
        console.log('dataBUrls:', dataBUrls); // Add this line to log dataBUrls
        console.log('dataCUrls:', dataCUrls); // Add this line to log dataBUrls
        
        const requestsB = dataBUrls.map(url => fetch(url).then(response => response.json()));
        const requestsC = dataCUrls.map(url => fetch(url).then(response => response.json()));
        const requestsD = dataDUrls.map(url => fetch(url).then(response => response.json()));

        Promise.all(requestsD)
          .then((dataDs) => {
            setDataD(dataDs);
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
                gene:<a href={`http://db.cmdm.tw:13007/rna/${dataB.rna_url}`} style={{ color: 'blue' }}>{dataB.cargo_rna}</a>,
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
                
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataC.pmcid}`} style={{ color: 'blue' }}>{dataC.pmcid}</a>
              });
            });

            setRefdata(Refdata);
          })
          .catch((error) => {
            console.error('Error fetching dataC:', error);
          });

      })
    

  }, [index]);

  console.log('results', data)
  console.log('geneRNA', dataB);
  console.log('geneRef', dataC);
  
  console.log('Refdata', Refdata);
  console.log('mRNAdata', mRNAdata);
  console.log('Lipiddata', Lipiddata);


  if (!data) {
    return <div>Loading...</div>;
  }



  return (
    //<>helo</>
    <div className='detail'>


      <aside >
        <nav className="nav-bar flex-column sticky-top" >
          <h4>Menu</h4>
          <ul>
            <li>
              <a href="#description">Description</a>

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
          <table className='detailTable' style={{ fontSize: '10px' ,  width: '80%'}}>
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
                <td>{data.cargo}</td>
              </tr>
              <tr>
                <th>Entrez Gene</th>
                <td>{data.id}</td>
              </tr>
            </tbody>
          </table>
        </div>


        <div id="gene-RNA" style={{ marginTop: '50px' }}>
          <h2>Associated miRNA</h2>
          {mRNAdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={mRNAdata} />}
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

      </div>
    </div>

  );




}

export default ProteinDetail;


