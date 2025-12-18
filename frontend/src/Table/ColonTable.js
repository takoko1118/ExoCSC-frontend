import React, { useState, useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom';

import 'mdbreact/dist/css/mdb.css';
import './page.css';

const ColonTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [toggleState, setToggleState] = useState(1);
  const [alphabet, setAlphabet] = useState('');
  const [CSCdata, setCSCData] = useState([]);
  const [CCdata, setCCData] = useState([]);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const onAlphabetClick = (e) => {
    setAlphabet(e.target.value);
  };

  const prepareAlphabets = () => {
    let result = [];
    for (let i = 65; i < 91; i++) {
      result.push(
        <button
          style={{
            color: 'blue',
            fontSize: 14,
            fontWeight: 600,
            width: 30,
            height: 30,
            textAlign: 'center',
          }}
          type="button"
          key={i}
          onClick={onAlphabetClick}
          value={String.fromCharCode(i)}
        >
          {String.fromCharCode(i)}
        </button>
      );
    }
    return result;
  };

  useEffect(() => {
    setIsLoading(true);
    fetch('http://db.cmdm.tw:8000/search/table/Cancer/')
      .then((response) => response.json())
      .then((res) => {
        const CancerStem = res.results
        .filter(
          (obj) =>
          obj.tissue === 'Colon' &&
          obj.cellType === 'CSC' &&
          (
            obj.cancer_gene_urls.length === 1 ||
            obj.cancer_protein_urls.length === 1 ||
            obj.cancer_rna_urls.length === 1 ||
            obj.cancer_lipid_urls.length === 1
          )
       );
       
      console.log('CancerStem',CancerStem);
        const updatedCancerStem = CancerStem.map((obj) => {
          const combinedCancerStemUrls = [
            ...obj.cancer_gene_urls,
            ...obj.cancer_protein_urls,
            ...obj.cancer_rna_urls,
            ...obj.cancer_lipid_urls,
          ];

          const selectedCancerStemUrl = combinedCancerStemUrls[0];
          return { ...obj, combined_url: selectedCancerStemUrl };
        });
        
        const dataEUrls = updatedCancerStem.map(
          (obj) => obj.combined_url.id_url
        );
        const requestsE = dataEUrls.map((url) =>
          fetch(url).then((response) => response.json())
        );
          

        Promise.all(requestsE)
        .then((dataEs) => {
          const CCdata = {
            columns: [
              {
                label: 'Name',
                field: 'gene',
                sort: 'asc',
                width: 270,
              },
              {
                label: 'tissue',
                field: 'tissue',
                sort: 'asc',
                width: 270,
              },
              // {
              //   label: 'score',
              //   field: 'score',
              //   sort: 'asc',
              //   width: 200,
              // },
              {
                label: 'PMCID',
                field: 'pmcid',
                sort: 'asc',
                width: 150,
              },
            ],
            rows: [],
          };

          dataEs.forEach((dataE) => {
            let Url;
            if (dataE.molecularType === 'gene') {
              Url = dataE.gene_url;
            } else if (dataE.molecularType === 'protein') {
              Url = dataE.protein_url;
            } else if (dataE.molecularType === 'lipid') {
              Url = dataE.lipid_url;
            } else if (dataE.molecularType === 'rna') {
              Url = dataE.rna_url;
            } else {
              Url = dataE.cancer_url;
            }

            CCdata.rows.push({
              gene: (
                <a
                  href={`http://db.cmdm.tw:13007/${dataE.molecularType}/${Url}`}
                  style={{ color: 'blue' }}
                >
                  {dataE.cargo}
                </a>
              ),
              tissue: dataE.tissue,
              score: dataE.score,
              pmcid: (
                <a
                  href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataE.pmcid}`}
                  style={{ color: 'blue' }}
                >
                  {dataE.pmcid}
                </a>
              ),
            });
          });

          setCCData(CCdata);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching dataD:', error);
          setIsLoading(false);
        });



        const CancerGene = res.results.filter(
          (obj) =>
            obj.tissue === 'Colon' &&
            obj.cellType === 'cancer' &&
            (obj.cancer_gene_urls.length === 1 ||
              obj.cancer_protein_urls.length === 1 ||
              obj.cancer_rna_urls.length === 1 ||
              obj.cancer_lipid_urls.length === 1)
        );

        const updatedCancerGene = CancerGene.map((obj) => {
          const combinedUrls = [
            ...obj.cancer_gene_urls,
            ...obj.cancer_protein_urls,
            ...obj.cancer_rna_urls,
            ...obj.cancer_lipid_urls,
          ];

          const selectedUrl = combinedUrls[0];
          return { ...obj, combined_url: selectedUrl };
        });

        const dataDUrls = updatedCancerGene.map(
          (obj) => obj.combined_url.id_url
        );
        const requestsD = dataDUrls.map((url) =>
          fetch(url).then((response) => response.json())
        );
        console.log('updatedCancerGene ',updatedCancerGene );
        Promise.all(requestsD)
          .then((dataDs) => {
            const CSCdata = {
              columns: [
                {
                  label: 'Name',
                  field: 'gene',
                  sort: 'asc',
                  width: 270,
                },
                {
                  label: 'tissue',
                  field: 'tissue',
                  sort: 'asc',
                  width: 270,
                },
                // {
                //   label: 'score',
                //   field: 'score',
                //   sort: 'asc',
                //   width: 200,
                // },
                {
                  label: 'PMCID',
                  field: 'pmcid',
                  sort: 'asc',
                  width: 150,
                },
              ],
              rows: [],
            };

            dataDs.forEach((dataD) => {
              let Url;
              if (dataD.molecularType === 'gene') {
                Url = dataD.gene_url;
              } else if (dataD.molecularType === 'protein') {
                Url = dataD.protein_url;
              } else if (dataD.molecularType === 'lipid') {
                Url = dataD.lipid_url;
              } else if (dataD.molecularType === 'rna') {
                Url = dataD.rna_url;
              } else {
                Url = dataD.cancer_url;
              }

              CSCdata.rows.push({
                gene: (
                  <a
                    href={`http://db.cmdm.tw:13007/${dataD.molecularType}/${Url}`}
                    style={{ color: 'blue' }}
                  >
                    {dataD.cargo}
                  </a>
                ),
                tissue: dataD.tissue,
                score: dataD.score,
                pmcid: (
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${dataD.pmcid}`}
                    style={{ color: 'blue' }}
                  >
                    {dataD.pmcid}
                  </a>
                ),
              });
            });

            setCSCData(CSCdata);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching dataD:', error);
            setIsLoading(false);
          });
          
      })
      .catch((error) => {
        console.error('Error fetching gene data:', error);
        setIsLoading(false);
      });
  }, [alphabet]);

  return (
    <div>
      <p className="associated">Associated Colon markers</p>
      <div className="bloc-tabs">
        {/* <button
          className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'}
          onClick={() => toggleTab(1)}
        >
          Cancer Stem Cell
        </button>
        <button
          className={toggleState === 2 ? 'tabs active-tabs' : 'tabs'}
          onClick={() => toggleTab(2)}
        >
          Cancer Cell
        </button> */}
      </div>
      
      <div className="content-tabs">
        <div className={toggleState === 1 ? 'content active-content' : 'content'}>
          <div className="justify-center">
          <h1 className="associated" style={{ textAlign: 'left' ,marginLeft:0}}>Cancer cell</h1>
            <div style={{ marginLeft: 250 }}>{prepareAlphabets()}</div>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              
              <MDBDataTable striped bordered hover data={CSCdata} />
            )}
          </div>
        </div>

        <div className={toggleState === 2 ? 'content active-content' : 'content'}>
          <div style={{ width: '100%' }}>
          <h1 className="associated" style={{ textAlign: 'left' ,marginLeft:0 }}>Cancer Stem cell</h1>
            <div style={{ marginLeft: 250 }}>{prepareAlphabets()}</div>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <MDBDataTable striped bordered hover data={CCdata} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColonTable;

