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
                            Cancer Stem cell exosome Database
                        </Typography>
                    </Box>

                    <Box margin={theme.spacing(4, "auto", 0)}>
                        <Typography 
                            variant="body2" 
                            style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}
                        >
                            Browse Content Type
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
                
                <Box style={{ marginTop: '40px', marginBottom: '60px' }}>
                    <RAGChatbot/>
                    {/* <Chatbot /> */}
                </Box>
                
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
                            <li className="Landing"><span className="item">Cancer stem cell</span><span className="number">6,450</span></li>
                            <li className="Landing"><span className="item">Cancer cell</span><span className="number">3,332</span></li>
                            <li className="Landing"><span className="item">Genes</span><span className="number">7,826</span></li>
                            <li className="Landing"><span className="item">Proteins</span><span className="number">1,852</span></li>
                            <li className="Landing"><span className="item">mRNAs</span><span className="number">279</span></li>
                            <li className="Landing"><span className="item">Lipids</span><span className="number">87</span></li>
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