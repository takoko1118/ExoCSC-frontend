import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I am ExCSC Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (textToSend) => {
    const messageText = typeof textToSend === 'string' ? textToSend : input;
    if (!messageText.trim()) return;

    console.log("Sending message:", messageText);

    // 顯示使用者訊息
    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setInput("");

    try {
      const response = await axios.post('http://db.cmdm.tw:8000/api/chatbot/', {
        message: messageText
      });

      let botReply = response.data.reply;
      const results = response.data.results || [];

      // 1️⃣ 單基因查詢 (e.g., PC3)
      if (results.length === 1 && messageText.toLowerCase() === results[0].id.toLowerCase()) {
        const gene = results[0];
        const detailUrl = `/search/table/${gene.molecularType.charAt(0).toUpperCase() + gene.molecularType.slice(1)}/${gene.id}/`;
        botReply = `🧬 Gene Found: ${gene.id}\nDetected in ${gene.tissue} (${gene.cellType}).\n\n👉 [View Detailed Analysis](${detailUrl})`;
        if (gene.pmcid) {
          botReply += `\n🔗 Reference (PMCID: ${gene.pmcid})`;
        }
      }

      // 2️⃣ Tissue / molecularType 查詢 (e.g., lung gene)
      else if (results.length > 0) {
        const topResults = results.slice(0, 3); // 前三筆
        const resultsMarkdown = topResults.map(item => {
          const url = `/search/table/${item.molecularType.charAt(0).toUpperCase() + item.molecularType.slice(1)}/${item.id}/`;
          return `- [${item.entrezName || item.id}](${url})`;
        }).join("\n");

        const firstItem = results[0];
        const allUrl = `/search/table/${firstItem.molecularType.charAt(0).toUpperCase() + firstItem.molecularType.slice(1)}/?tissue=${firstItem.tissue}${firstItem.cellType ? `&cellType=${firstItem.cellType}` : ''}`;

        botReply = `🫁 ${messageText.charAt(0).toUpperCase() + messageText.slice(1)} data available\n\n${resultsMarkdown}\n\n👉 View all results [here](${allUrl})`;
      }

      // 3️⃣ 無結果
      else {
        botReply = response.data.reply || "No data found.";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Connection failed. Please check if the backend server is running." }]);
    }
  };

  return (
    <div style={styles.outerWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>ExCSC Chatbot</div>
        <div style={styles.msgBox}>
          {messages.map((m, i) => (
            <div key={i} style={{
              ...styles.msg,
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? '#DCF8C6' : '#EAEAEA'
            }}>
              {m.role === 'bot' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => {
                      const isInternal = href.startsWith('/');
                      if (isInternal) {
                        return <Link to={href} style={styles.markdownLink}>{children}</Link>;
                      }
                      return <a href={href} target="_blank" rel="noopener noreferrer" style={styles.markdownLink}>{children}</a>;
                    },
                    p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              ) : (
                m.text
              )}
            </div>
          ))}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </div>

        <div style={styles.inputArea}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about cancer stem cells..."
          />
          <button style={styles.button} onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerWrapper: { width: '100%', maxWidth: '850px', margin: '20px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  container: { width: '100%', height: '400px', backgroundColor: 'white', border: '2px solid #2e3e93', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 20px rgba(0,0,0,0.12)', overflow: 'hidden' },
  header: { padding: '12px', backgroundColor: '#2e3e93', color: 'white', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' },
  msgBox: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  msg: { margin: '8px', padding: '10px 16px', borderRadius: '18px', maxWidth: '85%', fontSize: '16px', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  markdownLink: { color: '#2e3e93', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' },
  inputArea: { display: 'flex', borderTop: '1px solid #eee', padding: '15px', backgroundColor: '#fafafa' },
  input: { flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '10px 15px', fontSize: '15px' },
  button: { marginLeft: '12px', backgroundColor: '#2e3e93', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }
};

export default Chatbot;
