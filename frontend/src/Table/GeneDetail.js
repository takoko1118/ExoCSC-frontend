import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import 'mdbreact/dist/css/mdb.css';
import CytoscapeComponent from 'react-cytoscapejs';

function GeneDetail() {
  const { index } = useParams();
  const [data, setData] = useState(null);
  const [geneRnaRaw, setGeneRnaRaw] = useState([]);
  const [CSCdata, setCSCdata] = useState(null);
  const [CCdata, setCCdata] = useState(null);
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  const [Lipiddata, setLipiddata] = useState(null);
  const [GOdata, setGOdata] = useState(null);
  const [KEGGdata, setKEGGdata] = useState(null);
  const [GOEnrichContext, setGOEnrichContext] = useState(null);
  const [ppiElements, setPpiElements] = useState(null);

  const ppiStylesheet = [
    { selector: 'node', style: { 'label': 'data(label)', 'background-color': '#0275d8', 'width': 25, 'height': 25, 'font-size': '10px', 'color': '#333' } },
    { selector: 'node[type = "center"]', style: { 'background-color': '#d9534f', 'width': 40, 'height': 40, 'font-weight': 'bold', 'font-size': '12px' } },
    { selector: 'edge', style: { 'width': 1.5, 'line-color': '#ccc', 'curve-style': 'bezier', 'opacity': 0.7 } }
  ];

  useEffect(() => {
    fetch(`http://db.cmdm.tw:8000/search/table/Gene/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        if (res.entrezID) {
          const cleanID = Math.floor(parseFloat(res.entrezID));
          fetch(`http://db.cmdm.tw:8000/api/ppi/?entrez_id=${cleanID}`)
            .then(r => r.json())
            .then(ppiRes => { if (ppiRes && ppiRes.length > 0) setPpiElements(ppiRes); })
            .catch(err => console.error('Error fetching PPI:', err));
        }

        const dataBUrls = res.gene_rna_urls.map((obj) => obj.id_url);
        const dataCUrls = res.gene_ref_urls.map((obj) => obj.id_url);
        const dataDUrls = res.other_gene_ids.filter((obj) => obj.cellType === 'CSC').slice(0, 20).map((obj) => obj.url);
        const dataEUrls = res.other_gene_ids.filter((obj) => obj.cellType === 'cancer').slice(0, 20).map((obj) => obj.url);
        const dataFUrls = res.lipid_gene_urls.map((obj) => obj.id_url);

        const fetchAll = (urls) => Promise.all(urls.map(url => fetch(url).then(r => r.json())));

        // mRNA
        fetchAll(dataBUrls).then(dataBs => {
          setGeneRnaRaw(dataBs);
          setmRNAdata({
            columns: [
              { label: 'Name', field: 'gene', width: 200 },
              { label: 'Tissue', field: 'tissue', width: 150 },
              { label: 'Score', field: 'score', width: 100 },
              { label: 'Cell Line', field: 'cellline', width: 150 },
              { label: 'PMCID', field: 'pmcid', width: 120 },
            ],
            rows: dataBs.map(d => ({
              gene: <a href={`http://db.cmdm.tw:13007/rna/${d.rna_url}`} style={{ color: 'blue' }}>{d.cargo_rna}</a>,
              tissue: d.tissue, score: d.score_y, cellline: d.cellLine,
              pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a>
            }))
          });
        });

        // Common Data Fetch (CSC, CC, Lipid)
        const commonCols = [{ label: 'Name', field: 'gene', width: 200 }, { label: 'Tissue', field: 'tissue', width: 150 }, { label: 'Score', field: 'score', width: 100 }, { label: 'Cell Line', field: 'cellline', width: 150 }, { label: 'PMCID', field: 'pmcid', width: 120 }];
        
        fetchAll(dataDUrls).then(dataDs => setCSCdata({ columns: commonCols, rows: dataDs.map(d => ({ gene: <a href={`http://db.cmdm.tw:13007/gene/${d.id}`} style={{ color: 'blue' }}>{d.cargo}</a>, tissue: d.tissue, score: d.score, cellline: d.cellLine, pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a> })) }));
        fetchAll(dataEUrls).then(dataEs => setCCdata({ columns: commonCols, rows: dataEs.map(d => ({ gene: <a href={`http://db.cmdm.tw:13007/gene/${d.id}`} style={{ color: 'blue' }}>{d.cargo}</a>, tissue: d.tissue, score: d.score, cellline: d.cellLine, pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a> })) }));
        fetchAll(dataFUrls).then(dataFs => setLipiddata({ columns: commonCols, rows: dataFs.map(d => ({ gene: <a href={`http://db.cmdm.tw:13007/lipid/${d.lipid_url}`} style={{ color: 'blue' }}>{d.cargo_lipid}</a>, tissue: d.tissue, score: d.score_y, cellline: d.cellLine, pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a> })) }));

        // References
        fetchAll(dataCUrls).then(dataCs => setRefdata({ columns: [{ label: 'Title', field: 'title', width: 250 }, { label: 'Journal', field: 'journal', width: 150 }, { label: 'Year', field: 'year', width: 80 }, { label: 'Author', field: 'author', width: 120 }, { label: 'PMCID', field: 'pmcid', width: 120 }], rows: dataCs.map(d => ({ title: d.title, journal: d.journal, year: d.year, author: d.author ? d.author.split(',')[0] : '', pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a> })) }));

        // GO Annotation
        fetch(`http://db.cmdm.tw:8000/gene/${parseInt(res.entrezID)}/go/`).then(r => r.json()).then(goRes => setGOdata({ columns: [{ label: 'GO ID', field: 'go_id', width: 150 }, { label: 'GO Name', field: 'go_name', width: 350 }, { label: 'Domain', field: 'domain', width: 100 }], rows: goRes.map(g => ({ go_id: g.go_id, go_name: g.go_name, domain: g.domain })) }));

        // KEGG & Enrichment
        fetch(`http://db.cmdm.tw:8000/search/table/GeneKegg/${index}/`).then(r => r.json()).then(keggRes => {
          const fmtKegg = (list, cls) => ({ columns: [{ label: 'Pathway ID', field: 'id', width: 120 }, { label: 'Pathway Name', field: 'name', width: 300 }, { label: 'P-value', field: 'p', width: 120 }, { label: 'Score', field: 's', width: 100 }], rows: (list || []).map(k => ({ id: <a href={`https://www.kegg.jp/pathway/${k.pathway_id}`} target="_blank" rel="noreferrer" style={{color: 'blue'}}>{k.pathway_id}</a>, name: k.pathway_name, p: k.p_value ? k.p_value.toExponential(4) : '-', s: <span className={`badge ${cls}`} style={{padding: '5px 10px'}}>{parseFloat(k.score).toFixed(2)}</span> })) });
          setKEGGdata({ csc: fmtKegg(keggRes.csc_pathways, 'badge-danger'), cancer: fmtKegg(keggRes.cancer_pathways, 'badge-primary') });
        });

        if (res.entrezID) {
          fetch(`http://db.cmdm.tw:8000/api/gene-detail/?entrez_id=${Math.floor(parseFloat(res.entrezID))}`).then(r => r.json()).then(enr => {
            const fmtEnr = (list, cls) => ({ columns: [{ label: 'Term', field: 't', width: 300 }, { label: 'Score', field: 's', width: 100 }, { label: 'FDR', field: 'f', width: 120 }], rows: (list || []).map(c => ({ t: c.Term, s: <span className={`badge ${cls}`} style={{padding: '5px 10px'}}>{c.Score.toFixed(2)}</span>, f: c.Adjusted_P.toExponential(2) })) });
            setGOEnrichContext({ csc: fmtEnr(enr.csc_context, 'badge-danger'), cancer: fmtEnr(enr.cancer_context, 'badge-primary') });
          });
        }
      });
  }, [index]);

  if (!data) return <div className="p-5 text-center">Loading...</div>;

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

        <div id="description" className="section-container">
          <h2>Description</h2>
          <table className='detailTable'>
            <thead>
              <tr><th colSpan="2" style={{ backgroundColor: '#f4f4f4', textAlign: 'center' }}>Gene Information</th></tr>
            </thead>
            <tbody>
              <tr><th style={{ width: '25%' }}>Gene name</th><td>{data.cargo}</td></tr>
              <tr><th>Gene symbol</th><td>{data.entrezName}</td></tr>
              <tr>
                <th>Entrez Gene</th>
                <td>{data.entrezID ? Math.floor(parseFloat(data.entrezID)) : ''}</td>
              </tr>
              <tr>
                <th>AI Functional Narrative</th>
                <td style={{ textAlign: 'left', padding: '15px', lineHeight: '1.6' }}>
                  {geneRnaRaw.length > 0 ? geneRnaRaw.map((item, idx) => (
                    item.llm_narrative && (
                      <div key={idx} className="narrative-box">
                        <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#666', marginBottom: '5px' }}>Associated miRNA: {item.cargo_rna}</div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{item.llm_narrative}</div>
                      </div>
                    )
                  )) : <span className="text-muted">Narrative data not available.</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id="geneCSC" className="section-container">
          <h2>Associated genes in cancer stem cell exosome</h2>
          {CSCdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={CSCdata} />}
        </div>

        <div id="geneCC" className="section-container">
          <h2>Associated genes in cancer cell exosome</h2>
          {CCdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={CCdata} />}
        </div>

        <div id="gene-RNA" className="section-container">
          <h2>Associated miRNA</h2>
          {mRNAdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={mRNAdata} />}
        </div>

        <div id="gene-lipid" className="section-container">
          <h2>Associated Lipids</h2>
          {Lipiddata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={Lipiddata} />}
        </div>

        <div id="go-annotation" className="section-container">
          <h2>GO Annotation</h2>
          {GOdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={GOdata} />}
        </div>

        <div id="go-enrichment" className="section-container" style={{ padding: '20px', backgroundColor: '#fcfcfc', border: '1px solid #eee', borderRadius: '10px' }}>
          <h2>GO Enrichment</h2>
          <div className="row">
            <div className="col-md-6">
              <h4 style={{ color: '#d9534f' }}>CSC Specific Enrichment</h4>
              {GOEnrichContext && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={GOEnrichContext.csc} />}
            </div>
            <div className="col-md-6">
              <h4 style={{ color: '#0275d8' }}>Cancer General Enrichment</h4>
              {GOEnrichContext && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={GOEnrichContext.cancer} />}
            </div>
          </div>
        </div>

        <div id="kegg-annotation" className="section-container" style={{ padding: '20px', backgroundColor: '#f4f7f6', border: '1px solid #eee', borderRadius: '10px' }}>
          <h2>KEGG Enrichment</h2>
          <div className="row">
            <div className="col-md-6">
              <h4 style={{ color: '#d9534f' }}>CSC Specific Enrichment</h4>
              {KEGGdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={KEGGdata.csc} />}
            </div>
            <div className="col-md-6">
              <h4 style={{ color: '#0275d8' }}>Cancer General Enrichment</h4>
              {KEGGdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={KEGGdata.cancer} />}
            </div>
          </div>
        </div>

        <div id="ppi-network" className="section-container" style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '10px' }}>
          <h2>Protein-Protein Interaction Network</h2>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', height: '500px', backgroundColor: '#fafafa' }}>
            {ppiElements ? <CytoscapeComponent elements={ppiElements} style={{ width: '100%', height: '100%' }} layout={{ name: 'cose', nodeRepulsion: 4000, padding: 30 }} stylesheet={ppiStylesheet} /> : <div className="text-center p-5 text-muted">No interaction data.</div>}
          </div>
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

export default GeneDetail;