import "./App.css";
import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import {
    useTheme,
    ThemeProvider,
    makeStyles,
    createMuiTheme,
} from "@material-ui/core/styles";

import Homepage from "./Homepage"
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
import MyComponent from './Table/testTable'

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
        setNavbarHeight(document.getElementById("navbar").offsetHeight);
    };
    React.useEffect(setViewPort);
    window.addEventListener("resize", setViewPort);

    const classes = useStyles();
    let routes;
    if (auth.isLoggedIn) {
        routes = (
            <Switch>

                {/* <Route path="/detail/:id" component={DetailPage} /> */}


                



                <Route path="/all/:index" exact>
                    <div className={`${classes.narrowViewport}`}>
                        <DetailPage />
                    </div>
                </Route>
                <Route path="/gene/:index" exact>
                    <div className={`${classes.narrowViewport}`}>
                        <GeneDetail />
                    </div>
                </Route>

                <Route path="/protein/:index" exact>
                    <div className={`${classes.narrowViewport}`}>
                        <ProteinDetail />
                    </div>
                </Route>

                <Route path="/rna/:index" exact>
                    <div className={`${classes.narrowViewport}`}>
                        <RNADetail />
                    </div>
                </Route>



                <Route path="/Gene" exact>
                    <div className={`${classes.narrowViewport}`}>
                        <GeneTable />
                    </div>
                </Route>



                <Route path="/histograme" exact>
                    <div className={`${classes.narrowViewport}`}>
                        <Histograme />
                    </div>
                </Route>

                <Route path="/cystoscape" exact>
                    <div className={`${classes.narrowViewport}`}>
                        <Cytoscape/>
                    </div>
                </Route>


                <Route path="/home" exact>
                    <div className={`${classes.narrowViewport}`}>
                        <Homepage />
                    </div>
                </Route>
                <Route path="/" exact>
                    <div className={`${classes.narrowViewport}`}>
                        <Landing />
                    </div>
                </Route>
                <Route path="/news">
                    <div className={`${classes.narrowViewport}`}>
                    <News />
                    </div>
                </Route>
                <Route path="/tasks">
                    <div className={`${classes.narrowViewport}`}>
                        <Tasks />
                    </div>
                </Route>
                <Route path="/rules">
                    <div className={`${classes.narrowViewport}`}>
                        <Rules />
                    </div>
                </Route>
                
                <Route path="/leaderboard">
                    <Leaderboard
                        height={`${height - navbarHeight}px`}
                        tableControlRef={tableControlRef}
                    />
                </Route>
                <Route path="/challenge-slt2022/challenge_overview">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={challenge_overview} />
                    </div>
                </Route>
                <Route path="/challenge-slt2022/framework">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={framework} />
                    </div>
                </Route>
                <Route path="/challenge-slt2022/upstream">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={upstream} />
                    </div>
                </Route>
                <Route path="/challenge-slt2022/submission">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={submission} />
                    </div>
                </Route>
                <Route path="/challenge-slt2022/metrics">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={metrics} />
                    </div>
                </Route>
                <Route path="/challenge-aaai2022">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={policy_aaai2022} />
                    </div>
                </Route>
                <Route path="/profile" exact>
                    <Profile tableControlRef={tableControlRef} />
                </Route>
                <Route path="/logout">
                    <Logout />
                </Route>
                <Route path="/submit">
                    <div className={`${classes.narrowViewport}`}>
                        <SubmitForm login={true} />
                    </div>
                </Route>
            </Switch>
        );
    } else {
        routes = (
            <Switch>

                <Route path="/all/:index" exact> 
                <DetailPage />   
                </Route>
                
                <Route path="/gene/:index" exact> 
                <GeneDetail />
                </Route>

                <Route path="/protein/:index" exact>
                    <div >
                        <ProteinDetail />
                    </div>
                </Route>
                <Route path="/rna/:index" exact>
                    <div >
                        <RNADetail />
                    </div>
                </Route>

                <Route path="/lipid/:index" exact>
                    <div >
                        <LipidDetail />
                    </div>
                </Route>

                <Route path="/ALL" exact>
                <ALLTable />
                </Route>
                
                <Route path="/Lung" exact>
                <LungTable />
                </Route>


                <Route path="/Breast" exact>
                <BreastTable />
                </Route>

                <Route path="/Colon" exact>
                <ColonTable />
                </Route>

                <Route path="/Gene" exact>
                <GeneTable />
                </Route>
                <Route path="/Protein" exact>
                <ProteinTable />
                </Route>
                <Route path="/Lipid" exact>
                <LipidTable />
                </Route>
                <Route path="/miRNA" exact>
                <RNATable />
                </Route>

                <Route path="/test" exact>
                <MyComponent />
                </Route>


                <Route path="/home" exact>
                {/* <div className={`${classes.narrowViewport}`}> */}
                        <Landing />
                    {/* </div> */}
                </Route>

                <Route path="/search" exact>
                <div className={`${classes.narrowViewport}`}>
                        <ALLTable />
                    </div>
                </Route>
                <Route path="/browse" exact>
                <div className={`${classes.narrowViewport}`}>
                        <Browse />
                    </div>
                </Route>
                
                <Route path="/help" exact>
                <div className={`${classes.narrowViewport}`}>
                        <Homepage />
                    </div>
                </Route>

                <Route path="/histograme" exact>
                    <div className={`${classes.narrowViewport}`}>
                        <Histograme />
                    </div>
                </Route>

                <Route path="/cytoscape" exact>
                    <div >
                        <Cytoscape/>
                    </div>
                </Route>
                <Route path="/" exact>
                    <div className={`${classes.narrowViewport}`}>
                        <Landing />
                    </div>
                </Route>
                <Route path="/news">
                    <div className={`${classes.narrowViewport}`}>
                    <News />
                    </div>
                </Route>
                <Route path="/tasks">
                    <div className={`${classes.narrowViewport}`}>
                        <Tasks />
                    </div>
                </Route>
                <Route path="/rules">
                    <div className={`${classes.narrowViewport}`}>
                        <Rules />
                    </div>
                </Route>
                <Route path="/leaderboard">
                    <Leaderboard
                       f height={`${height - navbarHeight}px`}
                        tableControlRef={tableControlRef}
                    />
                </Route>
                <Route path="/challenge-slt2022/challenge_overview">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={challenge_overview} />
                    </div>
                </Route>
                <Route path="/challenge-slt2022/framework">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={framework} />
                    </div>
                </Route>
                <Route path="/challenge-slt2022/upstream">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={upstream} />
                    </div>
                </Route>
                <Route path="/challenge-slt2022/submission">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={submission} />
                    </div>
                </Route>
                <Route path="/challenge-slt2022/metrics">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={metrics} />
                    </div>
                </Route>
                <Route path="/challenge-aaai2022">
                    <div className={`${classes.narrowViewport}`}>
                        <Challenge policy={policy_aaai2022} />
                    </div>
                </Route>
                <Route path="/submit">
                    <div className={`${classes.narrowViewport}`}>
                        <SubmitForm login={false} />
                    </div>
                </Route>
                <Route path="/login">
                    <div
                        className={`${classes.narrowViewport} ${classes.LoginButton}`}
                    >
                        <Login />
                    </div>
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
        <ThemeProvider theme={createMuiTheme(mainTheme)}>
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
