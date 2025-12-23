import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import 'mdbreact/dist/css/mdb.css';
import CytoscapeComponent from 'react-cytoscapejs';

function GeneDetail() {
  const [cytoscapeElements, setCytoscapeElements] = useState([
    { data: { id: 'center', label: 'Center Node' }, position: { x: 250, y: 250 } },
  ]);

  const tableStyle = {
    borderBottom: '1px solid black',
  };
  const tableClass = 'custom-table';

  const { index } = useParams();
  const [data, setData] = useState(null);
  const [CSCdata, setCSCdata] = useState(null);
  const [CCdata, setCCdata] = useState(null);
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  const [Lipiddata, setLipiddata] = useState(null);
  const [GOdata, setGOdata] = useState(null);
  const [KEGGdata, setKEGGdata] = useState(null);
  // 新增 GO enrichment 狀態
  const [GOEnrichContext, setGOEnrichContext] = useState(null);

  useEffect(() => {
    fetch(`http://db.cmdm.tw:8000/search/table/Gene/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        const dataBUrls = res.gene_rna_urls.map((obj) => obj.id_url);
        const dataCUrls = res.gene_ref_urls.map((obj) => obj.id_url);
        const dataDUrls = res.other_gene_ids.filter((obj) => obj.cellType === 'CSC').slice(0, 20).map((obj) => obj.url);
        const dataEUrls = res.other_gene_ids.filter((obj) => obj.cellType === 'cancer').slice(0, 20).map((obj) => obj.url);
        const dataFUrls = res.lipid_gene_urls.map((obj) => obj.id_url);

        const requestsB = dataBUrls.map((url) => fetch(url).then((r) => r.json()));
        const requestsC = dataCUrls.map((url) => fetch(url).then((r) => r.json()));
        const requestsD = dataDUrls.map((url) => fetch(url).then((r) => r.json()));
        const requestsE = dataEUrls.map((url) => fetch(url).then((r) => r.json()));
        const requestsF = dataFUrls.map((url) => fetch(url).then((r) => r.json()));

        // CSC data
        Promise.all(requestsD).then((dataDs) => {
          const CSCdata = {
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
          setCSCdata(CSCdata);
        });

        // CC data
        Promise.all(requestsE).then((dataEs) => {
          const CCdata = {
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
          setCCdata(CCdata);
        });

        // mRNA data
        Promise.all(requestsB).then((dataBs) => {
          const mRNAdata = {
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
          setmRNAdata(mRNAdata);
        });

        // Reference data
        Promise.all(requestsC).then((dataCs) => {
          const Refdata = {
            columns: [
              { label: 'Title', field: 'title', sort: 'asc', width: 270 },
              { label: 'Journal', field: 'journal', sort: 'asc', width: 270 },
              { label: 'Year', field: 'year', sort: 'asc', width: 270 },
              { label: 'Author', field: 'author', sort: 'asc', width: 200 },
              { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
            ],
            rows: dataCs.map((d) => ({
              title: d.title,
              journal: d.journal,
              year: d.year,
              author: d.author ? d.author.split(',')[0] : '',
              pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} style={{ color: 'blue' }}>{d.pmcid}</a>,
            })),
          };
          setRefdata(Refdata);
        });

        // Lipid data
        Promise.all(requestsF).then((dataFs) => {
          const Lipiddata = {
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
          setLipiddata(Lipiddata);
        });

        // GO Annotation
        fetch(`http://db.cmdm.tw:8000/gene/${parseInt(res.entrezID)}/go/`)
          .then((r) => r.json())
          .then((goRes) => {
            const GOdata = {
              columns: [
                { label: 'GO ID', field: 'go_id', sort: 'asc', width: 150 },
                { label: 'GO Name', field: 'go_name', sort: 'asc', width: 300 },
                { label: 'Domain', field: 'domain', sort: 'asc', width: 100 },
              ],
              rows: goRes.map((g) => ({
                go_id: g.go_id,
                go_name: g.go_name,
                domain: g.domain,
              })),
            };
            setGOdata(GOdata);
          })
          .catch((err) => console.error('Error fetching GO:', err));

        // KEGG Annotation
        fetch(`http://db.cmdm.tw:8000/search/table/GeneKegg/${index}/`)
          .then((r) => r.json())
          .then((keggRes) => {
            const KEGGdata = {
              columns: [
                { label: 'Pathway ID', field: 'pathway_id', sort: 'asc', width: 150 },
                { label: 'Pathway Name', field: 'pathway_name', sort: 'asc', width: 300 },
                { label: 'P-value', field: 'p_value', sort: 'asc', width: 150 },
                { label: 'Score', field: 'score', sort: 'asc', width: 100 },
              ],
              rows: (keggRes.pathways || []).map((k) => ({
                pathway_id: <a href={`https://www.kegg.jp/pathway/${k.pathway_id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>{k.pathway_id}</a>,
                pathway_name: k.pathway_name,
                p_value: k.p_value ? k.p_value.toExponential(4) : '-',
                score: k.score ? parseFloat(k.score).toFixed(2) : '0.00',
              })),
            };
            setKEGGdata(KEGGdata);
          })
          .catch((err) => console.error('Error fetching KEGG:', err));

        // --- 重點修改：改用 EntrezID 抓取 GO Enrichment ---
        if (res.entrezID) {
            // 處理 1969.0 這種格式為整數
            const cleanEntrezID = Math.floor(parseFloat(res.entrezID));
            fetch(`http://db.cmdm.tw:8000/api/gene-detail/?entrez_id=${cleanEntrezID}`)
              .then((r) => r.json())
              .then((enrichRes) => {
                const formattedEnrich = {
                  csc: {
                    columns: [
                      { label: 'Term', field: 'term', sort: 'asc', width: 300 },
                      { label: 'Score', field: 'score', sort: 'asc', width: 100 },
                      { label: 'FDR (Adj P)', field: 'fdr', sort: 'asc', width: 150 },
                    ],
                    rows: (enrichRes.csc_context || []).map(c => ({
                      term: c.Term,
                      score: <span className="badge badge-danger" style={{padding: '5px 10px'}}>{c.Score.toFixed(2)}</span>,
                      fdr: c.Adjusted_P.toExponential(2)
                    }))
                  },
                  cancer: {
                    columns: [
                      { label: 'Term', field: 'term', sort: 'asc', width: 300 },
                      { label: 'Score', field: 'score', sort: 'asc', width: 100 },
                      { label: 'FDR (Adj P)', field: 'fdr', sort: 'asc', width: 150 },
                    ],
                    rows: (enrichRes.cancer_context || []).map(c => ({
                      term: c.Term,
                      score: <span className="badge badge-primary" style={{padding: '5px 10px'}}>{c.Score.toFixed(2)}</span>,
                      fdr: c.Adjusted_P.toExponential(2)
                    }))
                  }
                };
                setGOEnrichContext(formattedEnrich);
              })
              .catch((err) => console.error('Error fetching Enrichment Context by ID:', err));
          }
      });
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
            <li><a href="#go-annotation">GO Annotation</a></li>
            <li><a href="#go-enrichment">Functional Context</a></li>
            <li><a href="#kegg-annotation">KEGG Annotation</a></li>
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
              <tr><th colSpan="2">{data.description}</th></tr>
            </thead>
            <tbody>
              <tr><th>Gene name</th><td>{data.cargo}</td></tr>
              <tr><th>Gene symbol</th><td>{data.entrezName}</td></tr>
              <tr><th>Entrez Gene</th><td>{data.entrezID}</td></tr>
            </tbody>
          </table>
        </div>

        <div id="geneCSC" style={{ marginTop: '50px' }}>
          <h2>Associated genes in cancer stem cell exosome</h2>
          {CSCdata && <MDBDataTable striped noBottomColumns searching={false} paging={false} data={CSCdata} style={tableStyle}/>}
        </div>

        <div id="geneCC" style={{ marginTop: '50px' }}>
          <h2>Associated genes in cancer cell exosome</h2>
          {CCdata && <MDBDataTable striped noBottomColumns searching={false} paging={false} data={CCdata} className={tableClass}/>}
        </div>

        <div id="gene-RNA" style={{ marginTop: '50px' }}>
          <h2>Associated miRNA</h2>
          {mRNAdata && <MDBDataTable striped noBottomColumns searching={false} paging={false} data={mRNAdata} className={tableClass}/>}
        </div>

        <div id="gene-lipid" style={{ marginTop: '50px' }}>
          <h2>Associated Lipids</h2>
          {Lipiddata && <MDBDataTable striped noBottomColumns searching={false} paging={false} data={Lipiddata} className={tableClass}/>}
        </div>

        <div id="go-annotation" style={{ marginTop: '50px' }}>
          <h2>GO Annotation</h2>
          {GOdata && <MDBDataTable striped noBottomColumns searching={false} paging={false} data={GOdata} className={tableClass}/>}
        </div>

        {/* GO Enrichment 區塊 */}
        <div id="go-enrichment" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fcfcfc', border: '1px solid #eee', borderRadius: '10px' }}>
          <h2 style={{ marginBottom: '10px' }}>Functional Enrichment Context</h2>
          <p className="text-muted" style={{ fontSize: '13px' }}>
            Comparison of significant biological processes (GO) enriched in CSC vs Cancer collections (Background N=20,000).
          </p>
          <div className="row">
            <div className="col-md-6">
              <h4 style={{ color: '#d9534f', fontSize: '1.2rem' }}>CSC Specific Enrichment</h4>
              {GOEnrichContext && GOEnrichContext.csc.rows.length > 0 ? (
                <MDBDataTable striped small noBottomColumns searching={false} paging={false} data={GOEnrichContext.csc} />
              ) : <div className="p-3 bg-light text-center" style={{borderRadius: '5px'}}>No significant CSC enrichment.</div>}
            </div>
            <div className="col-md-6">
              <h4 style={{ color: '#0275d8', fontSize: '1.2rem' }}>Cancer General Enrichment</h4>
              {GOEnrichContext && GOEnrichContext.cancer.rows.length > 0 ? (
                <MDBDataTable striped small noBottomColumns searching={false} paging={false} data={GOEnrichContext.cancer} />
              ) : <div className="p-3 bg-light text-center" style={{borderRadius: '5px'}}>No significant Cancer enrichment.</div>}
            </div>
          </div>
        </div>

        <div id="kegg-annotation" style={{ marginTop: '50px' }}>
          <h2>KEGG Annotation</h2>
          {KEGGdata && KEGGdata.rows.length > 0 ? (
            <MDBDataTable striped noBottomColumns searching={false} paging={false} data={KEGGdata} className={tableClass}/>
          ) : (
            <div className="alert alert-light" style={{ border: '1px solid #eee', padding: '15px' }}>
              No significant KEGG pathways enriched for this gene in the current dataset.
            </div>
          )}
        </div>

        <div id="references" style={{ marginTop: '50px' }}>
          <h2>Associated References</h2>
          {Refdata && <MDBDataTable striped noBottomColumns searching={false} paging={false} data={Refdata} className={tableClass}/>}
        </div>

        <footer>
          <img src="../CMDM-Lab.png" alt="Lab Logo" style={{ verticalAlign: "middle", width: "6%", textAlign: "left" }} />
          © 2023, Computational Molecular Design and Metabolomics Laboratory
        </footer>
      </div>
    </div>
  );
}

export default GeneDetail;