import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import 'mdbreact/dist/css/mdb.css';

function RNADetail() {
  const { index } = useParams();
  const [data, setData] = useState(null);
  const [Genedata, setGenedata] = useState(null);
  const [Lipiddata, setLipiddata] = useState(null);
  const [Proteindata, setProteindata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const MAX_URLS = 20;

  useEffect(() => {
    setIsLoading(true);

    fetch(`http://db.cmdm.tw:8000/search/table/RNA/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        const dataBUrls = res.gene_rna_urls.slice(0, MAX_URLS).map(obj => obj.id_url);
        const dataCUrls = res.rna_ref_urls.slice(0, MAX_URLS).map(obj => obj.id_url);
        const dataDUrls = res.lipid_rna_urls.slice(0, MAX_URLS).map(obj => obj.id_url);
        const dataEUrls = res.protein_rna_urls.slice(0, MAX_URLS).map(obj => obj.id_url);

        const fetchAll = (urls) => Promise.all(urls.map(url => fetch(url).then(r => r.json())));

        const commonCols = [
          { label: 'Name', field: 'gene', width: 200 },
          { label: 'Tissue', field: 'tissue', width: 150 },
          { label: 'Score', field: 'score', width: 100 },
          { label: 'Cell Line', field: 'cellline', width: 150 },
          { label: 'PMCID', field: 'pmcid', width: 120 },
        ];

        // Fetch Associated Proteins
        fetchAll(dataEUrls).then(dataEs => {
          setProteindata({
            columns: commonCols,
            rows: dataEs.map(d => ({
              gene: <a href={`http://db.cmdm.tw:13007/protein/${d.protein_url}`} style={{ color: 'blue' }}>{d.cargo_protein}</a>,
              tissue: d.tissue,
              score: d.score_x,
              cellline: d.cellLine,
              pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a>
            }))
          });
        });

        // Fetch Associated Lipids
        fetchAll(dataDUrls).then(dataDs => {
          setLipiddata({
            columns: commonCols,
            rows: dataDs.map(d => ({
              gene: <a href={`http://db.cmdm.tw:13007/Lipid/${d.lipid_url}`} style={{ color: 'blue' }}>{d.cargo_lipid}</a>,
              tissue: d.tissue,
              score: d.score_x,
              cellline: d.cellLine,
              pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a>
            }))
          });
        });

        // Fetch Associated Genes
        fetchAll(dataBUrls).then(dataBs => {
          setGenedata({
            columns: commonCols,
            rows: dataBs.map(d => ({
              gene: <a href={`http://db.cmdm.tw:13007/gene/${d.gene_url}`} style={{ color: 'blue' }}>{d.cargo_gene}</a>,
              tissue: d.tissue,
              score: d.score_x,
              cellline: d.cellLine,
              pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a>
            }))
          });
        });

        // Fetch References (取第一作者)
        fetchAll(dataCUrls).then(dataCs => {
          setRefdata({
            columns: [
              { label: 'Title', field: 'title', width: 250 },
              { label: 'Journal', field: 'journal', width: 150 },
              { label: 'Year', field: 'year', width: 80 },
              { label: 'Author', field: 'author', width: 120 },
              { label: 'PMCID', field: 'pmcid', width: 120 },
            ],
            rows: dataCs.map(d => ({
              title: d.title,
              journal: d.journal,
              year: d.year,
              author: d.author ? d.author.split(',')[0] : '',
              pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a>
            }))
          });
        }).finally(() => {
          setIsLoading(false);
        });
      })
      .catch(error => {
        console.error('Error fetching RNA data:', error);
        setIsLoading(false);
      });
  }, [index]);

  if (isLoading || !data) {
    return <div className="p-5 text-center">Loading...</div>;
  }

  return (
    <div className='detail-page'>
      <aside>
        <nav className="nav-bar flex-column sticky-top">
          <h4>Menu</h4>
          <ul>
            <li><a href="#description">Description</a></li>
            <li><a href="#gene-gene">Associated Genes</a></li>
            <li><a href="#gene-protein">Associated Proteins</a></li>
            <li><a href="#gene-lipid">Associated Lipids</a></li>
            <li><a href="#references">Reference</a></li>
          </ul>
        </nav>
      </aside>

      <div className="content">
        <h1>{data.cargo}</h1>

        <div id="description" className="section-container">
          <h2>Description</h2>
          <table className='detailTable'>
            <thead>
              <tr>
                <th colSpan="2" style={{ backgroundColor: '#f4f4f4', textAlign: 'center' }}>RNA Information</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ width: '25%' }}>RNA name</th>
                <td>{data.cargo}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td style={{ textAlign: 'left', padding: '15px' }}>{data.description || 'No description available.'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id="gene-gene" className="section-container">
          <h2>Associated Genes</h2>
          {Genedata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={Genedata} />}
        </div>

        <div id="gene-protein" className="section-container">
          <h2>Associated Proteins</h2>
          {Proteindata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={Proteindata} />}
        </div>

        <div id="gene-lipid" className="section-container">
          <h2>Associated Lipids</h2>
          {Lipiddata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={Lipiddata} />}
        </div>

        <div id="references" className="section-container">
          <h2>Associated References</h2>
          {Refdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={Refdata} />}
        </div>

        <footer>
          <img src="../CMDM-Lab.png" alt="Lab Logo" style={{ width: "60px", marginBottom: '10px' }} />
          <p>© 2023, Computational Molecular Design and Metabolomics Laboratory</p>
        </footer>
      </div>
    </div>
  );
}

export default RNADetail;