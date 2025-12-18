import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import './Detail.css';
import CytoscapeComponent from 'react-cytoscapejs';

function GeneDetail() {
  const { index } = useParams();

  const [data, setData] = useState(null);
  const [CSCdata, setCSCdata] = useState(null);
  const [CCdata, setCCdata] = useState(null);
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Lipiddata, setLipiddata] = useState(null);
  const [Refdata, setRefdata] = useState(null);

  const [GOdata, setGOdata] = useState(null);
  const [GOloading, setGOloading] = useState(false);

  const tableClass = 'custom-table';
  const tableStyle = { borderBottom: '1px solid black' };
  const MAX_URLS = 20;

  useEffect(() => {
    // 1️⃣ 先抓主要 Gene 資料
    fetch(`http://db.cmdm.tw:8000/search/table/Gene/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        // --- 抓其他相關資料 ---
        const dataBUrls = res.gene_rna_urls.map((obj) => obj.id_url);
        const dataCUrls = res.gene_ref_urls.map((obj) => obj.id_url);
        const dataDUrls = res.other_gene_ids
          .filter((obj) => obj.cellType === 'CSC')
          .slice(0, MAX_URLS)
          .map((obj) => obj.url);
        const dataEUrls = res.other_gene_ids
          .filter((obj) => obj.cellType === 'cancer')
          .slice(0, MAX_URLS)
          .map((obj) => obj.url);
        const dataFUrls = res.lipid_gene_urls.map((obj) => obj.id_url);

        const requestsB = dataBUrls.map((url) => fetch(url).then((r) => r.json()));
        const requestsC = dataCUrls.map((url) => fetch(url).then((r) => r.json()));
        const requestsD = dataDUrls.map((url) => fetch(url).then((r) => r.json()));
        const requestsE = dataEUrls.map((url) => fetch(url).then((r) => r.json()));
        const requestsF = dataFUrls.map((url) => fetch(url).then((r) => r.json()));

        // 2️⃣ CSC genes
        Promise.all(requestsD)
          .then((dataDs) => {
            const table = {
              columns: [
                { label: 'Name', field: 'gene', sort: 'asc', width: 270 },
                { label: 'Tissue', field: 'tissue', sort: 'asc', width: 270 },
                { label: 'Score', field: 'score', sort: 'asc', width: 200 },
                { label: 'Cell Line', field: 'cellline', sort: 'asc', width: 150 },
                { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
              ],
              rows: dataDs.map((d) => ({
                gene: <a href={`http://db.cmdm.tw:13007/gene/${d.id}`} style={{ color: 'blue' }}>{d.cargo}</a>,
                tissue: d.tissue,
                score: d.score,
                cellline: d.cellLine,
                pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} style={{ color: 'blue' }}>{d.pmcid}</a>,
              })),
            };
            setCSCdata(table);
          })
          .catch((err) => console.error(err));

        // 3️⃣ Cancer cell genes
        Promise.all(requestsE)
          .then((dataEs) => {
            const table = {
              columns: [
                { label: 'Name', field: 'gene', sort: 'asc', width: 270 },
                { label: 'Tissue', field: 'tissue', sort: 'asc', width: 270 },
                { label: 'Score', field: 'score', sort: 'asc', width: 200 },
                { label: 'Cell Line', field: 'cellline', sort: 'asc', width: 150 },
                { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
              ],
              rows: dataEs.map((d) => ({
                gene: <a href={`http://db.cmdm.tw:13007/gene/${d.id}`} style={{ color: 'blue' }}>{d.cargo}</a>,
                tissue: d.tissue,
                score: d.score,
                cellline: d.cellLine,
                pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} style={{ color: 'blue' }}>{d.pmcid}</a>,
              })),
            };
            setCCdata(table);
          })
          .catch((err) => console.error(err));

        // 4️⃣ miRNA
        Promise.all(requestsB)
          .then((dataBs) => {
            const table = {
              columns: [
                { label: 'Name', field: 'gene', sort: 'asc', width: 270 },
                { label: 'Tissue', field: 'tissue', sort: 'asc', width: 270 },
                { label: 'Score', field: 'score', sort: 'asc', width: 200 },
                { label: 'Cell Line', field: 'cellline', sort: 'asc', width: 150 },
                { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
              ],
              rows: dataBs.map((d) => ({
                gene: <a href={`http://db.cmdm.tw:13007/rna/${d.rna_url}`} style={{ color: 'blue' }}>{d.cargo_rna}</a>,
                tissue: d.tissue,
                score: d.score_y,
                cellline: d.cellLine,
                pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} style={{ color: 'blue' }}>{d.pmcid}</a>,
              })),
            };
            setmRNAdata(table);
          })
          .catch((err) => console.error(err));

        // 5️⃣ Reference
        Promise.all(requestsC)
          .then((dataCs) => {
            const table = {
              columns: [
                { label: 'Title', field: 'title', sort: 'asc', width: 270 },
                { label: 'Journal', field: 'journal', sort: 'asc', width: 270 },
                { label: 'Year', field: 'year', sort: 'asc', width: 100 },
                { label: 'Author', field: 'author', sort: 'asc', width: 200 },
                { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
              ],
              rows: dataCs.map((d) => ({
                title: d.title,
                journal: d.journal,
                year: d.year,
                author: d.author,
                pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} style={{ color: 'blue' }}>{d.pmcid}</a>,
              })),
            };
            setRefdata(table);
          })
          .catch((err) => console.error(err));

        // 6️⃣ Lipid
        Promise.all(requestsF)
          .then((dataFs) => {
            const table = {
              columns: [
                { label: 'Name', field: 'gene', sort: 'asc', width: 270 },
                { label: 'Tissue', field: 'tissue', sort: 'asc', width: 270 },
                { label: 'Score', field: 'score', sort: 'asc', width: 200 },
                { label: 'Cell Line', field: 'cellline', sort: 'asc', width: 150 },
                { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
              ],
              rows: dataFs.map((d) => ({
                gene: <a href={`http://db.cmdm.tw:13007/lipid/${d.lipid_url}`} style={{ color: 'blue' }}>{d.cargo_lipid}</a>,
                tissue: d.tissue,
                score: d.score_y,
                cellline: d.cellLine,
                pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} style={{ color: 'blue' }}>{d.pmcid}</a>,
              })),
            };
            setLipiddata(table);
          })
          .catch((err) => console.error(err));

        // 7️⃣ GO Annotation table 使用 Entrez ID
        const entrezID = Math.floor(res.entrezID); 
        setGOloading(true);
        fetch(`http://db.cmdm.tw:8000/gene/${entrezID}/go/`)
          .then((res) => res.json())
          .then((goData) => {
            const table = {
              columns: [
                { label: 'GO ID', field: 'go_id', sort: 'asc', width: 150 },
                { label: 'GO Name', field: 'go_name', sort: 'asc', width: 300 },
                { label: 'Domain', field: 'domain', sort: 'asc', width: 100 },
              ],
              rows: goData.map((g) => ({
                go_id: g.go_id,
                go_name: g.go_name,
                domain: g.domain,
              })),
            };
            setGOdata(table);
            setGOloading(false);
          })
          .catch((err) => {
            console.error(err);
            setGOloading(false);
          });
      })
      .catch((err) => console.error(err));
  }, [index]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className='detail'>
      <aside>
        <nav className="nav-bar flex-column sticky-top">
          <h4>Menu</h4>
          <ul>
            <li><a href="#description">Description</a></li>
            <li><a href="#geneCC">Associated genes in Cancer cell</a></li>
            <li><a href="#geneCSC">Associated genes in Cancer Stem cell</a></li>
            <li><a href="#gene-RNA">Associated miRNA</a></li>
            <li><a href="#gene-lipid">Associated Lipids</a></li>
            <li><a href="#geneGO">GO Annotation</a></li>
            <li><a href="#references">Reference</a></li>
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
                <th colSpan="2">{data.description}</th>
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

        <div id="geneCSC" style={{ marginTop: '50px' }}>
          <h2>Associated genes in cancer stem cell exosome</h2>
          {CSCdata && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={CSCdata} style={tableStyle} />}
        </div>

        <div id="geneCC" style={{ marginTop: '50px' }}>
          <h2>Associated genes in cancer cell exosome</h2>
          {CCdata && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={CCdata} className={tableClass} />}
        </div>

        <div id="gene-RNA" style={{ marginTop: '50px' }}>
          <h2>Associated miRNA</h2>
          {mRNAdata && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={mRNAdata} className={tableClass} />}
        </div>

        <div id="gene-lipid" style={{ marginTop: '50px' }}>
          <h2>Associated Lipids</h2>
          {Lipiddata && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Lipiddata} className={tableClass} />}
        </div>

        <div id="geneGO" style={{ marginTop: '50px' }}>
          <h2>GO Annotation</h2>
          {GOloading ? (
            <div>Loading GO annotations...</div>
          ) : GOdata && GOdata.rows.length > 0 ? (
            <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={GOdata} className={tableClass} />
          ) : (
            <div>No GO annotations found.</div>
          )}
        </div>

        <div id="references" style={{ marginTop: '50px' }}>
          <h2>Associated References</h2>
          {Refdata && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Refdata} className={tableClass} />}
        </div>

        <footer>
          <img src="../CMDM-Lab.png" style={{ verticalAlign: "middle", width: "6%", textAlign: "left" }} />
          © 2023, Computational Molecular Design and Metabolomics Laboratory
        </footer>
      </div>
    </div>
  );
}

export default GeneDetail;
