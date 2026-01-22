import React, { useState, useEffect, useMemo } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link, useLocation, useHistory } from 'react-router-dom';
import 'mdbreact/dist/css/mdb.css';
import './page.css';

function ALLTable() {
  const [alphabet, setAlphabet] = useState('');
  const [rawData, setRawData] = useState([]); // 存儲原始 API 資料
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // 搜尋輸入框的值
  
  const location = useLocation();
  const history = useHistory();

  // 從 URL 讀取搜尋參數
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    setSearchQuery(searchParam);
  }, [location.search]);

  // 1. 取得 API 資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const params = new URLSearchParams(location.search);
        const searchKeyword = params.get('search');
        
        let apiUrl;
        if (searchKeyword && searchKeyword.trim()) {
          // 如果有搜尋關鍵字，使用 Elasticsearch API
          apiUrl = `http://172.16.146.196:8000/search/es/ALL/?query=${encodeURIComponent(searchKeyword.trim())}`;
        } else {
          // 否則使用原本的 API
          apiUrl = "http://172.16.146.196:8000/ALL/";
        }
        
        console.log('🔍 Fetching data from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        // 檢查響應狀態
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ HTTP Error Response:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const res = await response.json();
        console.log('✅ API Response:', res);
        console.log('📊 Response keys:', Object.keys(res));
        console.log('📦 Results count:', res.results?.length || res.count || 0);
        
        // 處理分頁響應格式：{count, next, previous, results}
        // 或直接是 {results} 格式
        let data = [];
        if (res.results) {
          data = res.results;
          console.log('✅ Using res.results, count:', data.length);
        } else if (res.data) {
          data = res.data;
          console.log('✅ Using res.data, count:', data.length);
        } else if (Array.isArray(res)) {
          data = res;
          console.log('✅ Using direct array, count:', data.length);
        } else {
          console.warn('⚠️ Unexpected response format:', res);
          console.warn('⚠️ Response structure:', JSON.stringify(res, null, 2));
        }
        
        if (data.length > 0) {
          console.log('📝 First item sample:', data[0]);
        } else {
          console.warn('⚠️ No data returned from API');
        }
        
        setRawData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error fetching ALL data:", error);
        console.error("❌ Error details:", error.message);
        console.error("❌ Error stack:", error.stack);
        setRawData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [location.search]); // 當 URL 參數改變時重新獲取資料

  // 處理搜尋表單提交
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    // 更新 URL，不刷新頁面
    if (trimmedQuery) {
      history.push(`/search?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      history.push('/search');
    }
  };

  // 處理清除搜尋
  const handleClearSearch = () => {
    setSearchQuery('');
    history.push('/search');
  };

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
    let filteredRows = rawData;
    
    // 先應用字母篩選
    if (alphabet) {
      filteredRows = filteredRows.filter(el => 
        el.cargo && el.cargo.toLowerCase().startsWith(alphabet.toLowerCase())
      );
    }

    return {
      columns: [
        { label: "Marker", field: "cargo", sort: "asc", width: 150 },
        // { label: "Gene symbol", field: "entrezname", sort: "asc", width: 150 },
        { label: "Molecular Type", field: "molecularType", sort: "asc", width: 150 },
        { label: "Tissue", field: "tissue", sort: "asc", width: 150 },
        { label: "Cancer cell type", field: "cellType", sort: "asc", width: 150 },
        { label: "Specimen", field: "clinicalUse", sort: "asc", width: 150 },
        { label: "PMCID", field: "pmcid", sort: "asc", width: 150 },
      ],
      rows: filteredRows.map((item) => {
        // 根據 molecularType 決定連結路徑
        const molecularType = item.molecularType?.toLowerCase() || 'gene';
        const targetId = item.original_id || item.originalID || item.id;
        
        return {
          cargo: (
            <Link 
              to={`/${molecularType}/${targetId}`} 
              style={{ fontWeight: 'bold', color: '#2e3e93', textDecoration: 'none' }}
            >
              {item.cargo}
            </Link>
          ),
          entrezname: item.entrezName || "-",
          molecularType: (item.molecularType || "-").toUpperCase(),
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
        };
      }),
    };
  }, [rawData, alphabet]);

  const params = new URLSearchParams(location.search);
  const hasSearchKeyword = params.get('search');

  return (
    <div className="lung-container">
      <p className="associated">Associated potential markers</p>
      
      {/* 搜尋欄位 */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '600px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search markers (e.g., CD133, PD-L1, mir-21, 27-hydroxycholesterol...)"
            style={{
              flex: 1,
              padding: '10px 15px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#2e3e93',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Search
          </button>
          {hasSearchKeyword && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* 顯示搜尋結果提示 */}
      {hasSearchKeyword && (
        <div style={{ marginBottom: '15px', textAlign: 'center', color: '#666' }}>
          <p>Search results for: <strong>{params.get('search')}</strong> ({rawData.length} results)</p>
        </div>
      )}
      
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