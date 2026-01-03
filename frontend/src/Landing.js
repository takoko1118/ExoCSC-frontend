import React, { useRef, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { Typography, Grid } from "@material-ui/core";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import './Landing.css'
import { SubSection, SubSubSection } from "./components/Sections";
import { Title } from "./components/Titles";
import { CancerType, Content } from './components/Button';
import 'semantic-ui-css/semantic.min.css';
import Chatbot from './components/Chatbot';

// 🚀 置中容器樣式
const useStyles = makeStyles((theme) => ({
    centeredWrapper: {
        width: "85%",
        maxWidth: 900,
        margin: "0 auto",
        // 注意：這裡不設定 textAlign: "left"，讓各個區塊自行決定對齊
    },
    introTitleBox: {
        textAlign: "center", // 🚀 強制讓 Introduction 標題置中
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(4),
    }
}));

export default function Landing(props) {
    const classes = useStyles();
    const theme = useTheme();
    const ref = useRef(null);

    // 星空背景樣式 (100% 寬度)
    const heroSectionStyle = {
        backgroundImage: 'url("https://img.freepik.com/free-photo/night-sky-glows-with-iridescent-starry-nebula-generated-by-ai_188544-15577.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white',
        width: '100%',
        display: 'block',
    };

    return (
        <Box ref={ref} style={{ width: '100%', overflowX: 'hidden' }}>
            
            {/* 1. 星空背景區域 (左右全覆蓋) */}
            <div style={heroSectionStyle}>
                <Box margin={theme.spacing(0, "auto", 0)}>
                    <Typography 
                        variant="h2" 
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
                        variant={useMediaQuery(theme.breakpoints.up("sm")) ? "h5" : "body1"}
                        style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '300' }}
                    >
                        Cancer Stem cell exosome Database
                    </Typography>
                </Box>

                <Box margin={theme.spacing(4, "auto", 0)}>
                    <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Browse Content Type
                    </Typography>
                    <Grid container justify="center" spacing={3}>
                        <Grid item><CancerType /></Grid>
                        <Grid item><Content /></Grid>
                    </Grid>
                </Box>
            </div>

            {/* 2. 下方內容區域 (Chatbot 在背景下方，置中顯示) */}
            <div className={classes.centeredWrapper}>
                
                <Box style={{ marginTop: '40px', marginBottom: '60px' }}>
                    <Chatbot />
                </Box>
                
                {/* 🚀 Introduction 標題區域 (置中) */}
                <Box className={classes.introTitleBox}>
                    <Typography variant="h6" color="textPrimary">
                        <Title title="Introduction of ExoCSC"/>
                    </Typography>
                </Box>

                {/* 🚀 Introduction 內容區域 (文字靠左) */}
                <SubSection>
                    <SubSubSection>
                        <Typography variant="body1" color="textSecondary" style={{ textAlign: 'left' }}>
                            ExoCSC provides information of exosomal proteins, RNA, lipids, 
                            and metabolites in CSC and cancer cell using text-mining. 
                            It collected published literatures including lung, breast 
                            and colon tissue type from PubMed.
                        </Typography>
                    </SubSubSection>
                    
                    <SubSubSection>
                        <Typography variant="body1" color="textSecondary" style={{ textAlign: 'left', marginTop: '20px' }}>
                            The ExCSC database collected 4115 literatures, 
                            3862 genes, 4117 protein, 1703 metabolites in 
                            cancer cell exosome, also 434 literatures, 
                            180 genes, 233 protein, 499 metabolites in 
                            cancer stem cell exosome.
                        </Typography>
                        
                        {/* Statistics (靠左或置中，根據您的 Landing.css) */}
                        <div className="STATISTICS">Statistics</div>
                        <ul style={{ padding: 0, textAlign: 'center' }}>
                            <li className="Landing"><span className="item">Cancer stem cell</span><span className="number">6,450</span></li>
                            <li className="Landing"><span className="item">Cancer cell</span><span className="number">3,332</span></li>
                            <li className="Landing"><span className="item">Genes</span><span className="number">7,826</span></li>
                            <li className="Landing"><span className="item">Proteins</span><span className="number">1,852</span></li>
                            <li className="Landing"><span className="item">mRNAs</span><span className="number">279</span></li>
                            <li className="Landing"><span className="item">Lipids</span><span className="number">87</span></li>
                        </ul>
                    </SubSubSection>
                </SubSection>

                {/* Logo 牆 */}
                <SubSection>
                    <Grid container justify="space-evenly" alignItems="center" spacing={4} style={{ marginTop: '40px', marginBottom: '80px' }}>
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
                        // 🚀 1. 調整大小：針對 CMDM 設定較大的寬度，NTU 設定較小
                        width: item.type === "cmdm" ? "120%" : "30%", 
                        maxWidth: item.type === "cmdm" ? "280px" : "200px",
                        
                        // 🚀 2. 融入背景：移除白底色差
                        // multiply 會將白色變透明，保留深色部分
                        mixBlendMode: "multiply", 
                        
                        // 🚀 3. 視覺優化：如果背景太暗導致 Logo 不清晰，可稍微增加亮度
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