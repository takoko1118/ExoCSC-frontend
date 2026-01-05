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

    const userMsg = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
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

  // 處理 Markdown 內連結：支援內部路由 / gene / rna / protein / lipid
  const renderMarkdownLink = (href, children) => {
    const isInternal = href.startsWith('/');
    if (isInternal) {
      // 根據 pattern 自動修正內部 domain
      const match = href.match(/\/(gene|rna|protein|lipid)\/(\d+)/i);
      if (match) {
        const type = match[1].toLowerCase();
        const id = match[2];
        return (
          <a href={`http://db.cmdm.tw:13007/${type}/${id}`} target="_blank" rel="noopener noreferrer" style={styles.markdownLink}>
            {children}
          </a>
        );
      }
      // 其他內部路由使用 react-router Link
      return <Link to={href} style={styles.markdownLink}>{children}</Link>;
    }
    return <a href={href} target="_blank" rel="noopener noreferrer" style={styles.markdownLink}>{children}</a>;
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
                    a: ({ href, children }) => renderMarkdownLink(href, children),
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
