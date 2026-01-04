import React, { useState, useEffect, useMemo } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link, useLocation } from 'react-router-dom'; // 1. 引入 useLocation
import 'mdbreact/dist/css/mdb.css';
import './page.css';

const UniversalMolecularTable = ({ type, title, endpoint }) => {
  const [alphabet, setAlphabet] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [allData, setAllData] = useState([]);
  
  // 2. 取得目前網址的狀態
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 3. 解析 URL 中的 tissue 參數
        const queryParams = new URLSearchParams(location.search);
        const tissueFilter = queryParams.get('tissue');
        
        // 4. 根據是否有 tissue 參數來動態構建 API URL
        // 這裡對應你 views.py 裡的 get_queryset 邏輯
        const baseApiUrl = `http://db.cmdm.tw:8000/search/table/${endpoint}/`;
        const filterQuery = tissueFilter ? `&tissue=${encodeURIComponent(tissueFilter)}` : '';

        // Step A: 快速抓取
        const quickRes = await fetch(`${baseApiUrl}?limit=50${filterQuery}`);
        const quickData = await quickRes.json();
        setAllData(quickData.results || []);
        setIsInitialLoading(false);

        // Step B: 背景抓取
        const fullRes = await fetch(`${baseApiUrl}?limit=10000${filterQuery}`);
        const fullData = await fullRes.json();
        setAllData(fullData.results || []);
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, [endpoint, type, location.search]); // 5. 當網址參數改變時(例如從 Chatbot 再次跳轉)，觸發重新抓取

  // 6. 動態標題邏輯：如果是在篩選狀態，顯示 Tissue 名稱
  const dynamicTitle = useMemo(() => {
    const tissue = new URLSearchParams(location.search).get('tissue');
    return tissue ? `${title} (${tissue})` : title;
  }, [title, location.search]);

  // (以下 formattedData, renderAlphabets, return 邏輯保持不變，只需修改標題顯示)
  
  const formattedData = useMemo(() => {
    const filtered = alphabet 
      ? allData.filter(item => item.cargo && item.cargo.toLowerCase().startsWith(alphabet.toLowerCase()))
      : allData;

    return {
      columns: [
        { label: type === 'RNA' ? 'RNA' : 'Name', field: 'cargo', sort: 'asc', width: 150 },
        ...(type === 'Gene' || type === 'Protein' || type === 'Lipid' ? [{ label: 'Gene symbol', field: 'entrezname', sort: 'asc', width: 150 }] : []),
        { label: 'Tissue', field: 'tissue', sort: 'asc', width: 150 },
        { label: 'Cancer cell type', field: 'cellType', sort: 'asc', width: 150 },
        { label: 'Specimen', field: 'clinicalUse', sort: 'asc', width: 150 },
        { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
      ],
      rows: filtered.map((item) => ({
        cargo: (
          <Link to={`/${type.toLowerCase()}/${item.id}`} style={{ color: '#2e3e93', fontWeight: 'bold', textDecoration: 'none' }} className="marker-link">
            {item.cargo}
          </Link>
        ),
        entrezname: item.entrezName || '-',
        tissue: item.tissue || '-',
        cellType: item.cellType || '-',
        clinicalUse: item.clinicalUse || '-',
        pmcid: item.pmcid ? (
          <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${item.pmcid}`} target="_blank" rel="noopener noreferrer" style={{ color: 'green' }}>{item.pmcid}</a>
        ) : '-',
      })),
    };
  }, [allData, alphabet, type]);

  const renderAlphabets = () => {
    let btns = [];
    for (let i = 65; i <= 90; i++) {
      const char = String.fromCharCode(i);
      btns.push(
        <button key={char} className={alphabet === char ? 'alphabet-btn active' : 'alphabet-btn'} onClick={() => setAlphabet(alphabet === char ? '' : char)}>
          {char}
        </button>
      );
    }
    return btns;
  };

  return (
    <div className="lung-container">
      {/* 使用動態標題 */}
      <h1 className="associated">{dynamicTitle}</h1> 
      <div className="alphabet-container">{renderAlphabets()}</div>
      <div className="content-tabs" style={{ marginTop: '20px' }}>
        {isInitialLoading ? (
          <div className="loading-spinner text-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p style={{ marginTop: '10px' }}>Loading {type} data...</p>
          </div>
        ) : (
          <div className="content active-content">
            <MDBDataTable striped bordered hover data={formattedData} entries={10} noBottomColumns={true} responsive />
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalMolecularTable;