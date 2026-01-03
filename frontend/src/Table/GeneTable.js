import React from 'react';
import UniversalMolecularTable from './UniversalMolecularTable';

const GeneTable = () => (
  <UniversalMolecularTable type="Gene" title="Associated potential genes" endpoint="Gene" />
);
export default GeneTable;