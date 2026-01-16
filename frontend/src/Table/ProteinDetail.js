import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import 'mdbreact/dist/css/mdb.css';

const parseNarrative = (text) => {
  if (!text) return [];
  
  // 过滤引用标记的函数
  const removeSourceReferences = (str) => {
    if (!str) return '';
    
    let result = str;
    // 使用函数来匹配和移除 [Source: ...] 格式，包括嵌套的方括号
    // 匹配模式：[Source: 任意内容] 或 [Source: 任意内容, Ref[...]]
    // 策略：找到所有 [Source: 的位置，然后找到对应的结束 ]
    let index = 0;
    while (index < result.length) {
      const sourceIndex = result.indexOf('[Source:', index);
      if (sourceIndex === -1) break;
      
      // 从 [Source: 开始查找对应的结束 ]
      let bracketCount = 0;
      let endIndex = sourceIndex;
      let found = false;
      
      for (let i = sourceIndex; i < result.length; i++) {
        if (result[i] === '[') {
          bracketCount++;
        } else if (result[i] === ']') {
          bracketCount--;
          if (bracketCount === 0) {
            endIndex = i;
            found = true;
            break;
          }
        }
      }
      
      if (found) {
        // 移除这个引用标记
        result = result.substring(0, sourceIndex) + result.substring(endIndex + 1);
        index = sourceIndex; // 继续从当前位置查找
      } else {
        // 如果找不到匹配的 ]，跳过这个 [Source:
        index = sourceIndex + 8; // 跳过 '[Source:'
      }
    }
    
    // 清理多余的空格
    result = result.replace(/\s+/g, ' ').trim();
    return result;
  };
  
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
    const cleanedText = removeSourceReferences(text);
    return cleanedText ? [{ label: '', content: cleanedText }] : [];
  }
  
  positions.sort((a, b) => a.index - b.index);
  
  positions.forEach((pos, idx) => {
    const startIndex = pos.index + pos.pattern.key.length;
    const endIndex = idx < positions.length - 1 ? positions[idx + 1].index : text.length;
    let content = text.substring(startIndex, endIndex).trim();
    
    // 过滤引用标记
    content = removeSourceReferences(content);
    
    if (content) {
      sections.push({
        label: pos.pattern.label,
        content: content
      });
    }
  });
  
  return sections;
};

const parseMolecularNarrative = (text) => {
  if (!text) return [];
  
  // 过滤引用标记的函数
  const removeSourceReferences = (str) => {
    if (!str) return '';
    
    let result = str;
    // 使用函数来匹配和移除 [Source: ...] 格式，包括嵌套的方括号
    // 匹配模式：[Source: 任意内容] 或 [Source: 任意内容, Ref[...]]
    // 策略：找到所有 [Source: 的位置，然后找到对应的结束 ]
    let index = 0;
    while (index < result.length) {
      const sourceIndex = result.indexOf('[Source:', index);
      if (sourceIndex === -1) break;
      
      // 从 [Source: 开始查找对应的结束 ]
      let bracketCount = 0;
      let endIndex = sourceIndex;
      let found = false;
      
      for (let i = sourceIndex; i < result.length; i++) {
        if (result[i] === '[') {
          bracketCount++;
        } else if (result[i] === ']') {
          bracketCount--;
          if (bracketCount === 0) {
            endIndex = i;
            found = true;
            break;
          }
        }
      }
      
      if (found) {
        // 移除这个引用标记
        result = result.substring(0, sourceIndex) + result.substring(endIndex + 1);
        index = sourceIndex; // 继续从当前位置查找
      } else {
        // 如果找不到匹配的 ]，跳过这个 [Source:
        index = sourceIndex + 8; // 跳过 '[Source:'
      }
    }
    
    // 清理多余的空格
    result = result.replace(/\s+/g, ' ').trim();
    return result;
  };
  
  const sections = [];
  const patterns = [
    { label: 'General Role', key: 'General Role:' },
    { label: 'Exosomal Involvement', key: 'Exosomal Involvement:' },
    { label: 'Synergistic Interactions', key: 'Synergistic Interactions:' },
    { label: 'Clinical Potential', key: 'Clinical Potential:' }
  ];
  
  const positions = [];
  patterns.forEach(pattern => {
    const index = text.indexOf(pattern.key);
    if (index !== -1) {
      positions.push({ index, pattern });
    }
  });
  
  if (positions.length === 0) {
    const cleanedText = removeSourceReferences(text);
    return cleanedText ? [{ label: '', content: cleanedText }] : [];
  }
  
  positions.sort((a, b) => a.index - b.index);
  
  positions.forEach((pos, idx) => {
    const startIndex = pos.index + pos.pattern.key.length;
    const endIndex = idx < positions.length - 1 ? positions[idx + 1].index : text.length;
    let content = text.substring(startIndex, endIndex).trim();
    
    // 过滤引用标记
    content = removeSourceReferences(content);
    
    if (content) {
      sections.push({
        label: pos.pattern.label,
        content: content
      });
    }
  });
  
  return sections;
};

