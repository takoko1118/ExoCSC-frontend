import React, { useRef, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { Typography, Link, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import './Landing.css'
import { Section, SubSection, SubSubSection } from "./components/Sections";
import { DescriptionButton } from "./components/Buttons";
import { Strong } from "./components/Utilies";
import { subscribe_link } from "./Data";
import YouTube from 'react-youtube';
import { Title } from "./components/Titles";
import { HashLink } from "react-router-hash-link";


import { CancerType, Content } from './components/Button';
import 'semantic-ui-css/semantic.min.css';
import { Button, Dropdown,Menu } from 'semantic-ui-react';
import Chatbot from './components/Chatbot'; // 🚀 1. 引入組件

export default function Landing(props) {
    const theme = useTheme();
    const ref = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(ref.current.offsetWidth)
    }, []);

    const videoWidth = Math.min(width, 700)
    const opts = {
        height: videoWidth / 1920 * 1080,
        width: videoWidth,
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    return (
        <Box ref={ref} margin={theme.spacing(0, 0, 8)}>
            <Box margin={theme.spacing(8, "auto", 1)}>
                <img src="ExoCSC-logo.png" style={{width: "40%", textAlign: "left"}} />
            </Box>
            <Box margin={theme.spacing(1, "auto", 6)}>
                <Typography
                    variant={
                        useMediaQuery(theme.breakpoints.up("sm")) ? "h4" : "h5"
                    }
                    color="textPrimary"
                >
                    <h3>Cancer Stem cell exosome Database</h3>
                </Typography>
            </Box>
            <Box margin={theme.spacing(1, "auto", 6)}>
                <CancerType/>
            </Box>
            <Box margin={theme.spacing(1, "auto", 6)}>
                <Content/>
            </Box>
            {/* 🚀 2. 在 Content 之後，Introduction 之前插入機器人 */}
            <Box margin={theme.spacing(2, "auto")}>
                <Chatbot />
            </Box>
            
            <Box maxWidth={800} margin={theme.spacing(1, "auto", 6)}>
                <Typography variant="h6" color="textPrimary">
                    
                    <Title title="Introduction of ExoCSC"/>
                </Typography>
                <span align="left">
                
                </span>
            </Box>
            
            <Box maxWidth={800} margin="auto" textAlign="left">
                <SubSection>
                    <SubSubSection>
                        <Typography
                            component={"span"}
                            variant="body1"
                            color="textSecondary"
                        >
                            
                            <div
                                style={{
                                    width: "fit-content",
                                    margin: "auto",
                                    textAlign: "left",
                                }}
                            >
                                
                            </div>
                        </Typography>
                    </SubSubSection>
                    
                    <SubSubSection>
                        <Typography variant="body1" color="textSecondary">
                        ExoCSC provides information of exosomal proteins, RNA, lipids, 
                        and metabolites in CSC and cancer cell using text-mining. 
                        It collected published literatures including lung, breast 
                        and colon tissue type from PubMed.
                        </Typography>
                        
                    </SubSubSection>
                    <SubSubSection>
                    <Typography variant="h6" color="textPrimary">
                   
                    <Typography variant="body1" color="textSecondary">
                            
                            The ExCSC database collected 4115 literatures, 
                            3862 genes, 4117 protein, 1703 metabolites in 
                            cancer cell exosome, also 434 literatures, 
                            180 genes, 233 protein, 499 metabolites in 
                            cancer stem cell exosome.
                            

                        </Typography>
                        <div class="STATISTICS">Statistics</div>
            <ul>
  <li className="Landing"><span className="item">Cancer stem cell</span><span class="number">6,450</span></li>
  <li className="Landing"><span className="item">Cancer cell</span><span class="number">3,332</span></li>
  <li className="Landing"><span clasNames="item">Genes</span><span class="number">7,826</span></li>
  <li className="Landing"><span className="item">Proteins</span><span class="number">1,852</span></li>
  <li className="Landing"><span className="item">mRNAs</span><span class="number">279</span></li>
  <li className="Landing"><span className="item">Lipids</span><span class="number">87</span></li>
</ul>
                </Typography>
                                
                        
                    </SubSubSection>
                </SubSection>
                
                



                <SubSection>
                    <Grid container justify="space-evenly" spacing={0}>
                        {[
                            ["ntu-logo.png", "https://www.ntu.edu.tw/"],
                            ["CMDM-Lab.png", "https://www.cmdm.tw/"],
                          
                        ].map((filename) => {
                            return (
                                <Grid item xs={6} sm={4} md={4} key={filename[0]}>
                                    <a target="_blank" href={filename[1]}>
                                        <img src={filename[0]} width="100%" />
                                    </a>
                                </Grid>
                            );
                        })}
                    </Grid>
                </SubSection>
                
            </Box>
        </Box>
    );
}
