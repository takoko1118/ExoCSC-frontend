import React, { useRef } from "react";
import Box from "@material-ui/core/Box";
import { Typography, Grid, Paper, Divider } from "@material-ui/core";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import './Landing.css'; 
import { SubSection, SubSubSection } from "./components/Sections";
import { Title } from "./components/Titles";
import { CancerType, Content } from './components/Button';
import 'semantic-ui-css/semantic.min.css';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    mainWrapper: { width: '100%', margin: 0, padding: 0 },
    centeredWrapper: {
        width: "85%",
        maxWidth: 1000, 
        margin: "0 auto",
        textAlign: "left",
    },
    introTitleBox: {
        textAlign: "center",
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(4),
    },
    // 專業統計卡片樣式
    statCard: {
        padding: theme.spacing(3),
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderTop: '4px solid #2e3e93',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'translateY(-5px)' }
    },
    // Overview 區塊邊框
    pipelineBox: {
        background: '#f8f9fa',
        padding: theme.spacing(3),
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
    }
}));

export default function Landing(props) {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const ref = useRef(null);

    // 定義核心統計數據
    const coreStats = [
        { label: "Literatures", value: "21,732", color: "#2e3e93" },
        { label: "Cancer Cell Genes", value: "3,862", color: "#1976d2" },
        { label: "CSC Genes", value: "180", color: "#d32f2f" },
        { label: "Total Proteins", value: "4,350", color: "#388e3c" }
    ];

    return (
        <Box ref={ref} className={classes.mainWrapper}>
            
            {/* 🚀 第一部分：星空背景 (保留原本設計) */}
            <div className="hero-background-section">
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
                            style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '700' }}
                        >
                            Cancer Stem Cell Exosomal Markers Database
                        </Typography>
                    </Box>

                    <Box margin={theme.spacing(4, "auto", 0)}>
                        <Grid container justifyContent="center" spacing={5}>
                            <Grid item><CancerType /></Grid>
                            <Grid item><Content /></Grid>
                        </Grid>
                    </Box>
                </div>
            </div>

            {/* 🚀 第二部分：下方專業佈局內容 */}
            <div className={classes.centeredWrapper}>
                
                {/* 1. 快速統計概覽 (Stat Cards) */}
                <Box mt={8} mb={6}>
                    <Grid container spacing={3}>
                        {coreStats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Paper elevation={0} className={classes.statCard}>
                                    <Typography variant="h4" style={{ color: stat.color, fontWeight: 800 }}>{stat.value}</Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* 2. Introduction of ExoCSC */}
                <Box className={classes.introTitleBox}>
                    <Title title="Introduction of ExoCSC"/>
                </Box>

                <Grid container spacing={5} alignItems="flex-start">
                    <Grid item xs={12} md={7}>
                        <Typography variant="body1" paragraph style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                            <strong style={{ color: '#2e3e93' }}>ExoCSC</strong> is a comprehensive platform providing high-resolution information on exosomal proteins, RNA, lipids, and metabolites. 
                            Our focus is the comparison between <strong>Cancer Stem Cells (CSCs)</strong> and regular cancer cells.
                        </Typography>
                        <Typography variant="body1" color="textSecondary" style={{ lineHeight: 1.8 }}>
                            The database leverages text-mining to curate published literature across lung, breast, and colon tissue types, 
                            helping researchers identify key molecular signatures in the tumor microenvironment.
                        </Typography>
                    </Grid>

                    {/* 🚀 新增：Overview of ExoCSC (側邊卡片形式) */}
                    <Grid item xs={12} md={5}>
                        <Paper className={classes.pipelineBox} elevation={0}>
                            <Typography variant="h6" style={{ fontWeight: 800, color: '#2e3e93', marginBottom: '15px' }}>
                                Pipeline Overview
                            </Typography>
                            <Typography variant="body2" style={{ lineHeight: 1.8, color: '#555' }}>
                                • <strong>Data Source:</strong> PubMed Open Access Literatures<br/>
                                • <strong>Extraction:</strong> LLM-driven knowledge extraction<br/>
                                • <strong>Categorization:</strong> 3 Tissues / 4 Cargo Types<br/>
                                • <strong>Analysis:</strong> Cancer Cell vs. CSC Comparison
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                

                {/* 3. AI Chatbot Section (加強引導感) */}
                <Box style={{ 
                    marginTop: '80px', 
                    marginBottom: '80px', 
                    textAlign: 'center',
                    padding: '50px 40px',
                    background: '#f1f4f9',
                    borderRadius: '20px',
                    border: '1px solid #dce3f1'
                }}>
                    <Typography variant="h4" style={{ fontWeight: 800, color: '#2e3e93', marginBottom: '20px' }}>
                        ExoCSC AI Explorer
                    </Typography>
                    <Typography variant="body1" style={{ color: '#555', marginBottom: '35px', maxWidth: '750px', margin: '0 auto 35px' }}>
                        Explore 21,000+ experimental evidences through our <strong>RAG-Powered AI Agent</strong>. 
                        Instantly retrieve specific marker interactions and molecular signatures using natural language.
                    </Typography>
                    
                    <button 
                        onClick={() => history.push("/ai-agent")}
                        className="ui massive primary button"
                        style={{ backgroundColor: '#2e3e93', borderRadius: '4px', padding: '15px 50px' }}
                    >
                        <i className="magic icon"></i> Start AI Agent 
                    </button>
                </Box>

                {/* 4. Featured Markers */}
                <section className="landing-featured-section">
                    <Typography variant="h5" style={{ fontWeight: 800, marginBottom: '25px' }}>
                        Featured Markers
                    </Typography>
                    <div className="landing-card-grid">
                        {[
                            { id: 310224, cargo: 'CD44', category: 'CSC' },
                            { id: 310299, cargo: 'EGFR', category: 'Cancer' },
                            { id: 314127, cargo: 'CD133', category: 'CSC' },
                            { id: 313996, cargo: 'KRAS', category: 'Cancer' },
                            { id: 312380, cargo: 'ALDH1A1', category: 'CSC' },
                            { id: 313452, cargo: 'TP53', category: 'Cancer' },
                        ].map((item) => (
                            <Paper
                                key={item.id}
                                className="landing-card"
                                onClick={() => history.push(`/gene/${item.id}`)}
                                style={{ padding: '20px', cursor: 'pointer' }}
                                elevation={1}
                            >
                                <span className={`landing-card-category landing-card-category--${item.category.toLowerCase()}`}>
                                    {item.category}
                                </span>
                                <Typography variant="h6" style={{ fontWeight: 800, marginTop: '10px' }}>{item.cargo}</Typography>
                            </Paper>
                        ))}
                    </div>
                </section>

                {/* 5. Footer Logos */}
                <Box mt={10} mb={6} pt={4} style={{ borderTop: '1px solid #eee' }}>
                    <Grid container justifyContent="space-evenly" alignItems="center">
                        <img src="ntu-logo.png" alt="NTU" style={{ height: '45px', filter: 'grayscale(100%)', opacity: 0.6 }} />
                        <img src="CMDM-Lab.png" alt="CMDM" style={{ height: '55px', filter: 'grayscale(100%)', opacity: 0.6 }} />
                    </Grid>
                </Box>
            </div>
        </Box>
    );
}