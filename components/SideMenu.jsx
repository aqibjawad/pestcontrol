"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import styles from "../styles/sideMenu.module.css";
import User from "@/networkUtil/user";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const MyAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function SideMenu({ children }) {
  const router = new useRouter();
  const [open, setOpen] = React.useState(true);
  const [permissions, setPermissions] = useState([]);
  const [userName, setUserName] = useState("");

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setPermissions(User.getUserPersmissions());
    setUserName(User.getUserName());
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleNext = (item, index) => {
    setSelectedIndex(index);
    router.push(`/${item.url}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <MyAppBar
        position="fixed"
        open={open}
        sx={{ backgroundColor: "white", boxShadow: "none" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ color: "black", marginRight: 2 }} // Set color explicitly to black or any other color you want
          >
            <MenuIcon />
          </IconButton>
          <div className={styles.welcomeContainer}>
            <div className="flex">
              <img src="/welcomeHand.svg" alt="Welcome hand" />
              <div className="flex">
                <div className={styles.welcomeText}>WELCOME</div>
                <div className={styles.userName}>{userName}</div>
              </div>
            </div>
          </div>
        </Toolbar>
      </MyAppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "black",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>

        <div className="flex justify-center mb-10">
          <img src="/whiteLogo.png" height={130} width={130} />
        </div>
        <div className={styles.separator}>&nbsp;</div>

        <List>
          {permissions.map((text, index) => (
            <div
              onClick={() => handleNext(text, index)}
              key={index}
              className={
                index === selectedIndex
                  ? styles.menuItemSelected
                  : styles.menuItem
              }
            >
              <img src={text.icon} alt={text.name} height={20} width={20} />
              <div className={styles.sideMenuNames}>{text.name}</div>
            </div>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
