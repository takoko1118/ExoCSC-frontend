import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import 'mdbreact/dist/css/mdb.css';

const parseNarrative = (text) => {
  if (!text) return [];
  
  const sections = [];
  const patterns = [
    { label: 'Mechanism', key: 'Mechanism:' },
    { label: 'Summary', key: 'Summary:' },
    { label: 'Key Finding', key: 'Key Finding:' },
    { label: 'Literature Contribution', key: 'Literature Contribution:' }
  ];
  
  const positions = [];
  patterns.forEach(pattern => {
    const index = text.indexOf(pattern.key);
    if (index !== -1) {
      positions.push({ index, pattern });
    }
  });
  
  if (positions.length === 0) {
    return [{ label: '', content: text }];
  }
  
  positions.sort((a, b) => a.index - b.index);
  
  positions.forEach((pos, idx) => {
    const startIndex = pos.index + pos.pattern.key.length;
    const endIndex = idx < positions.length - 1 ? positions[idx + 1].index : text.length;
    const content = text.substring(startIndex, endIndex).trim();
    
    if (content) {
      sections.push({
        label: pos.pattern.label,
        content: content
      });
    }
  });
  
  return sections;
};

function LipidDetail() {
  const { index } = useParams();
  const [data, setData] = useState(null);
  const [Genedata, setGenedata] = useState(null);
  const [Proteindata, setProteindata] = useState(null);
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  const [geneRaw, setGeneRaw] = useState([]); // 新增 state 儲存 gene 原始資料
  const [proteinRaw, setProteinRaw] = useState([]); // 新增 state 儲存 protein 原始資料
  const [rnaRaw, setRnaRaw] = useState([]); // 新增 state 儲存 rna 原始資料
  const [isLoading, setIsLoading] = useState(true);
  const MAX_URLS = 20;

  useEffect(() => {
    setIsLoading(true);

    fetch(`http://172.16.146.196:8000/search/table/Lipid/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        const dataBUrls = res.lipid_rna_urls.slice(0, MAX_URLS).map(obj => obj.id_url);
        const dataCUrls = res.lipid_ref_urls.map(obj => obj.id_url);
        const refUrls = res.ref_urls ? res.ref_urls.slice(0, MAX_URLS).map(obj => obj.id_url) : [];
        const dataDUrls = res.lipid_protein_urls.slice(0, MAX_URLS).map(obj => obj.id_url);
        const dataEUrls = res.lipid_gene_urls.slice(0, MAX_URLS).map(obj => obj.id_url);

        const fetchAll = (urls) => Promise.all(urls.map(url => fetch(url).then(r => r.json())));

        const commonCols = [
          { label: 'Name', field: 'gene', width: 200 },
          { label: 'Tissue', field: 'tissue', width: 150 },
          { label: 'Score', field: 'score', width: 100 },
          { label: 'Cell Line', field: 'cellline', width: 150 },
          { label: 'PMCID', field: 'pmcid', width: 120 },
        ];

        // Fetch Associated Genes
        fetchAll(dataEUrls).then(dataEs => {
          setGeneRaw(dataEs); // 儲存原始資料
          setGenedata({
            columns: commonCols,
            rows: dataEs.map(d => ({
              gene: <a href={`http://172.16.146.196:3000/gene/${d.gene_url}`} style={{ color: 'blue' }}>{d.cargo_gene}</a>,
              tissue: d.tissue,
              score: d.score_y,
              pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a>,
              cellline: d.cell_line_y
            }))
          });
        });

        // Fetch Associated Proteins
        fetchAll(dataDUrls).then(dataDs => {
          setProteinRaw(dataDs); // 儲存原始資料
          setProteindata({
            columns: commonCols,
            rows: dataDs.map(d => ({
              gene: <a href={`http://172.16.146.196:3000/protein/${d.protein_url}`} style={{ color: 'blue' }}>{d.cargo_protein}</a>,
              tissue: d.tissue,
              score: d.score_y,
              cellline: d.cellLine,
              pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a>
            }))
          });
        });

        // Fetch Associated miRNAs
        fetchAll(dataBUrls).then(dataBs => {
          setRnaRaw(dataBs); // 儲存原始資料
          setmRNAdata({
            columns: commonCols,
            rows: dataBs.map(d => ({
              gene: <a href={`http://172.16.146.196:3000/rna/${d.rna_url}`} style={{ color: 'blue' }}>{d.cargo_rna}</a>,
              tissue: d.tissue,
              score: d.score_y,
              cellline: d.cellLine_y,
              pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a>
            }))
          });
        });

        // Fetch References (修正 Author 顯示第一作者)
        const refUrlsToUse = refUrls.length > 0 ? refUrls : dataCUrls;
        fetchAll(refUrlsToUse).then(dataCs => {
          setRefdata({
            columns: [
              { label: 'Title', field: 'title', width: 250 },
              { label: 'Journal', field: 'journal', width: 150 },
              { label: 'Year', field: 'year', width: 80 },
              { label: 'Author', field: 'author', width: 120 },
              { label: 'PMCID', field: 'pmcid', width: 120 },
            ],
            rows: dataCs.map(d => ({
              title: d.title || '',
              journal: d.journal || '',
              year: d.year || '',
              author: d.author ? d.author.split(',')[0] : '', // 這裡執行切割
              pmcid: d.pmcid ? <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a> : ''
            }))
          });
        }).finally(() => {
          setIsLoading(false);
        });
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
            <li><a href="#gene-RNA">Associated miRNAs</a></li>
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
                <th colSpan="2" style={{ backgroundColor: '#f4f4f4', textAlign: 'center' }}>Lipid Information</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ width: '25%' }}>Lipid name</th>
                <td>{data.cargo}</td>
              </tr>
              <tr>
                <th>Formula / Description</th>
                <td style={{ textAlign: 'left', padding: '15px' }}>{data.description}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id="gene-gene" className="section-container">
          <h2>Associated Genes</h2>
          {Genedata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={Genedata} />}
          
          {/* 新增 Interaction Summary 在這裡 */}
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px', color: '#333' }}>Interaction Summary</h3>
            <div style={{ textAlign: 'left', padding: '15px', lineHeight: '1.6' }}>
              {geneRaw.length > 0 ? geneRaw.map((item, idx) => (
                item.llm_narrative && (
                  <div key={idx} className="narrative-box" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '5px', border: '1px solid #ddd' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#666', marginBottom: '10px' }}>Associated Gene: {item.cargo_gene}</div>
                    {parseNarrative(item.llm_narrative).map((section, secIdx) => (
                      <div key={secIdx} style={{ marginBottom: section.label ? '15px' : '10px' }}>
                        {section.label && (
                          <div style={{ 
                            fontWeight: 'bold', 
                            fontSize: '13px', 
                            color: '#2c3e50',
                            marginBottom: '8px',
                            paddingBottom: '5px',
                            borderBottom: '1px solid #ddd'
                          }}>
                            {section.label}:
                          </div>
                        )}
                        <div style={{ 
                          whiteSpace: 'pre-wrap', 
                          fontSize: '14px',
                          lineHeight: '1.6',
                          color: '#444',
                          paddingLeft: section.label ? '10px' : '0'
                        }}>
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )) : <span className="text-muted">Narrative not available.</span>}
            </div>
          </div>
        </div>

        <div id="gene-protein" className="section-container">
          <h2>Associated Proteins</h2>
          {Proteindata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={Proteindata} />}
          
          {/* 新增 Interaction Summary 在這裡 */}
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px', color: '#333' }}>Interaction Summary</h3>
            <div style={{ textAlign: 'left', padding: '15px', lineHeight: '1.6' }}>
              {proteinRaw.length > 0 ? proteinRaw.map((item, idx) => (
                item.llm_narrative && (
                  <div key={idx} className="narrative-box" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '5px', border: '1px solid #ddd' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#666', marginBottom: '10px' }}>Associated Protein: {item.cargo_protein}</div>
                    {parseNarrative(item.llm_narrative).map((section, secIdx) => (
                      <div key={secIdx} style={{ marginBottom: section.label ? '15px' : '10px' }}>
                        {section.label && (
                          <div style={{ 
                            fontWeight: 'bold', 
                            fontSize: '13px', 
                            color: '#2c3e50',
                            marginBottom: '8px',
                            paddingBottom: '5px',
                            borderBottom: '1px solid #ddd'
                          }}>
                            {section.label}:
                          </div>
                        )}
                        <div style={{ 
                          whiteSpace: 'pre-wrap', 
                          fontSize: '14px',
                          lineHeight: '1.6',
                          color: '#444',
                          paddingLeft: section.label ? '10px' : '0'
                        }}>
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )) : <span className="text-muted">Narrative not available.</span>}
            </div>
          </div>
        </div>

        <div id="gene-RNA" className="section-container">
          <h2>Associated miRNAs</h2>
          {mRNAdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={mRNAdata} />}
          
          {/* 新增 Interaction Summary 在這裡 */}
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px', color: '#333' }}>Interaction Summary</h3>
            <div style={{ textAlign: 'left', padding: '15px', lineHeight: '1.6' }}>
              {rnaRaw.length > 0 ? rnaRaw.map((item, idx) => (
                item.llm_narrative && (
                  <div key={idx} className="narrative-box" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '5px', border: '1px solid #ddd' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#666', marginBottom: '10px' }}>Associated miRNA: {item.cargo_rna}</div>
                    {parseNarrative(item.llm_narrative).map((section, secIdx) => (
                      <div key={secIdx} style={{ marginBottom: section.label ? '15px' : '10px' }}>
                        {section.label && (
                          <div style={{ 
                            fontWeight: 'bold', 
                            fontSize: '13px', 
                            color: '#2c3e50',
                            marginBottom: '8px',
                            paddingBottom: '5px',
                            borderBottom: '1px solid #ddd'
                          }}>
                            {section.label}:
                          </div>
                        )}
                        <div style={{ 
                          whiteSpace: 'pre-wrap', 
                          fontSize: '14px',
                          lineHeight: '1.6',
                          color: '#444',
                          paddingLeft: section.label ? '10px' : '0'
                        }}>
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )) : <span className="text-muted">Narrative not available.</span>}
            </div>
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

export default LipidDetail;