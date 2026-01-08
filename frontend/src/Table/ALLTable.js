import React, { useState, useEffect, useMemo } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom';
import 'mdbreact/dist/css/mdb.css';
import './page.css';

function ALLTable() {
  const [alphabet, setAlphabet] = useState('');
  const [rawData, setRawData] = useState([]); // 存儲原始 API 資料
  const [isLoading, setIsLoading] = useState(true);

  // 1. 取得 API 資料 (只在組件掛載時執行一次)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://db.cmdm.tw:8000/ALL/");
        const res = await response.json();
        setRawData(res.results || []);
      } catch (error) {
        console.error("Error fetching ALL data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. 字母篩選處理邏輯
  const onAlphabetClick = (char) => {
    setAlphabet(prev => (prev === char ? '' : char)); // 點擊同一個字母則取消篩選
  };

  // 3. 渲染字母按鈕
  const renderAlphabets = () => {
    let btns = [];
    for (let i = 65; i <= 90; i++) {
      const char = String.fromCharCode(i);
      btns.push(
        <button
          key={char}
          className={alphabet === char ? 'alphabet-btn active' : 'alphabet-btn'}
          style={{
            fontSize: '14px',
            fontWeight: 600,
            width: '30px',
            height: '30px',
            textAlign: 'center',
            margin: '2px',
            cursor: 'pointer',
            border: '1px solid #ddd',
            backgroundColor: alphabet === char ? '#2e3e93' : '#fff',
            color: alphabet === char ? '#fff' : 'blue',
          }}
          onClick={() => onAlphabetClick(char)}
        >
          {char}
        </button>
      );
    }
    return btns;
  };

  // 4. 使用 useMemo 格式化表格資料 (效能優化關鍵)
  const formattedData = useMemo(() => {
    // 過濾資料
    const filteredRows = alphabet
      ? rawData.filter(el => el.cargo && el.cargo.toLowerCase().startsWith(alphabet.toLowerCase()))
      : rawData;

    return {
      columns: [
        { label: "Gene", field: "cargo", sort: "asc", width: 150 },
        { label: "Gene symbol", field: "entrezname", sort: "asc", width: 150 },
        { label: "Tissue", field: "tissue", sort: "asc", width: 150 },
        { label: "Cancer cell type", field: "cellType", sort: "asc", width: 150 },
        { label: "Specimen", field: "clinicalUse", sort: "asc", width: 150 },
        { label: "PMCID", field: "pmcid", sort: "asc", width: 150 },
      ],
      rows: filteredRows.map((item) => ({
        cargo: (
          <Link to={`/all/${item.id}`} style={{ fontWeight: 'bold', color: '#2e3e93' }}>
            {item.cargo}
          </Link>
        ),
        entrezname: item.entrezName || "-",
        tissue: item.tissue || "-",
        cellType: item.cellType || "-",
        clinicalUse: item.clinicalUse || "-",
        pmcid: item.pmcid ? (
          <a
            href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${item.pmcid}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'green' }}
          >
            {item.pmcid}
          </a>
        ) : "-",
      })),
    };
  }, [rawData, alphabet]);

  return (
    <div className="lung-container">
      <p className="associated">Markers</p>
      
      {/* 字母按鈕容器 */}
      <div className="alphabet-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
        {renderAlphabets()}
      </div>

      <div className="content-tabs">
        {isLoading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading markers data...</p>
          </div>
        ) : (
          <MDBDataTable
            striped
            bordered
            hover
            data={formattedData}
            noBottomColumns={true}
            responsive
          />
        )}
      </div>
    </div>
  );
}

export default ALLTable;