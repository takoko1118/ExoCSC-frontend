import React, { useState, useEffect, useMemo } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom';

import 'mdbreact/dist/css/mdb.css';
import './page.css';

const ColonTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [toggleState, setToggleState] = useState(1); // 1: Cancer Cell, 2: CSC
  const [alphabet, setAlphabet] = useState('');
  const [rawData, setRawData] = useState([]);

  // 1. 從 API 獲取 Colon 相關資料
  useEffect(() => {
    setIsLoading(true);
    fetch('http://db.cmdm.tw:8000/search/table/Cancer/')
      .then((res) => res.json())
      .then((data) => {
        const results = data.results || data;
        // 篩選出 Colon 的資料
        const colonData = results.filter(item => item.tissue === 'Colon');
        setRawData(colonData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });
  }, []);

  // 2. 格式化表格數據的邏輯 (包含字母過濾與 Link 跳轉)
  const formatTableData = (cellType) => {
    let filtered = rawData.filter(item => {
        const typeMatch = cellType === 'cancer' 
            ? item.cellType?.toLowerCase() === 'cancer' 
            : item.cellType?.toLowerCase() === 'csc';
        return typeMatch;
    });

    // 字母篩選邏輯
    if (alphabet) {
      filtered = filtered.filter(item => 
        item.cargo && item.cargo.toUpperCase().startsWith(alphabet.toUpperCase())
      );
    }

    return {
      columns: [
        { label: 'Name', field: 'name', sort: 'asc', width: 200 },
        { label: 'Tissue', field: 'tissue', sort: 'asc', width: 150 },
        { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
      ],
      rows: filtered.map(item => ({
        name: (
          <Link 
            to={`/${item.molecularType?.toLowerCase() || 'gene'}/${item.id}`} 
            style={{ color: '#2e3e93', fontWeight: 'bold', textDecoration: 'none' }}
          >
            {item.cargo}
          </Link>
        ),
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
      }))
    };
  };

  // 使用 useMemo 優化效能
  const cancerCellData = useMemo(() => formatTableData('cancer'), [rawData, alphabet]);
  const cscData = useMemo(() => formatTableData('csc'), [rawData, alphabet]);

  // 3. 渲染字母按鈕 (無 Clear 按鈕，再次點擊即可取消)
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
    <div className="lung-container"> {/* 使用統一的佈局容器 */}
      <h1 className="associated">Associated Colon Markers</h1>
      
      {/* Tab 標籤切換 */}
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

      {/* 字母篩選器區域 */}
      <div className="alphabet-container">
        {renderAlphabets()}
      </div>

      <div className="content-tabs">
        {isLoading ? (
          <div className="loading-spinner">
            <p>Loading Colon molecular data...</p>
          </div>
        ) : (
          <>
            {/* 根據選中的標籤顯示對應內容 */}
            {toggleState === 1 && (
              <div className="content active-content">
                <h2 className="table-title">Colon Cancer Cell Markers {alphabet && `(${alphabet})`}</h2>
                <MDBDataTable striped bordered hover data={cancerCellData} />
              </div>
            )}

            {toggleState === 2 && (
              <div className="content active-content">
                <h2 className="table-title">Colon Cancer Stem Cell Markers {alphabet && `(${alphabet})`}</h2>
                <MDBDataTable striped bordered hover data={cscData} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ColonTable;