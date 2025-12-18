import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import './Detail.css';

function GeneDetail() {
  const { index } = useParams();
  const [data, setData] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [dataC, setDataC] = useState(null);
  const [Alldata, setAlldata] = useState(null); // new state variable
  const [genedata, setgenedata] = useState(null); // new state variable
  const [mRNAdata, setmRNAdata] = useState(null);
  const [Refdata, setRefdata] = useState(null);
  useEffect(() => {
    fetch(`http://db.cmdm.tw:8000/search/table/Gene/${index}`)
      .then((response) => response.json())
      .then((res) => {
        setData(res);

        //const dataBUrls = res.ref0427_url;

        const dataBUrls = res.gene_rna_urls.map(obj => obj.id_url);
        const dataCUrls = res.gene_ref_urls.map(obj => obj.id_url);
        console.log('dataBUrls:', dataBUrls); // Add this line to log dataBUrls
        console.log('dataCUrls:', dataCUrls); // Add this line to log dataBUrls
        //const requests = dataBUrls.map(url => fetch(url).then(response => response.json()));
        //return Promise.all(requests);
        const requestsB = dataBUrls.map(url => fetch(url).then(response => response.json()));
        const requestsC = dataCUrls.map(url => fetch(url).then(response => response.json()));
        Promise.all(requestsB)
          .then((dataBs) => {
            setDataB(dataBs);
            const mRNAdata = {
              columns: [
                {
                  label: 'gene',
                  field: 'gene',
                  sort: 'asc',
                  width: 270,
                },

                {
                  label: 'Tissue',
                  field: 'tissue',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'scroe',
                  field: 'scroe',
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
            dataBs.forEach((dataB) => {
              mRNAdata.rows.push({
                gene: dataB.cargo_rna,
                tissue: dataB.tissue,
                scroe: dataB.scroe,
                pmcid: dataB.pmcid,

              });
            });
            setmRNAdata(mRNAdata);
          })
          .catch((error) => {
            console.error('Error fetching dataB:', error);
          });


        Promise.all(requestsC)
          .then((dataCs) => {
            setDataC(dataCs);
            const Refdata = {
              columns: [
                {
                  label: 'Title',
                  field: 'title',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'Journal',
                  field: 'journal',
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

            dataCs.forEach((dataC) => {
              Refdata.rows.push({
                title: dataC.title,
                journal: dataC.journal,
                year: dataC.year,
                author: dataC.author,
                pmcid: dataC.pmcid,
              });
            });

            setRefdata(Refdata);
          })
          .catch((error) => {
            console.error('Error fetching dataC:', error);
          });


          



      })
    // .then((dataBs) => {
    //   setDataB(dataBs);

    //   const Alldata = {
    //     columns: [
    //                 {
    //                   label: 'Title',
    //                   field: 'title',
    //                   sort: 'asc',
    //                   width: 270,
    //                 },
    //                 {
    //                   label: 'Journel',
    //                   field: 'journel',
    //                   sort: 'asc',
    //                   width: 270,
    //                 },
    //               //   {
    //               //     label: 'Abstract',
    //               //     field: 'abstract',
    //               //     sort: 'asc',
    //               //     width: 270,
    //               //   },
    //                 {
    //                   label: 'Year',
    //                   field: 'year',
    //                   sort: 'asc',
    //                   width: 270,
    //                 },
    //                 {
    //                   label: 'Author',
    //                   field: 'author',
    //                   sort: 'asc',
    //                   width: 200,
    //                 },

    //                 {
    //                   label: 'PMCID',
    //                   field: 'pmcid',
    //                   sort: 'asc',
    //                   width: 150,
    //                 },
    //               ],
    //     rows: [],
    //   };

    //   const genedata = {
    //     columns: [
    //       {
    //         label: 'Concept Name',
    //         field: 'gene',
    //         sort: 'asc',
    //         width: 150,
    //       },


    //       {
    //         label: 'Tissue',
    //         field: 'tissue',
    //         sort: 'asc',
    //         width: 150,
    //       },
    //       {
    //         label: 'Weighted Score',
    //         field: 'scroe',
    //         sort: 'asc',
    //         width: 150,
    //       },
    //       {
    //         label: 'PMCID',
    //         field: 'pmcid',
    //         sort: 'asc',
    //         width: 150,
    //       },
    //     ],
    //     rows: [],
    //   };

    //   dataBs.forEach((dataB) => {
    //     // Add dataB to Alldata and genedata rows
    //     // Alldata.rows.push({
    //     //   pmcid: dataB.pmcid,
    //     //   title: dataB.title,
    //     //   author: dataB.author,
    //     //   abstract: dataB.abstract,
    //     // });

    //     genedata.rows.push({
    //       gene: dataB.cargo_rna,
    //       tissue: dataB.tissue,
    //       scroe: dataB.rna_id,
    //       pmcid: dataB.pmcid,
    //     });


    //   });

    //   setAlldata(Alldata);
    //   setgenedata(genedata);

    //   console.log('dataBs', dataBs);

    // });

  }, [index]);

  console.log('results', data)
  console.log('geneRNA', dataB);
  console.log('geneRef', dataC);
  console.log('Refdata', Refdata);
  console.log('mRNAdata', mRNAdata);


  if (!data) {
    return <div>Loading...</div>;
  }



  return (
    <div className='detail'>


      <aside >
        <nav className="nav-bar flex-column sticky-top" >
          <h4>Menu</h4>
          <ul>
            <li>
              <a href="#description">Description</a>

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
            <li>
              <a href="#references">Reference</a>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="content">
        <h1>{data.cargo}</h1>

        <div id="description" style={{ marginTop: '50px' }}>
          <h2>Description</h2>
          <table className='detailTable' style={{ fontSize: '10px' }}>
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



        <div id="geneCSC">
          <h2>Associated genes in cancer stem cell exosome</h2>
          {genedata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={genedata} />}
        </div>

        <div id="geneCC" style={{ marginTop: '50px' }}>
          <h2>Associated genes in cancer cell exosome</h2>
          {genedata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={genedata} />}
        </div>

        <div id="gene-RNA" style={{ marginTop: '50px' }}>
          <h2>Associated miRNA</h2>
          {mRNAdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={mRNAdata} />}
        </div>

        <div id="gene-lipid" style={{ marginTop: '50px' }}>
          <h2>Associated Lipids</h2>
          {genedata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={genedata} />}
        </div>
        <div id="references" style={{ marginTop: '50px' }}>
          <h2>Associated References</h2>
          {Refdata !== null && <MDBDataTable striped noBottomColumns={true} searching={false} paging={false} data={Refdata} />}
        </div>
        <footer>FOOTER</footer>
      </div>
    </div>

  );




}

export default GeneDetail;


