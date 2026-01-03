import React, { useState, useEffect, useMemo } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom';

import 'mdbreact/dist/css/mdb.css';
import './page.css';

const LipidTable = () => {
  const [alphabet, setAlphabet] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [allData, setAllData] = useState([]);

  // 1. 兩階段抓取：先抓 50 筆讓頁面秒開，背景再同步完整資料
  useEffect(() => {
    const fetchLipidData = async () => {
      try {
        // 第一階段：極速讀取
        const quickRes = await fetch("http://db.cmdm.tw:8000/search/table/Lipid/?limit=500");
        const quickData = await quickRes.json();
        setAllData(quickData.results || []);
        setIsInitialLoading(false);

        // 第二階段：背景讀取全量資料
        const fullRes = await fetch("http://db.cmdm.tw:8000/search/table/Lipid/?limit=5000");
        const fullData = await fullRes.json();
        setAllData(fullData.results || []);
      } catch (error) {
        console.error('Error fetching lipid data:', error);
        setIsInitialLoading(false);
      }
    };

    fetchLipidData();
  }, []);

  // 2. 格式化與過濾邏輯
  const formattedData = useMemo(() => {
    const filtered = alphabet 
      ? allData.filter(item => item.cargo && item.cargo.toLowerCase().startsWith(alphabet.toLowerCase()))
      : allData;

    return {
      columns: [
        { label: "Name", field: "cargo", sort: "asc", width: 150 },
        { label: "Gene symbol", field: "entrezname", sort: "asc", width: 150 },
        { label: "Tissue", field: "tissue", sort: "asc", width: 150 },
        { label: "Cancer cell type", field: "cellType", sort: "asc", width: 150 },
        { label: "Specimen", field: "clinicalUse", sort: "asc", width: 150 },
        { label: "PMCID", field: "pmcid", sort: "asc", width: 150 },
      ],
      rows: filtered.map((item) => ({
        cargo: (
          <Link 
            to={`/lipid/${item.id}`} 
            style={{ color: '#2e3e93', fontWeight: 'bold', textDecoration: 'none' }}
            className="marker-link"
          >
            {item.cargo}
          </Link>
        ),
        entrezname: item.entrezName || '-',
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

  // 3. 渲染字母篩選按鈕
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
      <h1 className="associated">Associated potential lipids</h1>

      <div className="alphabet-container">
        {renderAlphabets()}
      </div>

      <div className="content-tabs" style={{ marginTop: '20px' }}>
        {isInitialLoading ? (
          <div className="loading-spinner text-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p style={{ marginTop: '10px' }}>Loading lipid markers...</p>
          </div>
        ) : (
          <div className="content active-content">
            <h2 className="table-title" style={{ marginLeft: '20px', marginBottom: '20px', color: '#2e3e93' }}>
               Lipid Results {alphabet && `(Filter: ${alphabet})`}
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

export default LipidTable;