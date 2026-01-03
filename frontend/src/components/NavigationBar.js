import React from "react";
import PropTypes from "prop-types";
import { useHistory, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  useScrollTrigger,
  Slide,
  Zoom,
  Fab,
  Button,
  Box,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Hidden,
  withWidth,
} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Drawer from "./Drawer";
import AdaptiveLink from "./AdaptiveLink";

import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  let history = useHistory();
  let location = useLocation();

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ block: "center" });
      history.push(location.pathname);
    }
  };

  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        role="presentation"
        className={classes.scrollTop}
      >
        {children}
      </div>
    </Zoom>
  );
}

const useStyles = makeStyles((theme) => ({
  scrollTop: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
  },
  appBar: {
    // 🚀 優化：深色半透明磨砂玻璃效果，完美融入星空
    background: "rgba(10, 15, 30, 0.75) !important",
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  toolbar: {
    width: "100%",
    maxWidth: 1600,
    margin: "auto",
    paddingLeft: 20,
    paddingRight: 20,
  },
  tool: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  button: {
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 4,
    marginRight: 4,
    borderRadius: 8,
    transition: "all 0.3s ease",
    "&:hover": {
      // 🚀 優化：懸停時呈現微光感，不再是死白的區塊
      background: "rgba(255, 255, 255, 0.12)",
      boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.1)",
    },
    cursor: "pointer",
  },
  navlink: {
    fontWeight: 600,
    letterSpacing: "1px",
    // 🚀 優化：導航文字改為淡白色
    color: "rgba(255, 255, 255, 0.85) !important",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    filter: "drop-shadow(0px 0px 5px rgba(255,255,255,0.2))", // 讓 Logo 帶點光暈
  }
}));

function LiftingBarButton(props) {
  const classes = useStyles();
  return (
    <div className={`${classes.tool} ${classes.button}`}>
      {props.children}
    </div>
  );
}

function NavigationBar({ width, tableControlRef, ...props }) {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  let items = [
    ["Home", "/home"],
    ["Search", "/search"],
    ["Browse", "/browse"],
    ["Help", "/help"],
  ];

  const items1 = items.map(([text, link]) =>
    Array.isArray(link) ? (
      <Box key={text} sx={{ flexGrow: 0 }}>
        <Grid item onClick={handleOpenUserMenu}>
          <LiftingBarButton>
            <Typography variant="overline" className={classes.navlink}>
              {text}
            </Typography>
          </LiftingBarButton>
        </Grid>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: -50, horizontal: 'right' }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {link.map(([subText, subLink]) => (
            <MenuItem key={subText} onClick={handleCloseUserMenu}>
              <AdaptiveLink link={subLink}>
                <Typography textAlign="center">{subText}</Typography>
              </AdaptiveLink>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    ) : (
      <Grid item key={link}>
        <AdaptiveLink link={link}>
          <LiftingBarButton>
            <Typography variant="overline" className={classes.navlink}>
              {text}
            </Typography>
          </LiftingBarButton>
        </AdaptiveLink>
      </Grid>
    )
  );

  const items2 = (onclick) => items.map(([text, link]) => (
    <div key={text}>
      <AdaptiveLink link={link}>
        <ListItem button onClick={onclick}>
          <ListItemText>
            <Typography color="textSecondary" variant="overline">
              {text}
            </Typography>
          </ListItemText>
        </ListItem>
      </AdaptiveLink>
      <Divider />
    </div>
  ));

  const largeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar className={classes.appBar} position="fixed">
          <Toolbar className={classes.toolbar}>
            <Grid container alignItems="center">
              {/* Logo 區域 */}
              <Grid item xs={9} lg={3}>
                <AdaptiveLink link="/">
                  <div className={classes.logo}>
                    <img 
                      src="/ExoCSC-logo.png" 
                      style={{ 
                        width: largeScreen ? "180px" : "120px", 
                        height: "auto",
                        // 如果 Logo 黑色色差重，可開啟下方濾鏡
                        // filter: "brightness(0) invert(1)" 
                      }} 
                      alt="ExoCSC Logo"
                    />
                  </div>
                </AdaptiveLink>
              </Grid>

              {/* 選單區域 */}
              <Grid item xs={3} lg={9}>
                <Grid container direction="row" justify="flex-end" alignItems="center">
                  <Hidden mdDown>
                    {items1}
                  </Hidden>
                  <Hidden lgUp>
                    <Grid item>
                      <Drawer items={items2}>
                        <LiftingBarButton>
                          <Typography className={classes.navlink} variant="overline">
                            MENU
                          </Typography>
                        </LiftingBarButton>
                      </Drawer>
                    </Grid>
                  </Hidden>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* 墊片：防止頁面內容被固定在頂部的 Navbar 遮住 */}
      <Toolbar id="back-to-top-anchor" />

      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}

export default withWidth()(NavigationBar);