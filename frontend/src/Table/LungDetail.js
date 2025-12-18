import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import 'mdbreact/dist/css/mdb.css';

function LungDetail() {
  const { index } = useParams();
  const [data, setData] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [dataC, setDataC] = useState(null);
  const [dataD, setDataD] = useState(null);
  const [dataE, setDataE] = useState(null);
  const [Genedata, setGenedata] = useState(null);
  const [Proteindata, setProteindata] = useState(null);
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  const MAX_URLS = 20; // Maximum number of URLs to catch
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  useEffect(() => {
    setIsLoading(true); // Set isLoading to true when the effect starts

    fetch(`http://db.cmdm.tw:8000/search/table/Lipid/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        const dataBUrls = res.lipid_rna_urls.slice(0, MAX_URLS).map(obj => obj.id_url);
        const dataCUrls = res.lipid_ref_urls.map(obj => obj.id_url);
        const dataDUrls = res.lipid_protein_urls.slice(0, MAX_URLS).map(obj => obj.id_url);
        const dataEUrls = res.lipid_gene_urls.slice(0, MAX_URLS).map(obj => obj.id_url);

        console.log('dataBUrls:', dataBUrls);
        console.log('dataCUrls:', dataCUrls);
        console.log('dataDUrls:', dataDUrls);
        console.log('dataEUrls:', dataDUrls);

        const requestsB = dataBUrls.map(url => fetch(url).then(response => response.json()));
        const requestsC = dataCUrls.map(url => fetch(url).then(response => response.json()));
        const requestsD= dataDUrls.map(url => fetch(url).then(response => response.json()));
        const requestsE= dataEUrls.map(url => fetch(url).then(response => response.json()));
        
        Promise.all(requestsE)
          .then((dataEs) => {
            setDataE(dataEs);
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
                  label: 'scroe',
                  field: 'scroe',
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
            dataEs.forEach((dataE) => {
                Genedata.rows.push({
                gene:<a href={`http://db.cmdm.tw:13007/gene/${dataE.gene_url}`} style={{ color: 'blue' }}>{dataE.cargo_gene}</a>,
                tissue: dataE.tissue,
                scroe: dataE.scroe,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataE.pmcid}`} style={{ color: 'blue' }}>{dataE.pmcid}</a>
              });
            });
            setGenedata(Genedata);
          })
          .catch((error) => {
            console.error('Error fetching dataB:', error);
          });
        
        
        
        Promise.all(requestsD)
          .then((dataDs) => {
            setDataD(dataDs);
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
                  label: 'scroe',
                  field: 'scroe',
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
            dataDs.forEach((dataD) => {
                Proteindata.rows.push({
                gene: <a href={`http://db.cmdm.tw:13007/protein/${dataD.protein_url}`} style={{ color: 'blue' }}>{dataD.cargo_protein}</a>,
                tissue: dataD.tissue,
                scroe: dataD.scroe,
                pmcid:<a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataD.pmcid}`} style={{ color: 'blue' }}>{dataD.pmcid}</a>
              });
            });
            setProteindata(Proteindata);
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
                  label: 'Tissue',
                  field: 'tissue',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'scroe',
                  field: 'scroe',
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
            dataBs.forEach((dataB) => {
              mRNAdata.rows.push({
                gene:<a href={`http://db.cmdm.tw:13007/rna/${dataB.rna_url}`} style={{ color: 'blue' }}>{dataB.cargo_rna}</a>,
                tissue: dataB.tissue,
                scroe: dataB.scroe,
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
          })
          .finally(() => {
            setIsLoading(false); // Set isLoading to false when the requests are complete
          });
      });
  }, [index]);

  console.log('results', data);
  console.log('dataB', dataB);
  console.log('Refdata', Refdata);
  console.log('RNAdata', mRNAdata);
  console.log('Proteindata', Proteindata);
  console.log('GeneData', Genedata);
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
              <a href="#gene-RNA">Associated Genes</a>
            </li>
            <li>
              <a href="#gene-protein">Associated Proteins</a>
            </li>
            <li>
              <a href="#gene-RNA">Associated miRNAs</a>
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
          <table className='detailTable' style={{ fontSize: '10px', width: '500px' }}>
            <thead>
              <tr>
                <th colSpan="2"><>{data.description}</></th>
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

        <div id="gene-RNA" style={{ marginTop: '50px' }}>
          <h2>Associated miRNAs</h2>
          {mRNAdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={mRNAdata} />}
        </div>

        

        <div id="references" style={{ marginTop: '50px' }}>
          <h2>Associated References</h2>
          {Refdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Refdata} />}
        </div>

        
      </div>
    </div>
  );
}

export default LungDetail;
