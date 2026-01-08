import React from 'react';

const ChatbotHelp = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>ExCSC Chatbot Tutorial</h2>

      <p>Welcome! The ExCSC Chatbot allows you to explore cancer stem cell (CSC) data and molecular information easily.</p>

      <h3 style={styles.subHeader}>1. Asking Questions</h3>
      <ul>
        <li>Type a query in the input box and press <b>Enter</b> or click <b>Send</b>.</li>
        <li>Examples of queries:
          <ul>
            <li><code>lung CSC</code></li>
            <li><code>breast gene</code></li>
            <li><code>CD44</code></li>
          </ul>
        </li>
      </ul>

      <h3 style={styles.subHeader}>2. Quick Search</h3>
      <p>Below the chat input, you will see <b>Quick Search</b> buttons for common queries:</p>
      <ul>
        <li><span style={{ color: '#2e3e93' }}>Breast CSC</span></li>
        <li><span style={{ color: '#d9534f' }}>Colon CSC</span></li>
        <li><span style={{ color: '#f0ad4e' }}>Lung RNA</span></li>
        <li><span style={{ color: '#5bc0de' }}>Colon CSC Lipid</span></li>
        <li><span style={{ color: '#5cb85c' }}>PC-3</span></li>
      </ul>
      <p>Clicking a button will automatically send the query to the chatbot.</p>

      <h3 style={styles.subHeader}>3. Reading Responses</h3>
      <ul>
        <li>Bot responses display molecules grouped by type: <b>Gene, RNA, Protein, Lipid</b>.</li>
        <li>Molecule names are <b>clickable links</b> leading to detailed pages.</li>
        <li>CSC markers are indicated with a <span style={{ color: '#d9534f', fontWeight: 'bold' }}>(CSC)</span> label.</li>
        <li>Responses are limited to the first three entries for each molecular type for easy viewing.</li>
      </ul>

      <h3 style={styles.subHeader}>4. Examples</h3>
      <ul>
        <li><b>Query:</b> <code>lung CSC</code> → returns Lung cancer stem cell molecules.</li>
        <li><b>Query:</b> <code>breast gene</code> → returns first 3 genes in Breast tissue.</li>
        <li><b>Query:</b> <code>CD44</code> → returns individual molecule information if available.</li>
      </ul>

      <h3 style={styles.subHeader}>5. Notes</h3>
      <ul>
        <li>If no data is found, the bot will suggest example queries.</li>
        <li>Combination queries support tissue + CSC + molecular type, e.g., <code>Breast CSC gene</code>.</li>
        <li>Quick Search buttons provide a convenient way to query commonly used combinations.</li>
      </ul>

      <p>Enjoy exploring ExCSC data! 🧬</p>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '900px', margin: '20px auto', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 },
  header: { fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' },
  subHeader: { fontSize: '18px', fontWeight: 'bold', marginTop: '15px', marginBottom: '8px' }
};

export default ChatbotHelp;
