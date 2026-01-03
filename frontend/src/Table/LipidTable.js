import React from 'react';
import UniversalMolecularTable from './UniversalMolecularTable'; // 確保路徑正確

const LipidTable = () => (
  <UniversalMolecularTable 
    type="Lipid" 
    title="Associated potential lipids" 
    endpoint="Lipid" 
  />
);

// 核心：必須有這一行
export default LipidTable;