function ProteinDetail() {
  const { index } = useParams();
  const [data, setData] = useState(null);
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Lipiddata, setLipiddata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  const [rnaRaw, setRnaRaw] = useState([]); // 新增 state 儲存 rna 原始資料
  const [lipidRaw, setLipidRaw] = useState([]); // 新增 state 儲存 lipid 原始資料
  const [isRnaSummaryExpanded, setIsRnaSummaryExpanded] = useState(false);
  const [isLipidSummaryExpanded, setIsLipidSummaryExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const MAX_URLS = 20;

  useEffect(() => {
    setIsLoading(true);

    fetch(`http://172.16.146.196:8000/search/table/Protein/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        const dataBUrls = res.protein_rna_urls.slice(0, MAX_URLS).map(obj => obj.id_url);
        const dataCUrls = res.protein_ref_urls.map(obj => obj.id_url);
        const refUrls = res.ref_urls ? res.ref_urls.slice(0, MAX_URLS).map(obj => obj.id_url) : [];
        const dataDUrls = res.protein_lipid_urls.slice(0, MAX_URLS).map(obj => obj.id_url);

        const fetchAll = (urls) => Promise.all(urls.map(url => fetch(url).then(r => r.json())));

        const commonCols = [
          { label: 'Name', field: 'gene', width: 200 },
          { label: 'Tissue', field: 'tissue', width: 150 },
          { label: 'Score', field: 'score', width: 100 },
          { label: 'Cell Line', field: 'cellline', width: 150 },
          { label: 'PMCID', field: 'pmcid', width: 120 },
        ];

        // Fetch Associated miRNA
        fetchAll(dataBUrls).then(dataBs => {
          setRnaRaw(dataBs); // 儲存原始資料
          setmRNAdata({
            columns: commonCols,
            rows: dataBs.map(d => ({
              gene: <a href={`http://172.16.146.196:3000/rna/${d.rna_url}`} style={{ color: 'blue' }}>{d.cargo_rna}</a>,
              tissue: d.tissue,
              score: d.score_y,
              cellline: d.cellLine,
              pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a>
            }))
          });
        });

        // Fetch Associated Lipids
        fetchAll(dataDUrls).then(dataDs => {
          setLipidRaw(dataDs); // 儲存原始資料
          setLipiddata({
            columns: commonCols,
            rows: dataDs.map(d => ({
              gene: <a href={`http://172.16.146.196:3000/Lipid/${d.lipid_url}`} style={{ color: 'blue' }}>{d.cargo_lipid}</a>,
              tissue: d.tissue,
              score: d.score_x,
              cellline: d.cellLine,
              pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a>
            }))
          });
        });

        // Fetch References (修正 Author 取第一作者)
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
              author: d.author ? d.author.split(',')[0] : '', // 只顯示第一作者
              pmcid: d.pmcid ? <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a> : ''
            }))
          });
        }).finally(() => {
          setIsLoading(false);
        });
      })
      .catch(err => {
        console.error(err);
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
            <li><a href="#gene-RNA">Associated miRNA</a></li>
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
                <th colSpan="2" style={{ backgroundColor: '#f4f4f4', textAlign: 'center' }}>Protein Information</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ width: '25%' }}>Protein name</th>
                <td>{data.cargo}</td>
              </tr>
              <tr>
                <th>Entrez Gene</th>
                <td>{data.entrezID}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td style={{ textAlign: 'left', padding: '15px' }}>{data.description || 'No description available.'}</td>
              </tr>
            </tbody>
          </table>
          
          {/* Molecular Summary Section */}
          {data.molecular_narrative && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', color: '#333' }}>Molecular Summary</h3>
              <div style={{ textAlign: 'left', padding: '15px', lineHeight: '1.6', backgroundColor: '#fff', borderRadius: '5px', border: '1px solid #ddd' }}>
                {parseMolecularNarrative(data.molecular_narrative).map((section, secIdx) => (
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
            </div>
          )}
        </div>

        <div id="gene-RNA" className="section-container">
          <h2>Associated miRNA</h2>
          {mRNAdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={mRNAdata} />}
          
          {/* 新增 Interaction Summary 在這裡 */}
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                marginBottom: isRnaSummaryExpanded ? '15px' : '0'
              }}
              onClick={() => setIsRnaSummaryExpanded(!isRnaSummaryExpanded)}
            >
              <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Interaction Summary</h3>
              <span style={{ fontSize: '16px', color: '#666' }}>
                {isRnaSummaryExpanded ? '▼' : '▶'}
              </span>
            </div>
            {isRnaSummaryExpanded && (
              <div style={{ textAlign: 'left', padding: '15px', lineHeight: '1.6' }}>
                {(() => {
                  const narratives = rnaRaw.filter(item => item.llm_narrative);
                  if (narratives.length === 0) {
                    return <span className="text-muted">Narrative not available.</span>;
                  }
                  return narratives.map((item, idx) => (
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
                  ));
                })()}
              </div>
            )}
          </div>
        </div>

        <div id="gene-lipid" className="section-container">
          <h2>Associated Lipids</h2>
          {Lipiddata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={Lipiddata} />}
          
          {/* 新增 Interaction Summary 在這裡 */}
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                marginBottom: isLipidSummaryExpanded ? '15px' : '0'
              }}
              onClick={() => setIsLipidSummaryExpanded(!isLipidSummaryExpanded)}
            >
              <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Interaction Summary</h3>
              <span style={{ fontSize: '16px', color: '#666' }}>
                {isLipidSummaryExpanded ? '▼' : '▶'}
              </span>
            </div>
            {isLipidSummaryExpanded && (
              <div style={{ textAlign: 'left', padding: '15px', lineHeight: '1.6' }}>
                {(() => {
                  const narratives = lipidRaw.filter(item => item.llm_narrative);
                  if (narratives.length === 0) {
                    return <span className="text-muted">Narrative not available.</span>;
                  }
                  return narratives.map((item, idx) => (
                    <div key={idx} className="narrative-box" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '5px', border: '1px solid #ddd' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#666', marginBottom: '10px' }}>Associated Lipid: {item.cargo_lipid}</div>
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
                  ));
                })()}
              </div>
            )}
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

export default ProteinDetail;