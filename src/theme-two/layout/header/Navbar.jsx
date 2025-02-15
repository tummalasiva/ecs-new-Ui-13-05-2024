import React, { useContext, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  MenuItem,
  styled,
  Box,
  IconButton,
  Drawer,
  List,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { navbarData } from "../../data/NavbarData";
import NavbarItem from "./NavbarItem";
import SettingContext from "../../../context/SettingsContext";
import KayakaLogo from "../../assets/images/kaykalogo.png";
// icons
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MuiUl = styled("ul")(({ theme }) => ({
  "& li": {
    listStyle: "none",
    padding: "20px 15px",
    float: "left",
    margin: "0px 10px 0px 0px",
    textAlign: "center",
    cursor: "pointer",
  },
}));

const NavContainer = styled(Box)(({ theme }) => ({
  "& ul li::after": {
    content: "''",
    backgroundColor: "white",
    display: "block",
    transition: "width 0.5s",
    width: 0,
    height: "2px",
  },
  "& ul li:hover::after": {
    width: "100%",
  },
}));

const SideContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    display: "none",
  },
}));

const MainBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  zIndex: 10,
  position: "absolute",
  background: "transparent",
  borderBottom: "0.1px solid #828998",
}));

export default function Navbar() {
  let navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedSetting } = useContext(SettingContext);
  const [showMenuItem, setShowMenuItem] = useState(false);
  const [about, setAbout] = useState(null);
  const open1 = Boolean(about);

  const [facilities, setFacilities] = useState(null);
  const open2 = Boolean(facilities);

  const [state, setState] = React.useState({
    right: false,
  });

  const handleMenuItem = () => {
    setShowMenuItem(true);
  };

  const handleClick1 = (e) => {
    setAbout(e.currentTarget);
  };
  const handleClose1 = () => {
    setAbout(null);
  };

  const handleClick2 = (e) => {
    setFacilities(e.currentTarget);
  };
  const handleClose2 = () => {
    setFacilities(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, right: open });
  };

  let handlePath = (data) => {
    navigate(data);
  };

  const navbarData = [
    {
      href: "#",
      id: "button",
      "aria-haspopup": "true",
      variant: "contained",
      title: "Home ",
      path: "/",
    },
    {
      href: "#",
      id: "button",
      "aria-haspopup": "true",
      "aria-expanded": open1 ? "true" : undefined,
      onClick: handleClick1,
      variant: "contained",
      title: "About +",

      items: [
        {
          title: "About us",
          pathName: "/about/overview",
        },
        {
          title: "About Founder",
          pathName: "/about/founder",
        },
        {
          title: " Vision & Mission",
          pathName: "/about/vision-and-mission",
        },
      ],
    },

    {
      href: "#",
      id: "button",
      "aria-haspopup": "true",
      variant: "contained",
      title: "Pre-Admission ",
      path: "/pre-admission",
    },
    {
      href: "#",
      id: "button",
      "aria-haspopup": "true",
      variant: "contained",
      title: "Gallery ",
      path: "/discover-gallery",
    },

    {
      href: "#",
      id: "button",
      "aria-haspopup": "true",
      "aria-expanded": "true",
      "aria-expanded": open2 ? "true" : undefined,
      onClick: handleClick2,
      variant: "contained",
      title: "Facilities + ",
      items: [
        {
          title: "Food",
          pathName: "/facilities/canteen",
        },
        {
          title: "Library",
          pathName: "/library",
        },
        {
          title: "Transport",
          pathName: "/transport",
        },
        {
          title: "Dance And Singing",
          pathName: "/facilities/dance-and-singing",
        },
        {
          title: "Lab Facilities",
          pathName: "/facilities/labs",
        },
      ],
    },

    {
      href: "#",
      id: "button",
      "aria-haspopup": "true",
      variant: "contained",
      title: "Results ",
      path: "/results",
    },

    {
      href: "#",
      id: "button",
      "aria-haspopup": "true",
      variant: "contained",
      title: "Contact us ",
      path: "/contact-us",
    },
  ];

  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(true)}
      onKeyDown={toggleDrawer(true)}
    >
      <List>
        {navbarData.map((data, index) => {
          return (
            <React.Fragment key={index}>
              <Accordion>
                <AccordionSummary
                  expandIcon={data.items && <ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>{data.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {data.items &&
                    data.items.map((item, itemIndex) => {
                      return (
                        <React.Fragment key={itemIndex}>
                          <MenuItem>
                            <Typography
                              component="div"
                              onClick={() => handlePath(item.pathName)}
                              sx={{
                                color: pathname === item.pathName ? "red" : "",
                              }}
                            >
                              {item.title}
                            </Typography>
                          </MenuItem>
                        </React.Fragment>
                      );
                    })}
                </AccordionDetails>
              </Accordion>
            </React.Fragment>
          );
        })}
      </List>
      <Divider />
    </Box>
  );

  return (
    <>
      <MainBox>
        <Link to="/">
          <img
            height={100}
            width={120}
            src={selectedSetting?.logo?.link || KayakaLogo}
          />
        </Link>

        <NavContainer
          sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block" } }}
        >
          <MuiUl variant="ul">
            {navbarData &&
              navbarData.map((data, i) => {
                return (
                  <React.Fragment key={i}>
                    <li>
                      <NavbarItem
                        title={data.title}
                        onClick={data.onClick}
                        open={data.open}
                        pathname={data.path}
                        isSelected={pathname === data.path}
                      />
                    </li>
                  </React.Fragment>
                );
              })}

            <Menu
              id="about"
              anchorEl={about}
              open={open1}
              onClick={handleClose1}
              style={{
                marginTop: "4%",
                Width: "15%",
                textAlign: "center",
              }}
            >
              <Link to="/about/overview" style={{ textDecoration: "none" }}>
                <MenuItem
                  style={{
                    color:
                      pathname == "/about/overview" ? "orangered" : "black",
                  }}
                >
                  Overview
                </MenuItem>
              </Link>
              <Link to="/about/founder" style={{ textDecoration: "none" }}>
                <MenuItem
                  style={{
                    color: pathname == "/about/founder" ? "orangered" : "black",
                  }}
                >
                  About Founder
                </MenuItem>
              </Link>
              <Link
                to="/about/vision-and-mission"
                style={{ textDecoration: "none" }}
              >
                <MenuItem
                  style={{
                    color:
                      pathname == "/about/vision-and-mission"
                        ? "orangered"
                        : "black",
                  }}
                >
                  Vision & Mission
                </MenuItem>
              </Link>
            </Menu>

            {/* Facilities Submenu */}
            <Menu
              id="facilities"
              anchorEl={facilities}
              open={open2}
              onClick={handleClose2}
              style={{
                marginTop: "4%",
                Width: "15%",
                textAlign: "center",
              }}
            >
              <NavLink to="/facilities/food" style={{ textDecoration: "none" }}>
                <MenuItem
                  style={{
                    color:
                      pathname == "/facilities/food" ? "orangered" : "black",
                  }}
                >
                  Food
                </MenuItem>
              </NavLink>
              <Link to="/facilities/library" style={{ textDecoration: "none" }}>
                <MenuItem
                  style={{
                    color:
                      pathname == "/facilities/library" ? "orangered" : "black",
                  }}
                >
                  Library
                </MenuItem>
              </Link>
              <Link
                to="/facilities/transport"
                style={{ textDecoration: "none" }}
              >
                <MenuItem
                  style={{
                    color:
                      pathname == "/facilities/transport"
                        ? "orangered"
                        : "black",
                  }}
                >
                  Transport
                </MenuItem>
              </Link>
              <Link
                to="/facilities/dance-and-singing"
                style={{ textDecoration: "none" }}
              >
                <MenuItem
                  style={{
                    color:
                      pathname == "/facilities/dance-and-singing"
                        ? "orangered"
                        : "black",
                  }}
                >
                  Dance And Singing
                </MenuItem>
              </Link>
              <Link to="/facilities/labs" style={{ textDecoration: "none" }}>
                <MenuItem
                  style={{
                    color:
                      pathname == "/facilities/labs" ? "orangered" : "black",
                  }}
                >
                  Lab Facilities
                </MenuItem>
              </Link>
            </Menu>
            {/* ================ */}

            {/* <Menu
              id="achievment"
              anchorEl={achievment}
              open={open4}
              onClick={handleClose4}
              style={{
                marginTop: "4%",
                Width: "15%",
                textAlign: "center",
              }}
            ></Menu>

            {showMenuItem && (
              <Menu
                id="result"
                onClick={handleMenuItem}
                anchorEl={result}
                open={open5}
                onClose={handleClose5}
                style={{
                  marginTop: "4%",
                  Width: "15%",
                  textAlign: "center",
                }}
              ></Menu>
            )}

            {showMenuItem && (
              <Menu
                id="contact"
                onClick={handleMenuItem}
                anchorEl={contact}
                open={open6}
                onClose={handleClose6}
                style={{
                  marginTop: "4%",
                  Width: "15%",
                  textAlign: "center",
                  background: "transparent",
                }}
              ></Menu>
            )} */}
          </MuiUl>
        </NavContainer>

        <SideContainer
          sx={{ display: { xs: "block", sm: "block", md: "none", lg: "none" } }}
        >
          <IconButton
            size="large"
            edge="start"
            color="info"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="right"
            open={state.right}
            onClose={toggleDrawer(false)}
          >
            {list("right")}
          </Drawer>
        </SideContainer>
      </MainBox>
    </>
  );
}
