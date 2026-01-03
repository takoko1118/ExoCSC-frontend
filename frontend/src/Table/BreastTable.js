import React, { useState, useEffect, useMemo } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom';

import 'mdbreact/dist/css/mdb.css';
import './page.css'; // 確保使用最新的 page.css

const BreastTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [toggleState, setToggleState] = useState(1); // 1: Cancer Cell, 2: CSC
  const [alphabet, setAlphabet] = useState('');
  const [rawData, setRawData] = useState([]);

  // 1. 從 API 獲取資料 (與 Lung 一致，獲取後在前端過濾 Tissue === 'Breast')
  useEffect(() => {
    setIsLoading(true);
    // 假設使用與 Lung 相同的 API 端點
    fetch('http://db.cmdm.tw:8000/search/table/ALL/?limit=10000')
      .then((res) => res.json())
      .then((data) => {
        const results = data.results || data;
        // 篩選出 Breast 的資料
        const breastData = results.filter(item => item.tissue === 'Breast');
        setRawData(breastData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });
  }, []);

  // 2. 格式化表格數據的函數 (包含跳轉連結與字母篩選)
  const formatTableData = (cellType) => {
    let filtered = rawData.filter(item => 
      item.cellType?.toLowerCase() === cellType.toLowerCase()
    );

    // 字母過濾
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
              className="marker-link"
              style={{ color: '#2e3e93', fontWeight: 'bold', textDecoration: 'none' }}
            >
              {item.cargo}
            </Link>
          ) : (
            <span style={{ color: '#999' }}>{item.cargo}</span>
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

  // 使用 useMemo 提高切換標籤時的效能
  const cancerCellData = useMemo(() => formatTableData('cancer'), [rawData, alphabet]);
  const cscData = useMemo(() => formatTableData('CSC'), [rawData, alphabet]);

  // 3. 渲染字母篩選按鈕 (橫向排列樣式)
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
    <div className="lung-container"> {/* 使用 lung-container 來獲得相同的 max-width 佈局 */}
      <h1 className="associated">Associated Breast Markers</h1>
      
      {/* Tab 分頁標籤 */}
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

      {/* 字母篩選器 */}
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
            {/* 條件渲染：根據標籤只顯示對應表格 */}
            {toggleState === 1 && (
              <div className="content active-content">
                <h2 className="table-title">
                  Breast Cancer Cell Markers {alphabet && `(Filter: ${alphabet})`}
                </h2>
                <MDBDataTable striped bordered hover data={cancerCellData} />
              </div>
            )}

            {toggleState === 2 && (
              <div className="content active-content">
                <h2 className="table-title">
                  Breast Cancer Stem Cell Markers {alphabet && `(Filter: ${alphabet})`}
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

export default BreastTable;