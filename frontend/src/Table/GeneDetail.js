import React, { useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import 'mdbreact/dist/css/mdb.css';
import CytoscapeComponent from 'react-cytoscapejs';
import Plotly from 'plotly.js-dist-min';

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

function GeneDetail() {
  const { index } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [geneRnaRaw, setGeneRnaRaw] = useState([]);
  const [geneLipidRaw, setGeneLipidRaw] = useState([]); // 新增 state 儲存 lipid 原始資料
  const [CSCdata, setCSCdata] = useState(null);
  const [CCdata, setCCdata] = useState(null);
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  const [Lipiddata, setLipiddata] = useState(null);
  const [GOdata, setGOdata] = useState(null);
  const [KEGGdata, setKEGGdata] = useState(null);
  const [GOEnrichContext, setGOEnrichContext] = useState(null);
  const [goEnrichmentRaw, setGoEnrichmentRaw] = useState({ csc: [], cancer: [] }); // 保存原始数据用于热图
  const [ppiElements, setPpiElements] = useState(null);
  const [isRnaSummaryExpanded, setIsRnaSummaryExpanded] = useState(false);
  const [isLipidSummaryExpanded, setIsLipidSummaryExpanded] = useState(false);

  const ppiStylesheet = [
    { selector: 'node', style: { 'label': 'data(label)', 'background-color': '#0275d8', 'width': 25, 'height': 25, 'font-size': '10px', 'color': '#333' } },
    { selector: 'node[type = "center"]', style: { 'background-color': '#d9534f', 'width': 40, 'height': 40, 'font-weight': 'bold', 'font-size': '12px' } },
    { selector: 'edge', style: { 'width': 1.5, 'line-color': '#ccc', 'curve-style': 'bezier', 'opacity': 0.7 } }
  ];

  // 处理URL查询参数中的entrez_id
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const entrezId = searchParams.get('entrez_id');
    
    // 如果有entrez_id查询参数，先查找对应的gene ID
    if (entrezId && !index) {
      fetch(`http://172.16.146.196:8000/api/gene-by-entrez/?entrez_id=${entrezId}`)
        .then(response => response.json())
        .then(result => {
          if (result.gene_id) {
            // 重定向到对应的gene ID页面
            history.replace(`/gene/${result.gene_id}`);
          } else {
            console.error('Gene not found for entrez_id:', entrezId);
          }
        })
        .catch(err => {
          console.error('Error fetching gene by entrez_id:', err);
        });
    }
  }, [location.search, history, index]);

  useEffect(() => {
    // 如果没有index（可能是通过entrez_id查询），不执行数据获取
    if (!index) return;
    fetch(`http://172.16.146.196:8000/search/table/Gene/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);
        if (res.entrezID) {
          const cleanID = Math.floor(parseFloat(res.entrezID));
          fetch(`http://172.16.146.196:8000/api/ppi/?entrez_id=${cleanID}`)
            .then(r => r.json())
            .then(ppiRes => { if (ppiRes && ppiRes.length > 0) setPpiElements(ppiRes); })
            .catch(err => console.error('Error PPI:', err));
        }

        const dataBUrls = res.gene_rna_urls.map((obj) => obj.id_url);
        // 不再使用 GeneRefTable，只使用 ref_urls（通过 pmcid 映射到 Ref 表）
        const refUrls = res.ref_urls ? res.ref_urls.slice(0, 20).map(obj => obj.id_url) : [];
        const dataDUrls = res.other_gene_ids.filter((obj) => obj.cellType === 'CSC').slice(0, 20).map((obj) => obj.url);
        const dataEUrls = res.other_gene_ids.filter((obj) => obj.cellType === 'cancer').slice(0, 20).map((obj) => obj.url);
        const dataFUrls = res.lipid_gene_urls.map((obj) => obj.id_url);
        const fetchAll = (urls) => Promise.all(urls.map(url => fetch(url).then(r => r.json())));

        const commonCols = [{ label: 'Name', field: 'gene', width: 200 }, { label: 'Tissue', field: 'tissue', width: 150 }, { label: 'Score', field: 'score', width: 100 }, { label: 'Cell Line', field: 'cellline', width: 150 }, { label: 'PMCID', field: 'pmcid', width: 120 }];

        fetchAll(dataBUrls).then(dataBs => {
          setGeneRnaRaw(dataBs);
          setmRNAdata({
            columns: commonCols,
            rows: dataBs.map(d => ({ gene: <a href={`http://172.16.146.196:3000/rna/${d.rna_url}`} style={{ color: 'blue' }}>{d.cargo_rna}</a>, tissue: d.tissue, score: d.score_y, cellline: d.cellLine, pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a> }))
          });
        });

        fetchAll(dataDUrls).then(ds => setCSCdata({ columns: commonCols, rows: ds.map(d => ({ gene: <a href={`http://172.16.146.196:3000/gene/${d.id}`} style={{ color: 'blue' }}>{d.cargo}</a>, tissue: d.tissue, score: d.score, cellline: d.cellLine, pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a> })) }));
        fetchAll(dataEUrls).then(es => setCCdata({ columns: commonCols, rows: es.map(d => ({ gene: <a href={`http://172.16.146.196:3000/gene/${d.id}`} style={{ color: 'blue' }}>{d.cargo}</a>, tissue: d.tissue, score: d.score, cellline: d.cellLine, pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a> })) }));
        fetchAll(dataFUrls).then(fs => {
          setGeneLipidRaw(fs); // 儲存原始資料
          setLipiddata({ columns: commonCols, rows: fs.map(d => ({ gene: <a href={`http://172.16.146.196:3000/lipid/${d.lipid_url}`} style={{ color: 'blue' }}>{d.cargo_lipid}</a>, tissue: d.tissue, score: d.score_y, cellline: d.cellLine, pmcid: <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a> })) });
        });
        
        // 只使用 refUrls（通过 pmcid 映射到 Ref 表），不再使用 GeneRefTable
        if (refUrls.length > 0) {
          fetchAll(refUrls).then(cs => setRefdata({ columns: [{ label: 'Title', field: 'title', width: 250 }, { label: 'Journal', field: 'journal', width: 150 }, { label: 'Year', field: 'year', width: 80 }, { label: 'Author', field: 'author', width: 120 }, { label: 'PMCID', field: 'pmcid', width: 120 }], rows: cs.map(d => ({ title: d.title || '', journal: d.journal || '', year: d.year || '', author: d.author ? d.author.split(',')[0] : '', pmcid: d.pmcid ? <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${d.pmcid}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{d.pmcid}</a> : '' })) }));
        } else {
          // 如果没有 ref_urls，设置为空数据
          setRefdata({ columns: [{ label: 'Title', field: 'title', width: 250 }, { label: 'Journal', field: 'journal', width: 150 }, { label: 'Year', field: 'year', width: 80 }, { label: 'Author', field: 'author', width: 120 }, { label: 'PMCID', field: 'pmcid', width: 120 }], rows: [] });
        }
        fetch(`http://172.16.146.196:8000/gene/${parseInt(res.entrezID)}/go/`).then(r => r.json()).then(go => setGOdata({ columns: [{ label: 'GO ID', field: 'go_id', width: 150 }, { label: 'GO Name', field: 'go_name', width: 350 }, { label: 'Domain', field: 'domain', width: 100 }], rows: go.map(g => ({ go_id: g.go_id, go_name: g.go_name, domain: g.domain })) }));

        fetch(`http://172.16.146.196:8000/search/table/GeneKegg/${index}/`).then(r => r.json()).then(kegg => {
          const fmt = (list, cls) => ({ columns: [{ label: 'Pathway ID', field: 'id', width: 120 }, { label: 'Pathway Name', field: 'name', width: 300 }, { label: 'P-value', field: 'p', width: 120 }, { label: 'Score', field: 's', width: 100 }], rows: (list || []).map(k => ({ id: <a href={`https://www.kegg.jp/pathway/${k.pathway_id}`} target="_blank" rel="noreferrer" style={{color: 'blue'}}>{k.pathway_id}</a>, name: k.pathway_name, p: k.p_value ? k.p_value.toExponential(4) : '-', s: <span className={`badge ${cls}`} style={{padding: '5px 10px'}}>{parseFloat(k.score).toFixed(2)}</span> })) });
          setKEGGdata({ csc: fmt(kegg.csc_pathways, 'badge-danger'), cancer: fmt(kegg.cancer_pathways, 'badge-primary') });
        });

        if (res.entrezID) {
          fetch(`http://172.16.146.196:8000/api/gene-detail/?entrez_id=${Math.floor(parseFloat(res.entrezID))}`).then(r => r.json()).then(enr => {
            // 保存原始数据用于热图
            setGoEnrichmentRaw({
              csc: enr.csc_context || [],
              cancer: enr.cancer_context || []
            });
            
            // 格式化数据用于表格
            const fmt = (list, cls) => ({ columns: [{ label: 'Term', field: 't', width: 300 }, { label: 'Score', field: 's', width: 100 }, { label: 'FDR', field: 'f', width: 120 }], rows: (list || []).map(c => ({ t: c.Term, s: <span className={`badge ${cls}`} style={{padding: '5px 10px'}}>{c.Score.toFixed(2)}</span>, f: c.Adjusted_P.toExponential(2) })) });
            setGOEnrichContext({ csc: fmt(enr.csc_context, 'badge-danger'), cancer: fmt(enr.cancer_context, 'badge-primary') });
          });
        }
      });
  }, [index]);

  // 准备热图数据的函数
  const prepareHeatmapData = (rawCscData, rawCancerData, topN = 15) => {
    const allTermsMap = new Map();
    
    // 处理 CSC 数据
    (rawCscData || []).forEach(item => {
      allTermsMap.set(item.Term, {
        term: item.Term,
        csc_score: item.Score,
        cancer_score: null
      });
    });
    
    // 处理 Cancer 数据
    (rawCancerData || []).forEach(item => {
      if (allTermsMap.has(item.Term)) {
        allTermsMap.get(item.Term).cancer_score = item.Score;
      } else {
        allTermsMap.set(item.Term, {
          term: item.Term,
          csc_score: null,
          cancer_score: item.Score
        });
      }
    });
    
    // 转换为数组并排序
    const allTerms = Array.from(allTermsMap.values())
      .sort((a, b) => {
        const maxA = Math.max(a.csc_score || 0, a.cancer_score || 0);
        const maxB = Math.max(b.csc_score || 0, b.cancer_score || 0);
        return maxB - maxA;
      })
      .slice(0, topN);
    
    const z = [
      allTerms.map(t => t.csc_score || 0),
      allTerms.map(t => t.cancer_score || 0)
    ];
    
    const y = ['CSC Specific', 'Cancer General'];
    const x = allTerms.map(t => {
      const termName = t.term.split('(')[0].trim();
      return termName.length > 60 ? termName.substring(0, 57) + '...' : termName;
    });
    
    return { z, x, y };
  };

  // 渲染热图的 useEffect
  useEffect(() => {
    if (goEnrichmentRaw.csc.length > 0 || goEnrichmentRaw.cancer.length > 0) {
      const heatmapData = prepareHeatmapData(goEnrichmentRaw.csc, goEnrichmentRaw.cancer, 15);
      
      const data = [{
        z: heatmapData.z,
        x: heatmapData.x,
        y: heatmapData.y,
        type: 'heatmap',
        colorscale: [
          [0, '#ffffff'],
          [0.25, '#d1ecf1'],
          [0.5, '#bee5eb'],
          [0.75, '#0dcaf0'],
          [1, '#0aa2c0']
        ],
        showscale: true,
        colorbar: {
          title: {
            text: 'Score',
            side: 'right',
            font: { size: 14 }
          },
          thickness: 20,
          xref: 'paper',     // 添加这个，使用独立坐标系
          yref: 'paper',    // 添加这个
          x: 0.0,          // 从 1.1 减小到 1.02，向左移动
          xanchor: 'left',
          xpad: 2,          // 从 3 减小到 2
          y: 1.5,           // 从 1.5 改为 0.5（paper 坐标系使用 0-1）
          yanchor: 'middle',
          len: 1.0,         // 从 1.0 改为 0.4（使用比例）
          lenmode: 'fraction',  // 启用比例模式
          tickfont: { size: 8 },
          ticklen: 8,
          ticklabelposition: 'outside'
        }
      }];
      
      const layout = {
        title: {
          text: 'GO Enrichment Heatmap (Top 15 Terms)',
          font: { size: 16 }
        },
        xaxis: {
          title: 'GO Terms',
          tickangle: -45,
          tickfont: { size: 9 }
        },
        yaxis: {
          title: 'Category',
          tickfont: { size: 12 }  // 可以增加 y 轴标签字体大小
        },
        width: 1200,
        height: 350,// 从 300 增加到 500（或更大），单元格会变高
        margin: { l: 150, r: 200, t: 80, b: 200 }

      };
      
      const config = {
        responsive: true,
        displayModeBar: true
      };
      
      Plotly.newPlot('go-enrichment-heatmap', data, layout, config);
    }
    
    // 清理函数
    return () => {
      const plotDiv = document.getElementById('go-enrichment-heatmap');
      if (plotDiv) {
        Plotly.purge(plotDiv);
      }
    };
  }, [goEnrichmentRaw]);

  if (!data) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className='detail-page'>
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
              <tr><th>Entrez Gene</th><td>{data.entrezID ? Math.floor(parseFloat(data.entrezID)) : ''}</td></tr>
              
            </tbody>
          </table>
          
          {/* Molecular Narrative Section */}
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

        <div id="geneCC" className="section-container">
          <h2>Associated genes in Cancer cell exosome</h2>
          {CCdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={CCdata} />}
        </div>

        <div id="geneCSC" className="section-container">
          <h2>Associated genes in Cancer Stem cell exosome</h2>
          {CSCdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={CSCdata} />}
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
                  const narratives = geneRnaRaw.filter(item => item.llm_narrative);
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
                  const narratives = geneLipidRaw.filter(item => item.llm_narrative);
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

        <div id="go-annotation" className="section-container">
          <h2>GO Annotation</h2>
          {GOdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={GOdata} />}
        </div>

        <div id="go-enrichment" className="section-container" style={{ padding: '20px', backgroundColor: '#fcfcfc', border: '1px solid #eee', borderRadius: '10px' }}>
          <h2>GO Enrichment</h2>
          
          {/* 添加热图 */}
          {(goEnrichmentRaw.csc.length > 0 || goEnrichmentRaw.cancer.length > 0) && (
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <h4 style={{ marginBottom: '15px', fontSize: '16px', color: '#333' }}>Heatmap (Top 15 GO Terms)</h4>
              <div id="go-enrichment-heatmap" style={{ width: '100%', minHeight: '300px' }}></div>
            </div>
          )}
          
          <div className="row">
            <div className="col-md-6">
              <h4 style={{ color: '#d9534f' }}>CSC Specific</h4>
              {GOEnrichContext && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={GOEnrichContext.csc} />}
            </div>
            <div className="col-md-6">
              <h4 style={{ color: '#0275d8' }}>Cancer General</h4>
              {GOEnrichContext && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={GOEnrichContext.cancer} />}
            </div>
          </div>
        </div>

        <div id="kegg-annotation" className="section-container" style={{ padding: '20px', backgroundColor: '#f4f7f6', border: '1px solid #eee', borderRadius: '10px' }}>
          <h2>KEGG Enrichment</h2>
          <div className="row">
            <div className="col-md-6">
              <h4 style={{ color: '#d9534f' }}>CSC Specific</h4>
              {KEGGdata && <MDBDataTable striped responsive small noBottomColumns searching={false} paging={false} data={KEGGdata.csc} />}
            </div>
            <div className="col-md-6">
              <h4 style={{ color: '#0275d8' }}>Cancer General</h4>
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