import React from 'react';
import UniversalMolecularTable from './UniversalMolecularTable'; 

const RNATable = () => (
  <UniversalMolecularTable 
    type="RNA" 
    title="Associated potential miRNAs" 
    endpoint="RNA" 
  />
);

// 必須加上這一行，App.js 才能正確匯入
export default RNATable;