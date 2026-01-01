import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';

function GeneDetail() {
  const { index } = useParams();
  const [data, setData] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [dataC, setDataC] = useState(null);
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  
  // 為了保持你原本代碼的結構，保留這些 state
  const [Alldata, setAlldata] = useState(null);
  const [genedata, setgenedata] = useState(null);

  useEffect(() => {
    fetch(`http://db.cmdm.tw:8000/search/table/Gene/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        const dataBUrls = res.gene_rna_urls.map(obj => obj.id_url);
        const dataCUrls = res.gene_ref_urls.map(obj => obj.id_url);
        
        const requestsB = dataBUrls.map(url => fetch(url).then(response => response.json()));
        const requestsC = dataCUrls.map(url => fetch(url).then(response => response.json()));

        // 處理 GeneRNA 資料與 LLM 敘述
        Promise.all(requestsB)
          .then((dataBs) => {
            setDataB(dataBs);
            const mRNATableConfig = {
              columns: [
                { label: 'gene', field: 'gene', sort: 'asc', width: 270 },
                { label: 'Tissue', field: 'tissue', sort: 'asc', width: 270 },
                { label: 'score', field: 'score', sort: 'asc', width: 200 },
                { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
              ],
              rows: dataBs.map(item => ({
                gene: item.cargo_rna,
                tissue: item.tissue,
                score: item.score_x || item.score_y,
                pmcid: item.pmcid,
              })),
            };
            setmRNAdata(mRNATableConfig);
          })
          .catch((error) => console.error('Error fetching dataB:', error));

        // 處理 Reference 資料
        Promise.all(requestsC)
          .then((dataCs) => {
            setDataC(dataCs);
            const refTableConfig = {
              columns: [
                { label: 'Title', field: 'title', sort: 'asc', width: 270 },
                { label: 'Journal', field: 'journal', sort: 'asc', width: 270 },
                { label: 'Year', field: 'year', sort: 'asc', width: 270 },
                { label: 'Author', field: 'author', sort: 'asc', width: 200 },
                { label: 'PMCID', field: 'pmcid', sort: 'asc', width: 150 },
              ],
              rows: dataCs.map(item => ({
                title: item.title,
                journal: item.journal,
                year: item.year,
                author: item.author,
                pmcid: item.pmcid,
              })),
            };
            setRefdata(refTableConfig);
          })
          .catch((error) => console.error('Error fetching dataC:', error));
      });
  }, [index]);

  if (!data) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className='detail'>
      <aside>
        <nav className="nav-bar flex-column sticky-top">
          <h4>Menu</h4>
          <ul>
            <li><a href="#description">Description</a></li>
            <li><a href="#geneCC">Associated genes in Cancer cell</a></li>
            <li><a href="#geneCSC">Associated genes in Cancer Stem cell</a></li>
            <li><a href="#gene-RNA">Associated miRNA</a></li>
            <li><a href="#gene-lipid">Associated Lipids</a></li>
            <li><a href="#references">Reference</a></li>
          </ul>
        </nav>
      </aside>

      <div className="content">
        <h1>{data.cargo}</h1>

        {/* --- Description 欄位：整合基本資訊與 LLM 敘述 --- */}
        <div id="description" style={{ marginTop: '50px' }}>
          <h2>Description</h2>
          <table className='detailTable' style={{ fontSize: '12px' }}>
            <thead>
              <tr>
                <th colSpan="2">Biological Information & Mechanism for {data.cargo}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ width: '20%' }}>Gene name</th>
                <td>{data.cargo}</td>
              </tr>
              <tr>
                <th>Gene symbol</th>
                <td>{data.cargo}</td>
              </tr>
              <tr>
                <th>Entrez Gene</th>
                <td>{data.id}</td>
              </tr>
              
              {/* --- 整合的 LLM 敘述部分 --- */}
              <tr>
                <th>AI Mechanistic Insights</th>
                <td style={{ textAlign: 'left', padding: '15px' }}>
                  {dataB && dataB.length > 0 ? (
                    dataB.map((item, i) => (
                      item.llm_narrative && (
                        <div key={i} style={{ 
                          marginBottom: '20px', 
                          padding: '12px', 
                          backgroundColor: '#f8f9fa', 
                          borderLeft: '4px solid #007bff',
                          borderRadius: '4px'
                        }}>
                          <div style={{ fontWeight: 'bold', color: '#0056b3', marginBottom: '5px' }}>
                            Target: {item.cargo_rna} | Tissue: {item.tissue}
                          </div>
                          <div style={{ 
                            whiteSpace: 'pre-wrap', 
                            lineHeight: '1.6', 
                            color: '#333' 
                          }}>
                            {item.llm_narrative}
                          </div>
                        </div>
                      )
                    ))
                  ) : (
                    <span style={{ color: '#999' }}>No mechanistic analysis available.</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 其它原本的表格欄位保留 */}
        <div id="geneCSC" style={{ marginTop: '50px' }}>
          <h2>Associated genes in cancer stem cell exosome</h2>
          {genedata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={genedata} />}
        </div>

        <div id="geneCC" style={{ marginTop: '50px' }}>
          <h2>Associated genes in cancer cell exosome</h2>
          {genedata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={genedata} />}
        </div>

        <div id="gene-RNA" style={{ marginTop: '50px' }}>
          <h2>Associated miRNA</h2>
          {mRNAdata !== null && <MDBDataTable striped hover noBottomColumns={true} searching={false} paging={false} data={mRNAdata} />}
        </div>

        <div id="gene-lipid" style={{ marginTop: '50px' }}>
          <h2>Associated Lipids</h2>
          {genedata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={genedata} />}
        </div>

        <div id="references" style={{ marginTop: '50px' }}>
          <h2>Associated References</h2>
          {Refdata !== null && <MDBDataTable striped hover noBottomColumns={true} searching={false} paging={false} data={Refdata} />}
        </div>

        <footer style={{ marginTop: '100px', padding: '20px', textAlign: 'center' }}>
          ExCSC Database System
        </footer>
      </div>
    </div>
  );
}

export default GeneDetail;