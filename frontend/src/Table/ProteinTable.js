import { useState, useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import { Link } from 'react-router-dom';
import React from 'react';
const ProteinTable = () => {
  const [alphabet, setAlphabet] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  const [ProteinData, setProteinData] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    fetch('http://db.cmdm.tw:8000/search/table/Protein/')
      .then((response) => response.json())
      .then((res) => {
        const ProteinData = {
          columns: [
            {
              label: 'Name',
              field: 'cargo',
              sort: 'asc',
              width: 150,
            },
            {
              label: 'Gene symbol',
              field: '',
              sort: 'asc',
              width: 150,
            },
            {
              label: 'Tissue',
              field: 'tissue',
              sort: 'asc',
              width: 15,
            },
            {
              label: 'Cancer cell type',
              field: 'cellType',
              sort: 'asc',
              width: 150,
            },
            {
              label: 'Specimen',
              field: 'clinicalUse',
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
          rows: res.results
            .filter((el) => el.cargo.toLowerCase().startsWith(alphabet.toLowerCase()))
            .map((apiData) => ({
              molecularType: apiData.molecularType,
              cargo: (
                <Link to={`/protein/${apiData.id}`} style={{ color: 'blue' }}>
                  {apiData.cargo}
                </Link>
              ),
              tissue: apiData.tissue,
              cellType: apiData.cellType,
              clinicalUse: apiData.clinicalUse,
              pmcid: (
                <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${apiData.pmcid}`} style={{ color: 'blue' }}>
                  {apiData.pmcid}
                </a>
              ),
            })),
        };

        setProteinData(ProteinData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching protein data:', error);
        setIsLoading(false);
      });
  }, [alphabet]);

  return (
    <div>
      <p className="associated">Associated potential proteins</p>

      <div style={{ marginLeft: 250 }}>{prepareAlphabets()}</div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <MDBDataTable striped bordered hover data={ProteinData} />
      )}
    </div>
  );
};

export default ProteinTable;
