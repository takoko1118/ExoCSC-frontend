import React, { useRef } from "react";
import Box from "@material-ui/core/Box";
import { Typography, Grid } from "@material-ui/core";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import './Landing.css'; 
import { SubSection, SubSubSection } from "./components/Sections";
import { Title } from "./components/Titles";
import { CancerType, Content } from './components/Button';
import 'semantic-ui-css/semantic.min.css';
import Chatbot from './components/Chatbot';
import RAGChatbot from "./components/RAGChatbot";
import { useHistory } from "react-router-dom"; // 假設你使用 react-router
const useStyles = makeStyles((theme) => ({
    mainWrapper: {
        width: '100%',
        margin: 0,
        padding: 0,
    },
    // 🚀 控制內容置中在 900px 的容器
    centeredWrapper: {
        width: "85%",
        maxWidth: 900,
        margin: "0 auto",
        textAlign: "left", // 保持文字靠左排版
    },
    introTitleBox: {
        textAlign: "center",
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(4),
    }
}));

export default function Landing(props) {
    const classes = useStyles();
    const history = useHistory(); // 用於跳轉頁面
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const ref = useRef(null);

    return (
        <Box ref={ref} className={classes.mainWrapper}>
            
            {/* 🚀 第一部分：星空背景 (這部分會自動橫跨 100% 寬度) */}
            <div className="hero-background-section">
                {/* 內部文字依然需要一個容器來對齊下方內容 */}
                <div className={classes.centeredWrapper} style={{ textAlign: 'center' }}>
                    <Box margin={theme.spacing(0, "auto", 0)}>
                        <Typography 
                            variant={isMobile ? "h3" : "h2"} 
                            style={{ 
                                fontWeight: '800', 
                                letterSpacing: '2px', 
                                color: 'white',
                                textShadow: '0 0 20px rgba(255,255,255,0.8)' 
                            }}
                        >
                            ExoCSC
                        </Typography>
                    </Box>
                    
                    <Box margin={theme.spacing(1, "auto", 4)}>
                        <Typography
                            variant={isMobile ? "body1" : "h5"}
                            style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '300' }}
                        >
                            Cancer Stem Cell Exosomal Markers Database
                        </Typography>
                    </Box>

                    <Box margin={theme.spacing(4, "auto", 0)}>
                        <Typography 
                            variant="body2" 
                            style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}
                        >
                            {/* Browse Content Type */}
                        </Typography>
                        <Grid container justifyContent="center" spacing={5}>
                            <Grid item><CancerType /></Grid>
                            <Grid item><Content /></Grid>
                        </Grid>
                    </Box>
                </div>
            </div>

            {/* 🚀 第二部分：下方白色內容區塊 (置中排版) */}
            <div className={classes.centeredWrapper}>
                
               {/* 🚀 修改重點：將原 RAGChatbot 換成 AI Agent 入口按鈕 */}
                <Box style={{ 
                    marginTop: '60px', 
                    marginBottom: '80px', 
                    textAlign: 'center',
                    padding: '40px',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="h4" style={{ fontWeight: 700, color: '#2e3e93', marginBottom: '20px' }}>
                        ExoCSC Chatbot
                    </Typography>
                    <Typography variant="body1" style={{ color: '#555', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
                    Exploration AI: RAG-Powered Marker Discovery Navigate 21,000+ articles via text-mining to instantly identify cancer and CSC-specific exosomal markers and their molecular signatures.
                    </Typography>
                    
                    <button 
                        onClick={() => history.push("/ai-agent")} // 跳轉至新路由
                        className="ui massive primary button"
                        style={{ 
                            backgroundColor: '#2e3e93', 
                            borderRadius: '30px',
                            padding: '15px 40px',
                            fontSize: '1.2rem',
                            transition: 'transform 0.3s'
                        }}
                    >
                        <i className="magic icon"></i> Start 
                    </button>
                </Box>

                {/* 精選分子卡片區塊（Chatbot 下方） */}
                <section className="landing-featured-section">
                    <Typography variant="h5" className="landing-featured-title">
                        Featured Markers
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="landing-featured-subtitle">
                        Exosomal markers in cancer and cancer stem cells
                    </Typography>
                    <div className="landing-card-grid">
                        {[
                            { id: 310224, cargo: 'CD44', entrezName: 'CD44 molecule', category: 'CSC' },
                            { id: 310299, cargo: 'EGFR', entrezName: 'epidermal growth factor receptor', category: 'Cancer' },
                            { id: 314127, cargo: 'CD133', entrezName: 'prominin 1', category: 'CSC' },
                            { id: 313996, cargo: 'KRAS', entrezName: 'KRAS proto-oncogene', category: 'Cancer' },
                            { id: 312380, cargo: 'ALDH1A1', entrezName: 'aldehyde dehydrogenase 1 family member A1', category: 'CSC' },
                            { id: 313452, cargo: 'TP53', entrezName: 'tumor protein p53', category: 'Cancer' },
                        ].map((item) => (
                            <article
                                key={item.id}
                                className="landing-card"
                                onClick={() => history.push(`/gene/${item.id}`)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && history.push(`/gene/${item.id}`)}
                            >
                                <span className={`landing-card-category landing-card-category--${item.category.toLowerCase()}`}>
                                    {item.category}
                                </span>
                                <h3 className="landing-card-cargo">{item.cargo}</h3>
                                <p className="landing-card-entrez">{item.entrezName}</p>
                            </article>
                        ))}
                    </div>
                </section>
                
                <Box className={classes.introTitleBox}>
                    <Title title="Introduction of ExoCSC"/>
                </Box>

                <SubSection>
                    <SubSubSection>
                        <Typography variant="body1" color="textSecondary" style={{ lineHeight: 1.6 }}>
                            ExoCSC provides information of exosomal proteins, RNA, lipids, 
                            and metabolites in CSC and cancer cell using text-mining. 
                            It collected published literatures including lung, breast 
                            and colon tissue type from PubMed.
                        </Typography>
                    </SubSubSection>
                    
                    <SubSubSection>
                        <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px', lineHeight: 1.6 }}>
                            The ExCSC database collected 4115 literatures, 
                            3862 genes, 4117 protein, 1703 metabolites in 
                            cancer cell exosome, also 434 literatures, 
                            180 genes, 233 protein, 499 metabolites in 
                            cancer stem cell exosome.
                        </Typography>
                        
                        <div className="STATISTICS">Statistics</div>
                        <ul className="stats-list">
                            <li className="Landing"><span className="item">Cancer cell</span><span className="number">4,864</span></li>
                            <li className="Landing"><span className="item">Genes</span><span className="number">4,864</span></li>
                            <li className="Landing"><span className="item">Proteins</span><span className="number">6,784</span></li>
                            <li className="Landing"><span className="item">miRNAs</span><span className="number">1,503</span></li>
                            <li className="Landing"><span className="item">Lipids</span><span className="number">29</span></li>
                            
                            <li className="Landing"><span className="item">Total</span><span className="number">21,732</span></li>
                            <li className="Landing"><span className="item">Cancer stem cell</span><span className="number">107</span></li>
                            <li className="Landing"><span className="item">CSC Genes</span><span className="number">166</span></li>
                            <li className="Landing"><span className="item">CSC Proteins</span><span className="number">22</span></li>
                            <li className="Landing"><span className="item">CSC miRNAs</span><span className="number">1</span></li>
                            <li className="Landing"><span className="item">CSC Lipids</span><span className="number">1</span></li>
                            <li className="Landing"><span className="item">Total</span><span className="number">21,732</span></li>
                            <li className="Landing"><span className="item">Literatures</span><span className="number">21732</span></li>
                        </ul>
                    </SubSubSection>
                </SubSection>

                <SubSection>
                    <Grid container justifyContent="space-evenly" alignItems="center" spacing={4} style={{ marginTop: '40px', marginBottom: '80px' }}>
                        {[
                            { src: "ntu-logo.png", url: "https://www.ntu.edu.tw/", type: "ntu" },
                            { src: "CMDM-Lab.png", url: "https://www.cmdm.tw/", type: "cmdm" },
                        ].map((item) => (
                            <Grid item xs={6} sm={4} md={4} key={item.src} style={{ textAlign: 'center' }}>
                                <a target="_blank" rel="noopener noreferrer" href={item.url}>
                                    <img 
                                        src={item.src} 
                                        alt="Logo" 
                                        style={{ 
                                            width: item.type === "cmdm" ? "120%" : "30%", 
                                            maxWidth: item.type === "cmdm" ? "280px" : "200px",
                                            mixBlendMode: "multiply", 
                                            filter: "contrast(1.1) brightness(1.1)", 
                                            display: "inline-block",
                                            verticalAlign: "middle"
                                        }} 
                                    />
                                </a>
                            </Grid>
                        ))}
                    </Grid>

                </SubSection>
            </div>
        </Box>
    );
}