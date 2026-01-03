// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    // 固定關鍵字
    const keywords = ["Breast", "Lung", "CD44"];

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
                behavior: "smooth", 
                block: "nearest" 
            });
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
            const botMsg = { role: 'bot', text: response.data.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: "連線失敗，請檢查後端是否開啟。" }]);
        }
    };

    return (
        <div style={styles.outerWrapper}>
            
            {/* 1. Chatbot 主體 */}
            <div style={styles.container}>
                <div style={styles.header}>ExCSC Chatbot</div>
                <div style={styles.msgBox}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ 
                            ...styles.msg, 
                            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', 
                            background: m.role === 'user' ? '#DCF8C6' : '#EAEAEA' 
                        }}>
                            {m.text}
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
                    <button style={styles.button} onClick={sendMessage}>送出</button>
                </div>
            </div>

            {/* 🚀 2. Quick Search 區域 (修改為水平平行排列) */}
            <div style={styles.keywordArea}>
                <span style={styles.keywordLabel}>Quick Search:</span>
                <div style={styles.btnGroup}>
                    {keywords.map((word, index) => (
                        <button 
                            key={index} 
                            style={styles.keywordBtn} 
                            onClick={() => sendMessage(word)}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#4c7da0';
                                e.target.style.color = '#fff';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#f1f1f1';
                                e.target.style.color = '#4c7da0';
                            }}
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    outerWrapper: {
        width: '100%',
        maxWidth: '700px',
        margin: '20px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zoom: 0.6
    },
    container: { 
        width: '100%',
        height: '400px', 
        backgroundColor: 'white', 
        border: '2px solid #4c7da0',
        borderRadius: '10px', 
        display: 'flex', 
        flexDirection: 'column', 
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)', 
        overflow: 'hidden'
    },
    header: { padding: '10px', backgroundColor: '#4c7da0', color: 'white', fontWeight: 'bold', textAlign: 'center' },
    msgBox: { flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
    msg: { margin: '5px', padding: '8px 12px', borderRadius: '15px', maxWidth: '80%', fontSize: '14px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
    
    /* 🚀 關鍵字區域：水平平行排列佈局 */
    keywordArea: {
        display: 'flex',
        flexDirection: 'row',     // 確保標籤與按鈕在同一行
        alignItems: 'center',
        justifyContent: 'center', 
        marginTop: '15px',
        width: '100%'
    },
    keywordLabel: {
        fontSize: '14px',
        color: '#666',
        fontWeight: 'bold',
        marginRight: '10px',
        whiteSpace: 'nowrap'      // 防止 "Quick Search" 字樣換行
    },
    btnGroup: {
        display: 'flex',
        flexDirection: 'row',     // 按鈕彼此平行
        gap: '8px'                // 按鈕之間的間距
    },
    keywordBtn: {
        padding: '6px 15px',
        fontSize: '12px',
        backgroundColor: '#f1f1f1',
        border: '1px solid #4c7da0',
        borderRadius: '15px',
        color: '#4c7da0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontWeight: '500',
        whiteSpace: 'nowrap'      // 防止按鈕內文字換行
    },

    inputArea: { display: 'flex', borderTop: '1px solid #ddd', padding: '10px' },
    input: { flex: 1, border: '1px solid #ddd', borderRadius: '5px', padding: '8px' },
    button: { marginLeft: '8px', backgroundColor: '#4c7da0', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 15px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Chatbot;