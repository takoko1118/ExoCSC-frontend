import React from 'react';
import UniversalMolecularTable from './UniversalMolecularTable'; // 路徑依實際修改

const ALLTable = () => (
  <UniversalMolecularTable
    title="Associated potential markers"
    endpoint="ALL"  // 這個 endpoint 會抓到 gene/rna/protein/lipid
  />
);

export default ALLTable;
