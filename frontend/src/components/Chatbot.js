// src/components/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    console.log("🚀 Chatbot 組件已成功執行渲染！"); // 加這一行
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        // 1. 將使用者訊息顯示在畫面上
        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput(""); // 清空輸入框

        try {
            // 2. 呼叫 Django API (注意：React 跑在瀏覽器，用 localhost)
            const response = await axios.post('http://db.cmdm.tw:8000/api/chatbot/', {
                message: currentInput
            });

            // 3. 將 Django 的回覆顯示在畫面上
            const botMsg = { role: 'bot', text: response.data.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: "連線失敗，請檢查後端是否開啟。" }]);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>ExCSC Chatbot</div>
            <div style={styles.msgBox}>
                {messages.map((m, i) => (
                    <div key={i} style={{ ...styles.msg, alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#DCF8C6' : '#EAEAEA' }}>
                        {m.text}
                    </div>
                ))}
            </div>
            <div style={styles.inputArea}>
                <input style={styles.input} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
                <button style={styles.button} onClick={sendMessage}>送出</button>
            </div>
        </div>
    );
};

const styles = {
    container: { 
        position: 'relative', 
        width: '100%',          // 改為 100% 或適合容器的寬度
        maxWidth: '700px',      // 限制最大寬度，避免在寬螢幕太醜
        margin: '20px auto',    // 居中
        height: '200px', 
        backgroundColor: 'white', 
        border: '2px solid #4c7da0',
        borderRadius: '10px', 
        display: 'flex', 
        flexDirection: 'column', 
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)', 
        margin: '0 auto',       // 水平置中
        zoom: 0.6 },
    header: { padding: '10px', backgroundColor: '#4c7da0', color: 'white', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', fontWeight: 'bold' },
    msgBox: { flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
    msg: { margin: '5px', padding: '8px 12px', borderRadius: '15px', maxWidth: '80%', fontSize: '14px', whiteSpace: 'pre-wrap', 
        wordBreak: 'break-word' },
    inputArea: { display: 'flex', borderTop: '1px solid #ddd', padding: '10px' },
    input: { flex: 1, border: '1px solid #ddd', borderRadius: '5px', padding: '5px' },
    button: { marginLeft: '5px', backgroundColor: '#4c7da0', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }
    
};

export default Chatbot;