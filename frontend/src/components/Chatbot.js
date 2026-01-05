import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const QUICK_SEARCH = [
  { label: 'Breast CSC', value: 'Breast CSC', color: '#2e3e93' },
  { label: 'Colon CSC', value: 'Colon CSC', color: '#d9534f' },
  { label: 'Lung RNA', value: 'Lung RNA', color: '#f0ad4e' },
  { label: 'Colon CSC Lipid', value: 'Colon CSC Lipid', color: '#5bc0de' },
  { label: 'PC-3', value: 'PC-3', color: '#5cb85c' },
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I am ExCSC Assistant. Ask me about cancer stem cells or molecules 😊" }
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
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    // 使用者訊息
    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setInput("");

    try {
      const response = await axios.post('http://db.cmdm.tw:8000/api/chatbot/', {
        message: messageText
      });

      let botReply = response.data.reply || "No response from server.";

      // 將 [name] [url] 格式轉成可點擊連結，並保留 (CSC) 顏色
      const parts = botReply.split('\n').map((line, idx) => {
        const match = line.match(/^-?\s*([^\s\[\]]+)\s*(\(CSC\))?\s*\[?(https?:\/\/[^\]]+)?\]?$/);
        if (match) {
          const [, name, cscTag, url] = match;
          return (
            <div key={idx} style={{ margin: '2px 0' }}>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: '#2e3e93', textDecoration: 'underline' }}>
                {name}
              </a>
              {cscTag && <span style={{ color: '#d9534f', fontWeight: 'bold' }}> {cscTag}</span>}
            </div>
          );
        } else {
          return <div key={idx}>{line}</div>;
        }
      });

      setMessages(prev => [...prev, { role: 'bot', text: parts }]);
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
            <div
              key={i}
              style={{
                ...styles.msg,
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? '#DCF8C6' : '#EAEAEA'
              }}
            >
              {m.role === 'bot' ? m.text : m.text}
            </div>
          ))}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </div>

        <div style={{ padding: '10px' }}>
          <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Quick Search:</span>
          {QUICK_SEARCH.map((btn, idx) => (
            <button
              key={idx}
              style={{
                backgroundColor: btn.color,
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 15px',
                marginRight: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onClick={() => sendMessage(btn.value)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div style={styles.inputArea}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask something (e.g. 'lung CSC', 'breast gene', 'CD44')"
          />
          <button style={styles.button} onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerWrapper: { width: '100%', maxWidth: '900px', margin: '20px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  container: { width: '100%', height: '550px', backgroundColor: 'white', border: '2px solid #2e3e93', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 20px rgba(0,0,0,0.12)', overflow: 'hidden' },
  header: { padding: '12px', backgroundColor: '#2e3e93', color: 'white', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' },
  msgBox: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  msg: { margin: '8px', padding: '10px 16px', borderRadius: '18px', maxWidth: '85%', fontSize: '16px', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  inputArea: { display: 'flex', borderTop: '1px solid #eee', padding: '15px', backgroundColor: '#fafafa' },
  input: { flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '10px 15px', fontSize: '15px' },
  button: { marginLeft: '12px', backgroundColor: '#2e3e93', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }
};

export default Chatbot;
