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

  // 調試：確認組件渲染
  console.log(`[${type}] Component rendered with endpoint: ${endpoint}, pathname: ${location.pathname}`);

  useEffect(() => {
    console.log(`[${type}] useEffect triggered, endpoint: ${endpoint}, search: ${location.search}`);
    let isMounted = true;
    let loadingCleared = false;
    
    // 最終安全機制：無論如何，8秒後必須停止loading
    const finalTimeout = setTimeout(() => {
      if (isMounted && !loadingCleared) {
        console.warn(`[${type}] Force clearing loading state after 8 seconds`);
        setIsInitialLoading(false);
        loadingCleared = true;
      }
    }, 8000);
    
    const fetchData = async () => {
      console.log(`[${type}] Starting fetch for endpoint: ${endpoint}`);
      
      try {
        const queryParams = new URLSearchParams(location.search);
        const tissueFilter = queryParams.get('tissue');

        const baseApiUrl = `http://172.16.146.196:8000/search/table/${endpoint}/`;
        const filterQuery = tissueFilter ? `&tissue=${encodeURIComponent(tissueFilter)}` : '';

        // Step A: 快速抓取（縮短超時時間到5秒）
        let quickDataLoaded = false;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(`[${type}] Quick fetch timeout after 5 seconds`);
          controller.abort();
        }, 5000);

        try {
          console.log(`[${type}] Fetching quick data from: ${baseApiUrl}?limit=50${filterQuery}`);
          const quickRes = await fetch(`${baseApiUrl}?limit=50${filterQuery}`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (!quickRes.ok) {
            throw new Error(`HTTP error! status: ${quickRes.status}`);
          }
          const quickData = await quickRes.json();
          console.log(`[${type}] Quick data received, count: ${quickData.results?.length || 0}`);
          
          if (isMounted) {
            setAllData(quickData.results || []);
            setIsInitialLoading(false);
            loadingCleared = true;
            clearTimeout(finalTimeout);
            quickDataLoaded = true;
          }
        } catch (quickError) {
          clearTimeout(timeoutId);
          if (quickError.name === 'AbortError') {
            console.error(`[${type}] Quick fetch timeout`);
          } else {
            console.error(`[${type}] Error in quick fetch:`, quickError);
          }
          // 即使快速抓取失敗，也要停止loading
          if (isMounted && !loadingCleared) {
            setIsInitialLoading(false);
            loadingCleared = true;
            clearTimeout(finalTimeout);
          }
        }

        // Step B: 背景抓取完整資料（使用更大的limit以確保獲取所有數據）
        if (isMounted) {
          try {
            console.log(`[${type}] Fetching full data from: ${baseApiUrl}?limit=20000${filterQuery}`);
            const fullRes = await fetch(`${baseApiUrl}?limit=20000${filterQuery}`);
            if (fullRes.ok) {
              const fullData = await fullRes.json();
              console.log(`[${type}] Full data received, count: ${fullData.results?.length || 0}`);
              if (isMounted) {
                setAllData(fullData.results || []);
              }
            } else if (!quickDataLoaded) {
              console.error(`[${type}] Full fetch failed with status: ${fullRes.status}`);
            }
          } catch (fullError) {
            console.error(`[${type}] Error in full fetch:`, fullError);
            // 如果快速抓取失敗且完整抓取也失敗，確保有數據顯示
            if (!quickDataLoaded && isMounted) {
              setAllData([]);
            }
          }
        }
      } catch (error) {
        console.error(`[${type}] Error fetching data:`, error);
        if (isMounted && !loadingCleared) {
          setIsInitialLoading(false);
          loadingCleared = true;
          clearTimeout(finalTimeout);
        }
      }
    };

    fetchData();
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(finalTimeout);
    };
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
