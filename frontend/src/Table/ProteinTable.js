import React from 'react';
import UniversalMolecularTable from './UniversalMolecularTable'; // 請確保路徑正確

const ProteinTable = () => (
  <UniversalMolecularTable 
    type="Protein" 
    title="Associated potential proteins" 
    endpoint="Protein" 
  />
);

// 關鍵在於這一行，必須手動補上
export default ProteinTable;