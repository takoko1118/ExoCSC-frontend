import "./App.css";
import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {
    ThemeProvider,
    makeStyles,
    createTheme,
} from "@material-ui/core/styles";

import Homepage from "./Homepage";
import ChatbotHelp from "./ChatbotHelp"
import Browse from "./Browse";

import ALLTable from "./Table/ALLTable";
import LungTable from "./Table/LungTable";
import ColonTable from "./Table/ColonTable";
import BreastTable from "./Table/BreastTable";

import Histograme from "./Table/Histograme";
import Cytoscape from "./Table/Cytoscape";

import GeneTable from "./Table/GeneTable";
import ProteinTable from "./Table/ProteinTable";
import RNATable from "./Table/RNATable";
import LipidTable from "./Table/LipidTable";

import DetailPage from "./Table/DetailPage";
import GeneDetail from "./Table/GeneDetail";
import ProteinDetail from "./Table/ProteinDetail.js";
import RNADetail from "./Table/RNADetail.js";
import LipidDetail from "./Table/LipidDetail.js";

import AIAgentPage from './AIAgentPage'; // 👈 導入新組件

import Landing from "./Landing";
import News from "./News";
import Tasks from "./Tasks";
import Rules from "./Rules";
import Leaderboard from "./Leaderboard";
import Challenge from './Challenge';
import NavigationBar from "./components/NavigationBar";
import Login from "./components/Login";
import Logout from "./components/Logout";
import SubmitForm from "./components/SubmitForm";
import Profile from "./Profile";
import { mainTheme } from "./components/Theme";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./hooks/auth-hook";
import { useContext } from "react";

import { challenge_overview, framework, upstream, submission, metrics } from "./policy";
import { policy_aaai2022 } from "./history/AAAI2022_policy";

const useStyles = makeStyles((theme) => ({
    narrowViewport: {
        width: "85%",
        maxWidth: 900,
        margin: "auto",
    },
    LoginButton: {
        height: "30vh",
        paddingTop: "10vh",
    },
    // 🚀 新增：全螢幕容器，專給 AI Agent 使用
    fullWidthViewport: {
        width: "100%",
        margin: 0,
        padding: 0,
    }
}));

function App() {
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [navbarHeight, setNavbarHeight] = React.useState(0);
    const tableControlRef = React.useRef(null);
    const auth = useContext(AuthContext);

    const setViewPort = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
        const navbar = document.getElementById("navbar");
        if (navbar) setNavbarHeight(navbar.offsetHeight);
    };

    React.useEffect(() => {
        setViewPort();
        window.addEventListener("resize", setViewPort);
        return () => window.removeEventListener("resize", setViewPort);
    }, []);

    const classes = useStyles();

    // 🚀 核心改動：將 /ai-agent 放在 Switch 的最上方，確保優先匹配且不被 narrowViewport 包裹
    const sharedRoutes = (
        <Route path="/ai-agent" exact>
            <div className={classes.fullWidthViewport}>
                <AIAgentPage />
            </div>
        </Route>
    );

    let routes;
    if (auth.isLoggedIn) {
        routes = (
            <Switch>
                {sharedRoutes}
                <Route path="/all/:index" exact>
                    <div className={classes.narrowViewport}><DetailPage /></div>
                </Route>
                <Route path="/gene/:index" exact>
                    <div className={classes.narrowViewport}><GeneDetail /></div>
                </Route>
                <Route path="/protein/:index" exact>
                    <div className={classes.narrowViewport}><ProteinDetail /></div>
                </Route>
                <Route path="/rna/:index" exact>
                    <div className={classes.narrowViewport}><RNADetail /></div>
                </Route>
                <Route path="/Gene" exact>
                    <div className={classes.narrowViewport}><GeneTable /></div>
                </Route>
                <Route path="/histograme" exact>
                    <div className={classes.narrowViewport}><Histograme /></div>
                </Route>
                <Route path="/cystoscape" exact>
                    <div className={classes.narrowViewport}><Cytoscape/></div>
                </Route>
                <Route path="/home" exact>
                    <div className={classes.narrowViewport}><Homepage /></div>
                </Route>
                <Route path="/" exact>
                    <Landing />
                </Route>
                <Route path="/news">
                    <div className={classes.narrowViewport}><News /></div>
                </Route>
                <Route path="/tasks">
                    <div className={classes.narrowViewport}><Tasks /></div>
                </Route>
                <Route path="/rules">
                    <div className={classes.narrowViewport}><Rules /></div>
                </Route>
                <Route path="/leaderboard">
                    <Leaderboard height={`${height - navbarHeight}px`} tableControlRef={tableControlRef} />
                </Route>
                <Route path="/profile" exact>
                    <Profile tableControlRef={tableControlRef} />
                </Route>
                <Route path="/logout">
                    <Logout />
                </Route>
                <Route path="/submit">
                    <div className={classes.narrowViewport}><SubmitForm login={true} /></div>
                </Route>
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                {sharedRoutes}
                <Route path="/all/:index" exact><DetailPage /></Route>
                <Route path="/gene/:index" exact><GeneDetail /></Route>
                <Route path="/protein/:index" exact><ProteinDetail /></Route>
                <Route path="/rna/:index" exact><RNADetail /></Route>
                <Route path="/lipid/:index" exact><LipidDetail /></Route>
                <Route path="/ALL" exact><ALLTable /></Route>
                <Route path="/Lung" exact><LungTable /></Route>
                <Route path="/Breast" exact><BreastTable /></Route>
                <Route path="/Colon" exact><ColonTable /></Route>
                <Route path="/Gene" exact><GeneTable /></Route>
                <Route path="/Protein" exact><ProteinTable /></Route>
                <Route path="/Lipid" exact><LipidTable /></Route>
                <Route path="/miRNA" exact><RNATable /></Route>
                <Route path="/home" exact><Landing /></Route>
                <Route path="/search" exact>
                    <div className={classes.narrowViewport}><ALLTable /></div>
                </Route>
                <Route path="/browse" exact>
                    <div className={classes.narrowViewport}><Browse /></div>
                </Route>
                <Route path="/help" exact>
                    <div className={classes.narrowViewport}><ChatbotHelp /></div>
                </Route>
                <Route path="/histograme" exact>
                    <div className={classes.narrowViewport}><Histograme /></div>
                </Route>
                <Route path="/cytoscape" exact><div><Cytoscape/></div></Route>
                <Route path="/" exact><Landing /></Route>
                <Route path="/news">
                    <div className={classes.narrowViewport}><News /></div>
                </Route>
                <Route path="/submit">
                    <div className={classes.narrowViewport}><SubmitForm login={false} /></div>
                </Route>
                <Route path="/login">
                    <div className={`${classes.narrowViewport} ${classes.LoginButton}`}><Login /></div>
                </Route>
                <Route path="/detail/:index" exact>
                    <div className={classes.narrowViewport}><GeneDetail /></div>
                </Route>
            </Switch>
        );
    }

    return (
        <div className="App">
            <Router>
                <div id="navbar">
                    <NavigationBar tableControlRef={tableControlRef} />
                </div>
                {routes}
            </Router>
        </div>
    );
}

export default () => {
    const { token, isAdmin, email, login, logout } = useAuth();
    return (
        <ThemeProvider theme={createTheme(mainTheme)}>
            <AuthContext.Provider
                value={{
                    isLoggedIn: !!token,
                    token: token,
                    isAdmin: isAdmin,
                    email: email,
                    login: login,
                    logout: logout,
                }}
            >
                <App />
            </AuthContext.Provider>
        </ThemeProvider>
    );
};