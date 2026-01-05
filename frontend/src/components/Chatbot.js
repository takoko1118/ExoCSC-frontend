import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const QUICK_SEARCH = [
  { label: "Breast CSC", color: "#f28b82", keyword: "Breast CSC" },
  { label: "Colon CSC", color: "#fbbc04", keyword: "Colon CSC" },
  { label: "Lung RNA", color: "#34a853", keyword: "Lung RNA" },
  { label: "Colon Lipid", color: "#4285f4", keyword: "Colon Lipid" },
  { label: "PC-3", color: "#aa47bc", keyword: "PC-3" },
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I am ExCSC Assistant. Ask me about cancer stem cells or molecules 😊" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // 自動滾動到底
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 將文字拆解 CSC 標籤渲染
  const renderMessage = (text) => {
    // 匹配 (CSC)、(cancer stem cell) 或 (CSC module)
    const regex = /\((CSC|cancer stem cell|CSC module)\)/gi;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <span key={match.index} style={{ color:'#d9534f', fontWeight:'bold' }}>
          {match[0]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    // 處理 [name](url) 連結
    return parts.map((p, idx) => {
      if (typeof p === 'string') {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const subParts = [];
        let last = 0;
        let m;
        while ((m = linkRegex.exec(p)) !== null) {
          if (m.index > last) subParts.push(p.slice(last, m.index));
          const href = m[2];
          const isInternal = href.startsWith('/');
          subParts.push(
            <a
              key={`${idx}-${m.index}`}
              href={href}
              target={isInternal ? "_self" : "_blank"}
              rel={isInternal ? undefined : "noopener noreferrer"}
              style={{ color:'#2e3e93', fontWeight:'bold', textDecoration:'underline' }}
            >
              {m[1]}
            </a>
          );
          last = m.index + m[0].length;
        }
        if (last < p.length) subParts.push(p.slice(last));
        return <React.Fragment key={idx}>{subParts}</React.Fragment>;
      } else {
        return p;
      }
    });
  };

  // 發送訊息
  const sendMessage = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setInput("");

    try {
      const response = await axios.post('http://db.cmdm.tw:8000/api/chatbot/', {
        message: messageText
      });

      const botReply = response.data.reply || "No response from server.";
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
              {m.role === 'bot' ? renderMessage(m.text) : m.text}
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
            placeholder="Ask something (e.g. 'lung CSC', 'breast gene', 'CD44')"
          />
          <button style={styles.button} onClick={() => sendMessage()}>Send</button>
        </div>

        {/* Quick Search */}
        <div style={{ display:'flex', alignItems:'center', padding:'10px', flexWrap:'wrap', gap:'10px' }}>
          <span style={{ marginRight:'8px', fontWeight:'bold' }}>Quick Search:</span>
          {QUICK_SEARCH.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(btn.keyword)}
              style={{
                backgroundColor: btn.color,
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerWrapper: { width: '100%', maxWidth: '850px', margin: '20px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  container: { width: '100%', height: '500px', backgroundColor: 'white', border: '2px solid #2e3e93', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 20px rgba(0,0,0,0.12)', overflow: 'hidden' },
  header: { padding: '12px', backgroundColor: '#2e3e93', color: 'white', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' },
  msgBox: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  msg: { margin: '8px', padding: '10px 16px', borderRadius: '18px', maxWidth: '85%', fontSize: '16px', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  inputArea: { display: 'flex', borderTop: '1px solid #eee', padding: '15px', backgroundColor: '#fafafa' },
  input: { flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '10px 15px', fontSize: '15px' },
  button: { marginLeft: '12px', backgroundColor: '#2e3e93', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }
};

export default Chatbot;
