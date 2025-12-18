import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';
import React from 'react';
function DetailPage() {
  const { index } = useParams();
  const [data, setData] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [Alldata, setAlldata] = useState(null); // new state variable
  const [genedata, setgenedata] = useState(null); // new state variable
  const [mRNAdata, setmRNAdata] = useState(null);
  useEffect(() => {
    fetch(`http://db.cmdm.tw:8000/search/table/ALL/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);
  
        const dataBUrls = res.ref0427_url;
        const requests = dataBUrls.map(url => fetch(url).then(response => response.json()));
        return Promise.all(requests);
      })
      .then((dataBs) => {
        setDataB(dataBs);
  
        const Alldata = {
          columns: [
                      {
                        label: 'Title',
                        field: 'title',
                        sort: 'asc',
                        width: 270,
                      },
                      {
                        label: 'Journel',
                        field: 'journel',
                        sort: 'asc',
                        width: 270,
                      },
                      {
                        label: 'Abstract',
                        field: 'abstract',
                        sort: 'asc',
                        width: 270,
                      },
                      {
                        label: 'Year',
                        field: 'year',
                        sort: 'asc',
                        width: 270,
                      },
                      {
                        label: 'Author',
                        field: 'author',
                        sort: 'asc',
                        width: 200,
                      },
                     
                      {
                        label: 'PMCID',
                        field: 'pmcid',
                        sort: 'asc',
                        width: 150,
                      },
                    ],
          rows: [],
        };
  
        const genedata = {
          columns: [
            {
              label: 'Concept Name',
              field: 'gene',
              sort: 'asc',
              width: 150,
            },
            
            
            {
              label: 'Tissue',
              field: 'tissue',
              sort: 'asc',
              width: 150,
            },
            {
              label: 'Weighted Score',
              field: 'scroe',
              sort: 'asc',
              width: 150,
            },
            {
              label: 'PMCID',
              field: 'pmcid',
              sort: 'asc',
              width: 150,
            },
          ],
          rows: [],
        };
  
        dataBs.forEach((dataB) => {
          // Add dataB to Alldata and genedata rows
          Alldata.rows.push({
            pmcid: dataB.pmcid,
            title: dataB.title,
            author: dataB.author,
            abstract: dataB.abstract,
          });
  
          genedata.rows.push({
            pmcid: dataB.pmcid,
            title: dataB.title,
            author: dataB.author,
            abstract: dataB.abstract,
          });
        });
  
        setAlldata(Alldata);
        setgenedata(genedata);
  
        console.log('ref0427', dataBs);
      });
  }, [index]);
  
  // useEffect(() => {
  //   fetch(`http://db.cmdm.tw:8000/search/table/ALL/${index}`)
  //     .then((response) => response.json())
  //     .then((res) => {
  //       setData(res);

  //       const dataBUrl = res.ref0427_url;
  //       return fetch(dataBUrl);
  //     })
  //     .then((response) => response.json())
  //     .then((dataB) => {
  //       setDataB(dataB);
  //       // create the Alldata variable
  //       const Alldata = {
  //         columns: [
  //           {
  //             label: 'Title',
  //             field: 'title',
  //             sort: 'asc',
  //             width: 270,
  //           },
  //           {
  //             label: 'Journel',
  //             field: 'journel',
  //             sort: 'asc',
  //             width: 270,
  //           },
  //           {
  //             label: 'Year',
  //             field: 'year',
  //             sort: 'asc',
  //             width: 270,
  //           },
  //           {
  //             label: 'Author',
  //             field: 'author',
  //             sort: 'asc',
  //             width: 200,
  //           },
  //           {
  //             label: 'Weighted Score',
  //             field: 'score',
  //             sort: 'asc',
  //             width: 200,
  //           },
  //           {
  //             label: 'PMCID',
  //             field: 'pmcid',
  //             sort: 'asc',
  //             width: 150,
  //           },
  //         ],
  //         rows: [
  //           {
  //             pmcid: dataB.pmcid,
  //             title: dataB.title,
  //             author: dataB.author,
  //           },
  //         ],
  //       };
  //       const genedata = {
  //         columns: [
  //           {
  //             label: 'Gene name',
  //             field: 'gene',
  //             sort: 'asc',
  //             width: 270,
  //           },
  //           {
  //             label: 'Entrez ID',
  //             field: 'entrexid',
  //             sort: 'asc',
  //             width: 270,
  //           },
  //           {
  //             label: 'Tissue',
  //             field: 'tissue',
  //             sort: 'asc',
  //             width: 270,
  //           },
  //           {
  //             label: 'References',
  //             field: 'reference',
  //             sort: 'asc',
  //             width: 270,
  //           },
  //         ],
  //         rows: [
  //           {
  //             pmcid: dataB.pmcid,
  //             title: dataB.title,
  //             author: dataB.author,
  //           },
  //         ],
  //       };

  //       // set the Alldata state variable
  //       setAlldata(Alldata);
  //       setgenedata(genedata);

  //       // use the retrieved dataB
  //       console.log('ref0427', dataB);
  //     });
  // }, [index]);
  console.log('all', data)
  console.log('ref0427', dataB);

  if (!data) {
    return <div>Loading...</div>;
  }



  return (
    <div className='detail'>
      
  <aside >
    <nav  className="nav-bar flex-column sticky-top" >
      <h4>Menu</h4>
      <ul>
        <li>
        <a href="#description">Description</a>

        </li>
        <li>
        <a href="#references">Reference</a>
        </li>
        <li>
        <a href="#geneCC">Associated genes in Cancer cell</a>       
        </li>
        <li>
        <a href="#geneCSC">Associated genes in Cancer Stem cell</a>       
        </li>
        <li>
        <a href="#gene-RNA">Associated miRNA</a>       
        </li>
        <li>
        <a href="#gene-lipid">Associated Lipids</a>       
        </li>
      </ul>
    </nav>
  </aside>
  <div className="content">
    <h1>{data.cargo}</h1>
    
    <div id="description" style={{ marginTop: '50px' }}>
      <h2>Description</h2>
      <table className='detailTable' style={{fontSize: '10px'}}>
        <thead>
          <tr>
            <th colSpan="2">Description for {data.cargo}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Gene name</th>
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
        </tbody>
      </table>
    </div>
    
    <div id="references" style={{ marginTop: '50px' }}>
      <h2>Associated References</h2>
      {Alldata !== null && <MDBDataTable striped noBottomColumns={true}  searching={false} paging={false} data={Alldata} />}
    </div>
    
    <div id="geneCSC">
      <h2>Associated genes in cancer stem cell exosome</h2>
      {genedata !== null && <MDBDataTable striped noBottomColumns={true}  searching={false} paging={false} data={genedata} />}
    </div>
    
    <div id="geneCC" style={{ marginTop: '50px' }}>
      <h2>Associated genes in cancer Cell exosome</h2>
      {genedata !== null && <MDBDataTable striped noBottomColumns={true}  searching={false} paging={false} data={genedata} />}
    </div>

    <div id="gene-RNA" style={{ marginTop: '50px' }}>
      <h2>Associated miRNA</h2>
      {genedata !== null && <MDBDataTable striped noBottomColumns={true}  searching={false} paging={false} data={genedata} />}
    </div>

    <div id="gene-lipid" style={{ marginTop: '50px' }}>
      <h2>Associated Lipids</h2>
      {genedata !== null && <MDBDataTable striped noBottomColumns={true}  searching={false} paging={false} data={genedata} />}
    </div>
    
    <footer>FOOTER</footer>
  </div>
</div>

  );




}

export default DetailPage;


