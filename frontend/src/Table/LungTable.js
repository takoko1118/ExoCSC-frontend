import React, { useState, useEffect, useMemo } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom';

import 'mdbreact/dist/css/mdb.css';
import './page.css';

const LungTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [toggleState, setToggleState] = useState(1); // 1: Cancer Cell, 2: CSC
  const [alphabet, setAlphabet] = useState('');
  const [rawData, setRawData] = useState([]);

  // 1. 從 API 獲取資料
  useEffect(() => {
    setIsLoading(true);
    fetch('http://db.cmdm.tw:8000/search/table/ALL/?limit=10000')
      .then((res) => res.json())
      .then((data) => {
        const results = data.results || data;
        // 篩選出 Lung 的資料
        const lungData = results.filter(item => item.tissue === 'Lung');
        setRawData(lungData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });
  }, []);

  // 2. 格式化表格數據的函數
  const formatTableData = (cellType) => {
    let filtered = rawData.filter(item => 
      item.cellType?.toLowerCase() === cellType.toLowerCase()
    );

    // 字母過濾邏輯
    if (alphabet) {
      filtered = filtered.filter(item => 
        item.cargo && item.cargo.toUpperCase().startsWith(alphabet.toUpperCase())
      );
    }

    return {
      columns: [
        { label: 'Name', field: 'name', sort: 'asc', width: 200 },
        { label: 'Type', field: 'type', sort: 'asc', width: 100 },
        { label: 'Tissue', field: 'tissue', sort: 'asc', width: 150 },
        { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
      ],
      rows: filtered.map(item => {
        const targetId = item.original_id || item.originalID;
        const typePath = item.molecularType ? item.molecularType.toLowerCase() : 'gene';
        
        return {
          name: targetId ? (
            <Link 
              to={`/${typePath}/${targetId}`} 
              style={{ color: '#2e3e93', fontWeight: 'bold', textDecoration: 'none' }}
              className="marker-link"
            >
              {item.cargo}
            </Link>
          ) : (
            <span style={{ color: '#999', cursor: 'default' }}>{item.cargo}</span>
          ),
          type: (item.molecularType || '').toUpperCase(),
          tissue: item.tissue,
          pmcid: (
            <a 
              href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${item.pmcid}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'green' }}
            >
              {item.pmcid}
            </a>
          )
        };
      })
    };
  };

  // 使用 useMemo 優化效能
  const cancerCellData = useMemo(() => formatTableData('cancer'), [rawData, alphabet]);
  const cscData = useMemo(() => formatTableData('CSC'), [rawData, alphabet]);

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
      <h1 className="associated">Associated Lung Markers</h1>
      
      {/* Tab 切換標籤 */}
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'}
          onClick={() => setToggleState(1)}
        >
          Cancer Cell
        </button>
        <button
          className={toggleState === 2 ? 'tabs active-tabs' : 'tabs'}
          onClick={() => setToggleState(2)}
        >
          Cancer Stem Cell
        </button>
      </div>

      {/* 字母篩選器容器 (CSS 中已設定 flex 排列) */}
      <div className="alphabet-container">
        {renderAlphabets()}
        <button className="btn-clear-filter" onClick={() => setAlphabet('')}>
          Clear
        </button>
      </div>

      <div className="content-tabs">
        {isLoading ? (
          <div className="loading-spinner text-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading molecular data...</p>
          </div>
        ) : (
          <>
            {/* 根據 toggleState 條件渲染：同一時間只顯示一個表格 */}
            {toggleState === 1 && (
              <div className="content active-content">
                <h2 className="table-title" style={{ marginLeft: '120px', marginTop: '20px', color: '#2e3e93' }}>
                  Lung Cancer Cell Markers {alphabet && `(Filter: ${alphabet})`}
                </h2>
                <MDBDataTable striped bordered hover data={cancerCellData} />
              </div>
            )}

            {toggleState === 2 && (
              <div className="content active-content">
                <h2 className="table-title" style={{ marginLeft: '120px', marginTop: '20px', color: '#2e3e93' }}>
                  Lung Cancer Stem Cell Markers {alphabet && `(Filter: ${alphabet})`}
                </h2>
                <MDBDataTable striped bordered hover data={cscData} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LungTable;