import React, { useState, useEffect, useMemo } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom';

import 'mdbreact/dist/css/mdb.css';
import './page.css';

const RNATable = () => {
  const [alphabet, setAlphabet] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [allData, setAllData] = useState([]);

  // 1. 混合式抓取邏輯：先抓 50 筆秒開，背景再抓全部 (10000 筆以內)
  useEffect(() => {
    const fetchRNAData = async () => {
      try {
        // Step A: 快速抓取前 50 筆，讓使用者不需要等待
        const quickRes = await fetch('http://db.cmdm.tw:8000/search/table/RNA/?limit=500');
        const quickData = await quickRes.json();
        setAllData(quickData.results || []);
        setIsInitialLoading(false);

        // Step B: 背景安靜抓取完整 RNA 數據
        const fullRes = await fetch('http://db.cmdm.tw:8000/search/table/RNA/?limit=10000');
        const fullData = await fullRes.json();
        setAllData(fullData.results || []);
      } catch (error) {
        console.error('Error fetching RNA data:', error);
        setIsInitialLoading(false);
      }
    };

    fetchRNAData();
  }, []);

  // 2. 前端即時過濾與格式化
  const formattedData = useMemo(() => {
    // 點擊字母時，直接在記憶體中過濾，反應速度最快
    const filtered = alphabet 
      ? allData.filter(item => item.cargo && item.cargo.toLowerCase().startsWith(alphabet.toLowerCase()))
      : allData;

    return {
      columns: [
        { label: 'RNA', field: 'cargo', sort: 'asc', width: 150 },
        { label: 'Tissue', field: 'tissue', sort: 'asc', width: 150 },
        { label: 'Cancer cell type', field: 'cellType', sort: 'asc', width: 150 },
        { label: 'Specimen', field: 'clinicalUse', sort: 'asc', width: 150 },
        { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
      ],
      rows: filtered.map((item) => ({
        cargo: (
          <Link 
            to={`/rna/${item.id}`} 
            style={{ color: '#2e3e93', fontWeight: 'bold', textDecoration: 'none' }}
            className="marker-link"
          >
            {item.cargo}
          </Link>
        ),
        tissue: item.tissue || '-',
        cellType: item.cellType || '-',
        clinicalUse: item.clinicalUse || '-',
        pmcid: item.pmcid ? (
          <a 
            href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${item.pmcid}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: 'green' }}
          >
            {item.pmcid}
          </a>
        ) : '-',
      })),
    };
  }, [allData, alphabet]);

  // 3. 渲染字母篩選按鈕 (同步 Lung/Breast 現代樣式)
  const renderAlphabets = () => {
    let btns = [];
    for (let i = 65; i <= 90; i++) {
      const char = String.fromCharCode(i);
      btns.push(
        <button
          key={char}
          className={alphabet === char ? 'alphabet-btn active' : 'alphabet-btn'}
          onClick={() => setAlphabet(alphabet === char ? '' : char)}
        >
          {char}
        </button>
      );
    }
    return btns;
  };

  return (
    <div className="lung-container">
      <h1 className="associated">Associated potential miRNAs</h1>

      {/* 字母篩選器容器 */}
      <div className="alphabet-container">
        {renderAlphabets()}
      </div>

      <div className="content-tabs" style={{ marginTop: '20px' }}>
        {isInitialLoading ? (
          <div className="loading-spinner text-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p style={{ marginTop: '10px' }}>Loading RNA data...</p>
          </div>
        ) : (
          <div className="content active-content">
            <h2 className="table-title" style={{ marginLeft: '20px', marginBottom: '20px', color: '#2e3e93' }}>
               RNA Results {alphabet && `(Filter: ${alphabet})`}
            </h2>
            <MDBDataTable 
              striped 
              bordered 
              hover 
              data={formattedData} 
              entries={10}
              noBottomColumns={true}
              responsive
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RNATable;