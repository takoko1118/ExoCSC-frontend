import React, { Component } from "react";

class Browse extends Component {
  render() {
    return (
      <div style={styles.wrapper}>
        <h2 style={styles.header}>ExCSC Browse Table</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Tissue</th>
              <th style={styles.th}>Gene / Protein / RNA</th>
              <th style={styles.th}>Metabolite</th>
            </tr>
          </thead>
          <tbody>
            <tr style={styles.tr}>
              <td style={styles.td}><a href="http://172.16.146.196:3000/Breast" style={styles.link}>Breast</a></td>
              <td style={styles.td}><a href="http://172.16.146.196:3000/Gene" style={styles.link}>Gene</a></td>
              <td style={styles.td}><a href="http://172.16.146.196:3000/Lipid" style={styles.link}>Lipid</a></td>
            </tr>
            <tr style={styles.tr}>
              <td style={styles.td}><a href="http://172.16.146.196:3000/Lung" style={styles.link}>Lung</a></td>
              <td style={styles.td}><a href="http://172.16.146.196:3000/Protein" style={styles.link}>Protein</a></td>
              <td style={styles.td}></td>
            </tr>
            <tr style={styles.tr}>
              <td style={styles.td}><a href="http://172.16.146.196:3000/Colon" style={styles.link}>Colon</a></td>
              <td style={styles.td}><a href="http://172.16.146.196:3000/miRNA" style={styles.link}>miRNA</a></td>
              <td style={styles.td}></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    width: '95%',
    maxWidth: '900px',
    margin: '30px auto',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
  },
  header: {
    textAlign: 'center',
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  th: {
    backgroundColor: '#2e3e93',
    color: '#fff',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  tr: {
    transition: 'background 0.3s',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  link: {
    color: '#2e3e93',
    fontWeight: 'bold',
    textDecoration: 'none',
  }
};

export default Browse;
