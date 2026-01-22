import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link, useLocation } from 'react-router-dom';
import 'mdbreact/dist/css/mdb.css';
import './page.css';

const UniversalMolecularTable = ({ type, title, endpoint }) => {
  const [alphabet, setAlphabet] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [allData, setAllData] = useState([]);
  const requestIdRef = useRef(0); // 用於追蹤請求 ID
  const currentRequestRef = useRef(null); // 追蹤當前的 AbortController

  const location = useLocation();

  // 提取 tissue 參數（用於依賴項，避免其他 URL 參數觸發重新 fetch）
  const tissueParam = useMemo(() => {
    return new URLSearchParams(location.search).get('tissue');
  }, [location.search]);

  // 調試：確認組件渲染
  console.log(`[${type}] Component rendered with endpoint: ${endpoint}, pathname: ${location.pathname}`);

  useEffect(() => {
    console.log(`[${type}] useEffect triggered, endpoint: ${endpoint}, search: ${location.search}`);
    
    // 生成新的請求 ID
    const currentRequestId = ++requestIdRef.current;
    console.log(`[${type}] Starting request with ID: ${currentRequestId}`);
    
    // 如果有舊的請求正在進行，取消它
    if (currentRequestRef.current) {
      console.log(`[${type}] Cancelling previous request`);
      currentRequestRef.current.abort();
    }
    
    let isMounted = true;
    let loadingCleared = false;
    let abortController = new AbortController();
    currentRequestRef.current = abortController; // 保存當前的 controller
    let timeoutId = null;
    let finalTimeout = null;
    
    // 最終安全機制：無論如何，20秒後必須停止loading
    finalTimeout = setTimeout(() => {
      if (isMounted && !loadingCleared && currentRequestId === requestIdRef.current) {
        console.warn(`[${type}] Force clearing loading state after 20 seconds`);
        setIsInitialLoading(false);
        loadingCleared = true;
      }
    }, 20000);
    
    // 直接執行 fetch，不延遲
    const fetchData = async () => {
        // 檢查這個請求是否仍然有效
        if (currentRequestId !== requestIdRef.current) {
          console.log(`[${type}] Request ${currentRequestId} superseded by ${requestIdRef.current}, aborting fetch`);
          return;
        }
        
        // 再次檢查 abortController 是否仍然有效
        if (abortController.signal.aborted) {
          console.log(`[${type}] Request ${currentRequestId} already aborted, skipping fetch`);
          return;
        }
        
        // 檢查組件是否仍然掛載
        if (!isMounted) {
          console.log(`[${type}] Component not mounted, skipping fetch`);
          return;
        }
        
        console.log(`[${type}] Starting fetch for endpoint: ${endpoint} (Request ID: ${currentRequestId})`);
      
      try {
        const queryParams = new URLSearchParams(location.search);
        const tissueFilter = queryParams.get('tissue');

        const baseApiUrl = `http://172.16.146.196:8000/search/table/${endpoint}/`;
        const filterQuery = tissueFilter ? `&tissue=${encodeURIComponent(tissueFilter)}` : '';

        // Step A: 快速抓取少量數據先顯示（根據 endpoint 類型動態調整超時時間和 limit）
        let quickDataLoaded = false;
        
        // Gene 數據量大，使用更小的 limit 和更長的超時時間
        const quickLimit = endpoint === 'Gene' ? 20 : 50; // Gene 先抓 20 條，其他抓 50 條
        const timeoutDuration = endpoint === 'Gene' ? 60000 : 15000; // Gene 60秒超時，其他 15 秒
        
        timeoutId = setTimeout(() => {
          if (isMounted && !abortController.signal.aborted && currentRequestId === requestIdRef.current) {
            console.warn(`[${type}] Quick fetch timeout after ${timeoutDuration / 1000} seconds`);
            abortController.abort();
          }
        }, timeoutDuration);

        try {
          console.log(`[${type}] Fetching quick data from: ${baseApiUrl}?limit=${quickLimit}${filterQuery}`);
          console.log(`[${type}] Request started at:`, new Date().toISOString());
          
          // 添加 abort 事件監聽器
          const abortHandler = () => {
            console.error(`[${type}] ⚠️ AbortController was aborted! Request ID: ${currentRequestId}, Current Request ID: ${requestIdRef.current}`);
            console.error(`[${type}] Abort reason:`, abortController.signal.reason);
            console.error(`[${type}] Abort stack trace:`, new Error().stack);
          };
          abortController.signal.addEventListener('abort', abortHandler);
          
          // 在請求完成後移除監聽器
          const removeAbortHandler = () => {
            abortController.signal.removeEventListener('abort', abortHandler);
          };
          
          let quickRes;
          try {
            console.log(`[${type}] About to call fetch...`);
            console.log(`[${type}] Request URL: ${baseApiUrl}?limit=${quickLimit}${filterQuery}`);
            console.log(`[${type}] AbortController signal aborted before fetch:`, abortController.signal.aborted);
            console.log(`[${type}] Request ID check: ${currentRequestId} === ${requestIdRef.current}?`, currentRequestId === requestIdRef.current);
            
            // 在 fetch 前再次檢查
            if (currentRequestId !== requestIdRef.current) {
              console.log(`[${type}] Request ${currentRequestId} superseded before fetch, aborting`);
              removeAbortHandler();
              return;
            }
            
            if (abortController.signal.aborted) {
              console.log(`[${type}] AbortController already aborted before fetch`);
              removeAbortHandler();
              return;
            }
            
            console.log(`[${type}] Waiting for fetch to complete...`);
            quickRes = await fetch(`${baseApiUrl}?limit=${quickLimit}${filterQuery}`, {
              signal: abortController.signal,
              cache: 'no-cache' // 禁用緩存，確保每次都獲取最新資料
            });
            
            console.log(`[${type}] ✅ Fetch completed, status:`, quickRes.status);
            console.log(`[${type}] AbortController signal aborted after fetch:`, abortController.signal.aborted);
            console.log(`[${type}] Request ID check after fetch: ${currentRequestId} === ${requestIdRef.current}?`, currentRequestId === requestIdRef.current);
            removeAbortHandler();
          } catch (fetchError) {
            console.error(`[${type}] ❌ Fetch error caught:`, fetchError);
            console.error(`[${type}] Error name:`, fetchError.name);
            console.error(`[${type}] Error message:`, fetchError.message);
            console.error(`[${type}] Error stack:`, fetchError.stack);
            console.error(`[${type}] Request ID at error: ${currentRequestId}, Current Request ID: ${requestIdRef.current}`);
            console.error(`[${type}] AbortController aborted at error:`, abortController.signal.aborted);
            removeAbortHandler();
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
              console.log(`[${type}] Fetch was aborted (Request ID: ${currentRequestId}, Current Request ID: ${requestIdRef.current})`);
              return; // 如果是被取消的，直接返回
            }
            throw fetchError; // 重新拋出其他錯誤
          }
          
          if (!quickRes) {
            console.error(`[${type}] No response received!`);
            throw new Error('No response received from server');
          }
          
          console.log(`[${type}] Response received at:`, new Date().toISOString());
          console.log(`[${type}] Response status:`, quickRes.status, quickRes.statusText);
          clearTimeout(timeoutId);
          
          if (!quickRes.ok) {
            const errorText = await quickRes.text();
            console.error(`[${type}] HTTP Error Response:`, quickRes.status, errorText);
            throw new Error(`HTTP error! status: ${quickRes.status}`);
          }
          
          const quickData = await quickRes.json();
          console.log(`[${type}] Quick data received:`, quickData);
          console.log(`[${type}] Quick data count:`, quickData.results?.length || quickData.count || 0);
          console.log(`[${type}] Quick data keys:`, Object.keys(quickData));
          
          // 處理不同的響應格式
          let data = [];
          if (quickData.results) {
            data = quickData.results;
            console.log(`[${type}] Using quickData.results, count:`, data.length);
          } else if (Array.isArray(quickData)) {
            data = quickData;
            console.log(`[${type}] Using direct array, count:`, data.length);
          } else if (quickData.data) {
            data = quickData.data;
            console.log(`[${type}] Using quickData.data, count:`, data.length);
          } else {
            console.warn(`[${type}] Unexpected response format:`, quickData);
          }
          
          console.log(`[${type}] Extracted data count:`, data.length);
          if (data.length > 0) {
            console.log(`[${type}] First item sample:`, data[0]);
          } else {
            console.warn(`[${type}] No data in response!`);
          }
          
          // 檢查這個請求是否仍然有效
          if (currentRequestId !== requestIdRef.current) {
            console.log(`[${type}] Request ${currentRequestId} superseded by ${requestIdRef.current}, ignoring response`);
            return;
          }
          
          console.log(`[${type}] About to set data, isMounted: ${isMounted}, aborted: ${abortController.signal.aborted}, data length: ${data.length}`);
          
          // 立即顯示快速抓取的數據
          if (isMounted && !abortController.signal.aborted) {
            console.log(`[${type}] Setting quick data to state...`);
            setAllData(data);
            setIsInitialLoading(false);
            loadingCleared = true;
            clearTimeout(finalTimeout);
            quickDataLoaded = true;
            console.log(`[${type}] Quick data set successfully for request ${currentRequestId}, data length: ${data.length}`);
            if (data.length > 0) {
              console.log(`[${type}] Sample data item:`, data[0]);
            }
          } else if (abortController.signal.aborted) {
            console.log(`[${type}] Request was aborted, ignoring response`);
          } else {
            console.warn(`[${type}] Component not mounted, not setting data`);
          }
        } catch (quickError) {
          clearTimeout(timeoutId);
          if (quickError.name === 'AbortError') {
            console.log(`[${type}] Quick fetch aborted (component unmounting or dependencies changed)`);
            // 如果是因為組件卸載或依賴項改變而取消，這是正常的，不需要顯示錯誤
          } else {
            console.error(`[${type}] Error in quick fetch:`, quickError);
            console.error(`[${type}] Error details:`, quickError.message);
            console.error(`[${type}] Error stack:`, quickError.stack);
          }
          // 即使快速抓取失敗，也要停止loading
          if (isMounted && !loadingCleared) {
            setIsInitialLoading(false);
            loadingCleared = true;
            clearTimeout(finalTimeout);
          }
        }

        // Step B: 背景慢慢抓取完整資料（不阻塞 UI）
        if (isMounted && !abortController.signal.aborted && currentRequestId === requestIdRef.current) {
          // 使用 setTimeout 讓背景抓取在快速數據顯示後再開始
          setTimeout(async () => {
            // 再次檢查請求是否仍然有效
            if (currentRequestId !== requestIdRef.current || !isMounted || abortController.signal.aborted) {
              console.log(`[${type}] Request ${currentRequestId} no longer valid, skipping full data fetch`);
              return;
            }
            
            try {
              console.log(`[${type}] Fetching full data from: ${baseApiUrl}?limit=20000${filterQuery}`);
              const fullRes = await fetch(`${baseApiUrl}?limit=20000${filterQuery}`, {
                cache: 'no-cache'
              });
              
              if (fullRes.ok) {
                const fullData = await fullRes.json();
                console.log(`[${type}] Full data received:`, fullData);
                console.log(`[${type}] Full data count:`, fullData.results?.length || fullData.count || 0);
                
                // 處理不同的響應格式
                let fullDataArray = [];
                if (fullData.results) {
                  fullDataArray = fullData.results;
                } else if (Array.isArray(fullData)) {
                  fullDataArray = fullData;
                } else if (fullData.data) {
                  fullDataArray = fullData.data;
                }
                
                console.log(`[${type}] Extracted full data count:`, fullDataArray.length);
                
                // 只有在請求仍然有效時才更新數據
                if (currentRequestId === requestIdRef.current && isMounted && !abortController.signal.aborted) {
                  setAllData(fullDataArray);
                  console.log(`[${type}] Full data set successfully for request ${currentRequestId}`);
                }
              } else {
                const errorText = await fullRes.text();
                console.error(`[${type}] Full fetch failed with status: ${fullRes.status}`, errorText);
                // 背景抓取失敗不影響已顯示的快速數據
              }
            } catch (fullError) {
              console.error(`[${type}] Error in full fetch:`, fullError);
              console.error(`[${type}] Error details:`, fullError.message);
              // 背景抓取失敗不影響已顯示的快速數據
            }
          }, 1000); // 延遲 1 秒後開始背景抓取，讓快速數據先顯示
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
    
    // 直接執行，不延遲
    fetchData();
    
    // Cleanup function - 只在組件真正卸載時才取消請求
    return () => {
      console.log(`[${type}] 🧹 Cleanup called for request ${currentRequestId}, current request ID: ${requestIdRef.current}`);
      
      // 如果這不是最新的請求，不需要做任何事
      if (currentRequestId !== requestIdRef.current) {
        console.log(`[${type}] Request ${currentRequestId} is not the latest (${requestIdRef.current}), cleanup skipped`);
        return;
      }
      
      // 只有在組件真正卸載時才取消請求
      isMounted = false;
      
      // 清除超時
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (finalTimeout) {
        clearTimeout(finalTimeout);
      }
      
      // 只有在這是最新請求且 controller 仍然有效時才取消
      if (currentRequestRef.current === abortController && !abortController.signal.aborted) {
        console.log(`[${type}] Aborting request ${currentRequestId} in cleanup`);
        abortController.abort();
        currentRequestRef.current = null;
      }
    };
  }, [endpoint, type, tissueParam]); // 移除 location.pathname，因為它會導致不必要的重新 fetch

  // 動態標題
  const dynamicTitle = useMemo(() => {
    const tissue = new URLSearchParams(location.search).get('tissue');
    return tissue ? `${title} (${tissue})` : title;
  }, [title, location.search]);

  // 格式化資料表
  const formattedData = useMemo(() => {
    console.log(`[${type}] Formatting data, allData length:`, allData.length);
    console.log(`[${type}] First item sample:`, allData[0]);
    
    const filtered = alphabet
      ? allData.filter(item => item.cargo && item.cargo.toLowerCase().startsWith(alphabet.toLowerCase()))
      : allData;

    console.log(`[${type}] Filtered data length:`, filtered.length);
    console.log(`[${type}] Alphabet filter:`, alphabet);

    const rows = filtered.map(item => ({
      molecularType: item.molecularType || "-",
      cargo: (
        <Link
          to={`/${type.toLowerCase()}/${item.id}`}
          style={{ color: '#2e3e93', fontWeight: 'bold', textDecoration: 'none' }}
        >
          {item.cargo || "-"}
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
    }));

    console.log(`[${type}] Formatted rows count:`, rows.length);
    if (rows.length > 0) {
      console.log(`[${type}] First formatted row:`, rows[0]);
    }

    return {
      columns: [
        
        { label: "Marker", field: "cargo", sort: "asc", width: 150 },
        { label: "Molecular Type", field: "molecularType", sort: "asc", width: 150 },
        { label: "Tissue", field: "tissue", sort: "asc", width: 150 },
        { label: "Cancer cell type", field: "cellType", sort: "asc", width: 150 },
        { label: "Specimen", field: "clinicalUse", sort: "asc", width: 150 },
        { label: "PMCID", field: "pmcid", sort: "asc", width: 150 },
      ],
      rows: rows,
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

// 使用 React.memo 避免不必要的重新渲染
export default React.memo(UniversalMolecularTable);
