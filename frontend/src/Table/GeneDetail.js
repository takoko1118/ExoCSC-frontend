import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import 'mdbreact/dist/css/mdb.css';
import CytoscapeComponent from 'react-cytoscapejs';

function GeneDetail() {
  // PPI 狀態與樣式設定
  const [ppiElements, setPpiElements] = useState(null);
  const ppiStylesheet = [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'background-color': '#0275d8',
        'width': 25,
        'height': 25,
        'font-size': '10px',
        'color': '#333'
      }
    },
    {
      selector: 'node[type = "center"]',
      style: {
        'background-color': '#d9534f',
        'width': 40,
        'height': 40,
        'font-weight': 'bold',
        'font-size': '12px'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 1.5,
        'line-color': '#ccc',
        'curve-style': 'bezier',
        'opacity': 0.7
      }
    }
  ];

  const tableStyle = { borderBottom: '1px solid black' };
  const tableClass = 'custom-table';

  const { index } = useParams();
  const [data, setData] = useState(null);
  const [geneRnaRaw, setGeneRnaRaw] = useState([]); // 用於提取 llm_narrative
  const [CSCdata, setCSCdata] = useState(null);
  const [CCdata, setCCdata] = useState(null);
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  const [Lipiddata, setLipiddata] = useState(null);
  const [GOdata, setGOdata] = useState(null);
  const [KEGGdata, setKEGGdata] = useState(null);
  const [GOEnrichContext, setGOEnrichContext] = useState(null);

  useEffect(() => {
    fetch(`http://db.cmdm.tw:8000/search/table/Gene/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        // PPI Network Fetch
        if (res.entrezID) {
          const cleanID = Math.floor(parseFloat(res.entrezID));
          fetch(`http://db.cmdm.tw:8000/api/ppi/?entrez_id=${cleanID}`)
            .then(r => r.json())
            .then(ppiRes => {
              if (ppiRes && ppiRes.length > 0) setPpiElements(ppiRes);
            })
            .catch(err => console.error('Error fetching PPI:', err));
        }

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

        // 處理 mRNA 資料與 LLM 敘述
        Promise.all(requestsB).then((dataBs) => {
          setGeneRnaRaw(dataBs); // 保存原始數據供 Description 欄位使用
          const formattedMRNA = {
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
          setmRNAdata(formattedMRNA);
        });

        // 處理 CSC 資料
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

        // 處理 Cancer Cell 資料
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

        // 處理 Reference 資料
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

        // 處理 Lipid 資料
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

        // GO Annotation Fetch
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

        // KEGG Enrichment Fetch
        fetch(`http://db.cmdm.tw:8000/search/table/GeneKegg/${index}/`)
          .then((r) => r.json())
          .then((keggRes) => {
            const formatKeggTable = (pathwayList, colorClass) => ({
              columns: [
                { label: 'Pathway ID', field: 'pathway_id', sort: 'asc', width: 150 },
                { label: 'Pathway Name', field: 'pathway_name', sort: 'asc', width: 300 },
                { label: 'P-value', field: 'p_value', sort: 'asc', width: 150 },
                { label: 'Score', field: 'score', sort: 'asc', width: 100 },
              ],
              rows: (pathwayList || []).map((k) => ({
                pathway_id: <a href={`https://www.kegg.jp/pathway/${k.pathway_id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>{k.pathway_id}</a>,
                pathway_name: k.pathway_name,
                p_value: k.p_value ? k.p_value.toExponential(4) : '-',
                score: k.score ? (
                  <span className={`badge ${colorClass}`} style={{padding: '5px 10px'}}>{parseFloat(k.score).toFixed(2)}</span>
                ) : '0.00',
              })),
            });

            setKEGGdata({
              csc: formatKeggTable(keggRes.csc_pathways, 'badge-danger'),
              cancer: formatKeggTable(keggRes.cancer_pathways, 'badge-primary'),
            });
          })
          .catch((err) => console.error('Error fetching KEGG:', err));

        // GO Enrichment Context Fetch
        if (res.entrezID) {
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
            <li><a href="#go-enrichment">GO Enrichment</a></li>
            <li><a href="#kegg-annotation">KEGG Enrichment</a></li>
            <li><a href="#ppi-network">PPI Network</a></li>
            <li><a href="#references">Reference</a></li>
          </ul>
        </nav>
      </aside>
      <div className="content">
        <h1>{data.cargo}</h1>

        <div id="description" style={{ marginTop: '50px' }}>
          <h2>Description</h2>
          <table className='detailTable' style={{ fontSize: '12px', width: '90%' }}>
            <thead>
              {/* 原本顯示 data.description 的部分已移除，改為資訊標題 */}
              <tr><th colSpan="2" style={{ backgroundColor: '#f4f4f4', textAlign: 'center' }}>Gene Functional Information</th></tr>
            </thead>
            <tbody>
              <tr><th style={{ width: '25%' }}>Gene name</th><td>{data.cargo}</td></tr>
              <tr><th>Gene symbol</th><td>{data.entrezName}</td></tr>
              <tr><th>Entrez Gene</th><td>{data.entrezID}</td></tr>
              
              {/* 新增：LLM 整合欄位 */}
              <tr>
                <th>AI Functional Narrative</th>
                <td style={{ textAlign: 'left', padding: '15px', lineHeight: '1.6' }}>
                  {geneRnaRaw.length > 0 ? (
                    geneRnaRaw.map((item, idx) => (
                      item.llm_narrative && (
                        <div key={idx} style={{ 
                          marginBottom: '15px', 
                          padding: '10px', 
                          borderLeft: '4px solid #0275d8', 
                          backgroundColor: '#f9f9f9' 
                        }}>
                          <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#666', marginBottom: '5px' }}>
                            Associated miRNA: {item.cargo_rna}
                          </div>
                          <div style={{ whiteSpace: 'pre-wrap' }}>
                            {item.llm_narrative}
                          </div>
                        </div>
                      )
                    ))
                  ) : (
                    <span className="text-muted">Narrative data not available for this gene.</span>
                  )}
                </td>
              </tr>
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

        <div id="go-enrichment" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fcfcfc', border: '1px solid #eee', borderRadius: '10px' }}>
          <h2 style={{ marginBottom: '10px' }}>GO Enrichment</h2>
          <p className="text-muted" style={{ fontSize: '13px' }}>
            Comparison of significant biological processes (GO) enriched in CSC vs Cancer collections.
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

        <div id="kegg-annotation" style={{ marginTop: '50px', padding: '20px', backgroundColor: '#f4f7f6', border: '1px solid #eee', borderRadius: '10px' }}>
          <h2 style={{ marginBottom: '10px' }}>KEGG Enrichment</h2>
          <p className="text-muted" style={{ fontSize: '13px' }}>
            Comparison of significant pathways (KEGG) enriched in CSC vs Cancer collections.
          </p>
          <div className="row">
            <div className="col-md-6">
              <h4 style={{ color: '#d9534f', fontSize: '1.2rem' }}>CSC Specific Enrichment</h4>
              {KEGGdata && KEGGdata.csc.rows.length > 0 ? (
                <MDBDataTable striped small noBottomColumns searching={false} paging={false} data={KEGGdata.csc} />
              ) : <div className="p-3 bg-light text-center" style={{borderRadius: '5px'}}>No significant CSC KEGG enrichment.</div>}
            </div>
            <div className="col-md-6">
              <h4 style={{ color: '#0275d8', fontSize: '1.2rem' }}>Cancer General Enrichment</h4>
              {KEGGdata && KEGGdata.cancer.rows.length > 0 ? (
                <MDBDataTable striped small noBottomColumns searching={false} paging={false} data={KEGGdata.cancer} />
              ) : <div className="p-3 bg-light text-center" style={{borderRadius: '5px'}}>No significant Cancer KEGG enrichment.</div>}
            </div>
          </div>
        </div>

        <div id="ppi-network" style={{ marginTop: '50px', padding: '20px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '10px' }}>
          <h2 style={{ marginBottom: '10px' }}>Protein-Protein Interaction Network</h2>
          <p className="text-muted" style={{ fontSize: '13px' }}>
            Predicted protein interactions based on STRING database (Confidence score > 0.7). 
            Red node represents the current gene.
          </p>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', height: '500px', backgroundColor: '#fafafa', position: 'relative' }}>
            {ppiElements ? (
              <CytoscapeComponent 
                elements={ppiElements} 
                style={{ width: '100%', height: '100%' }} 
                layout={{ name: 'cose', nodeRepulsion: 4000, padding: 30 }} 
                stylesheet={ppiStylesheet}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                No protein interaction data available for this gene.
              </div>
            )}
          </div>
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