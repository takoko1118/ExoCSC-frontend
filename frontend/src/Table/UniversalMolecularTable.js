import React, { useState, useEffect, useMemo } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link, useLocation } from 'react-router-dom';
import 'mdbreact/dist/css/mdb.css';
import './page.css';

const UniversalMolecularTable = ({ type, title, endpoint }) => {
  const [alphabet, setAlphabet] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [allData, setAllData] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const tissueFilter = queryParams.get('tissue');

        const baseApiUrl = `http://db.cmdm.tw:8000/search/table/${endpoint}/`;
        const filterQuery = tissueFilter ? `&tissue=${encodeURIComponent(tissueFilter)}` : '';

        // Step A: 快速抓取
        const quickRes = await fetch(`${baseApiUrl}?limit=50${filterQuery}`);
        const quickData = await quickRes.json();
        setAllData(quickData.results || []);
        setIsInitialLoading(false);

        // Step B: 背景抓取完整資料
        const fullRes = await fetch(`${baseApiUrl}?limit=10000${filterQuery}`);
        const fullData = await fullRes.json();
        setAllData(fullData.results || []);
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, [endpoint, type, location.search]);

  // 動態標題
  const dynamicTitle = useMemo(() => {
    const tissue = new URLSearchParams(location.search).get('tissue');
    return tissue ? `${title} (${tissue})` : title;
  }, [title, location.search]);

  // 格式化資料表
  const formattedData = useMemo(() => {
    const filtered = alphabet
      ? allData.filter(item => item.cargo && item.cargo.toLowerCase().startsWith(alphabet.toLowerCase()))
      : allData;

    return {
      columns: [
        
        { label: "Marker", field: "cargo", sort: "asc", width: 150 },
        { label: "Gene symbol", field: "entrezname", sort: "asc", width: 150 },
        { label: "Molecular Type", field: "molecularType", sort: "asc", width: 150 },
        { label: "Tissue", field: "tissue", sort: "asc", width: 150 },
        { label: "Cancer cell type", field: "cellType", sort: "asc", width: 150 },
        { label: "Specimen", field: "clinicalUse", sort: "asc", width: 150 },
        { label: "PMCID", field: "pmcid", sort: "asc", width: 150 },
      ],
      rows: filtered.map(item => ({
        molecularType: item.molecularType || "-",
        cargo: (
          <Link
            to={`/${type.toLowerCase()}/${item.id}`}
            style={{ color: '#2e3e93', fontWeight: 'bold', textDecoration: 'none' }}
          >
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
  }, [allData, alphabet, type]);

  // 字母篩選按鈕
  const renderAlphabets = () => {
    const btns = [];
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
      <h1 className="associated">{dynamicTitle}</h1>
      <div className="alphabet-container">{renderAlphabets()}</div>
      <div className="content-tabs" style={{ marginTop: '20px' }}>
        {isInitialLoading ? (
          <div className="loading-spinner text-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p style={{ marginTop: '10px' }}>Loading {type} data...</p>
          </div>
        ) : (
          <MDBDataTable
            striped
            bordered
            hover
            data={formattedData}
            entries={10}
            noBottomColumns={true}
            responsive
          />
        )}
      </div>
    </div>
  );
};

export default UniversalMolecularTable;
