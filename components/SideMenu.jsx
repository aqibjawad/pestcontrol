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
import styles from "../styles/sideMenu.module.css";
import { useRouter } from "next/navigation";
import User from "../networkUtil/user";
import { IoIosStats } from "react-icons/io";
import {
  MdOutlineProductionQuantityLimits,
  MdInventory,
  MdOutlineInventory,
  MdOutlineQueryStats,
  MdOutlinePayments,
} from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { IoIosPerson } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { FaAlipay } from "react-icons/fa";

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
  const router = useRouter();
  // Changed initial state to false so drawer is closed by default
  const [open, setOpen] = useState(false);
  const [roleId, setRoleId] = useState(null);

  const allPermissions = [
    { name: "Home", url: "superadmin/dashboard", icon: "/home.png" },
    { name: "Jobs", url: "allJobs", icon: "/jobs.png" },
    { name: "Contracts", url: "contracts", icon: "/contracts.png" },
    { name: "Quotes", url: "viewQuote", icon: "/quotes.png" },
    { name: "Clients", url: "clients", icon: "/clients.png" },
    { name: "Invoices", url: "invoice", icon: "/operations.png" },
    { name: "Outstandings", url: "badTransac", icon: <MdOutlineQueryStats /> },
    { name: "Recoveries", url: "recovery/details/", icon: <MdOutlineQueryStats /> },
    { name: "Invoice Promises", url: "recovery/promises/", icon: <MdOutlineQueryStats /> },
    { name: "HR", url: "hr/hr", icon: "/hr.png" },
    { name: "Sales Officer", url: "salesOfficer/dashboard", icon: "/hr.png" },
    { name: "Employee Ledger", url: "hr/employeeLedger", icon: "/hr.png" },
    {
      name: "Financial Report",
      url: "financialReport/",
      icon: <IoIosStats />,
    },
    { name: "Settings", url: "setting", icon: "/setting-2.png" },
  ];

  const [permissions, setPermissions] = useState([]);
  const [userName, setUserName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const userRoleId = User.getUserRoleId();
    const userId = User.getUserId();
    const name = User.getUserName();

    setRoleId(userRoleId);
    setUserName(name || "User");

    let userPermissions = [];
    if (userRoleId === 1) {
      userPermissions = allPermissions;
    } else if (userRoleId === 2) {
      userPermissions = [
        { name: "Dashbaord", url: "hr/hr", icon: "/home.png" },
        { name: "Employees", url: `operations/viewEmployees`, icon: "/hr.png" },
        { name: "Vehicles", url: `operations/vehciles`, icon: "/hr.png" },
        {
          name: "View Vehicle",
          url: `account/viewAllVehciles`,
          icon: "/hr.png",
        },
        {
          name: "Vehicle Expense",
          url: `account/addVehiclesExpense`,
          icon: "/hr.png",
        },
        {
          name: "Rented Properties",
          url: `account/addVehiclesExpense`,
          icon: "/hr.png",
        },
        {
          name: "Profile",
          url: `hr/employeeDetails?id=${userId}`,
          icon: "/clients.png",
        },
      ];
    } else if (userRoleId === 4) {
      userPermissions = [
        {
          name: "Profile",
          url: `hr/employeeDetails?id=${userId}`,
          icon: "/clients.png",
        },
      ];
    } else if (userRoleId === 6) {
      userPermissions = [
        { name: "Home", url: "accountant", icon: "/home.png" },
        {
          name: "Financial Report",
          url: "financialReport/",
          icon: <MdOutlineInventory />,
        },
        {
          name: "Outstandings",
          url: "badTransac",
          icon: <MdOutlineQueryStats />,
        },
        {
          name: "Sattelment Invoices",
          url: "settelmentedInvoice",
          icon: <MdOutlineQueryStats />,
        },
        {
          name: "Add Inventory",
          url: "account/addProduct/",
          icon: <MdOutlineProductionQuantityLimits />,
        },
        {
          name: "View Inventory",
          url: "operations/viewInventory/",
          icon: <AiFillProduct />,
        },
        {
          name: "Add Purchase",
          url: "account/addPurchase/",
          icon: <MdInventory />,
        },
        {
          name: "View Purchase",
          url: "account/purchaseOrders/",
          icon: <MdOutlineInventory />,
        },
        {
          name: "Clients",
          url: "clients",
          icon: <IoPersonCircle />,
        },
        {
          name: "Add Vehicle",
          url: "operations/vehciles",
          icon: <IoIosPerson />,
        },
        {
          name: "Vehicle Expense",
          url: "account/addVehiclesExpense",
          icon: <IoIosPerson />,
        },
        {
          name: "Add Suppliers",
          url: "account/addSuppliers/",
          icon: <IoIosPerson />,
        },
        {
          name: "View Suppliers",
          url: "account/viewSuppliers/",
          icon: <IoPersonCircle />,
        },
        {
          name: "Suppliers Payment",
          url: "operations/addSupplierExpense/",
          icon: <MdOutlinePayments />,
        },
        {
          name: "Transactions",
          url: "accountant/viewTransactions",
          icon: "/jobs.png",
        },
        { name: "Invoices", url: "invoice", icon: "/jobs.png" },
        {
          name: "View Expense",
          url: "operations/viewAllExpenses",
          icon: "/jobs.png",
        },
        {
          name: "Add Expense",
          url: "operations/addExpense",
          icon: "/jobs.png",
        },
        {
          name: "Expense Category",
          url: "operations/expense_category",
          icon: "/jobs.png",
        },
        {
          name: "Profile",
          url: `hr/employeeDetails?id=${userId}`,
          icon: "/clients.png",
        },
      ];
    } else if (userRoleId === 7) {
      userPermissions = [
        {
          name: "Dashboard",
          url: `recovery/dashboard?id=${userId}`,
          icon: "/home.png",
        },
        {
          name: "Profile",
          url: `hr/employeeDetails?id=${userId}`,
          icon: "/clients.png",
        },
      ];
    } else if (userRoleId === 9) {
      userPermissions = [
        {
          name: "Dashboard",
          url: `salesOfficer/dashboard?id=${userId}`,
          icon: "/home.png",
        },
        {
          name: "Profile",
          url: `hr/employeeDetails?id=${userId}`,
          icon: "/clients.png",
        },
      ];
    }

    userPermissions.push({
      name: "Logout",
      url: "/",
      icon: "/logout.png",
      isLogout: true,
    });

    setPermissions(userPermissions);
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNext = (item, index) => {
    setSelectedIndex(index);
    // Close the drawer when clicking any menu item
    setOpen(false);

    if (item.isLogout) {
      logOut();
    } else {
      router.push(`/${item.url}`, undefined, { shallow: true });
    }
  };

  const logOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/";
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
            sx={{ color: "black", marginRight: 2 }}
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
          <img src="/whiteLogo.png" height={130} width={130} alt="Logo" />
        </div>
        <div className={styles.separator}>&nbsp;</div>

        <List>
          {Array.isArray(permissions) && permissions.length > 0 ? (
            permissions.map((item, index) => (
              <div
                onClick={() => handleNext(item, index)}
                key={index}
                className={
                  index === selectedIndex
                    ? styles.menuItemSelected
                    : styles.menuItem
                }
              >
                <span style={{ marginRight: "10px" }}>
                  {typeof item.icon === "string" ? (
                    <img
                      src={item.icon}
                      alt={item.name}
                      height={20}
                      width={20}
                    />
                  ) : (
                    React.cloneElement(item.icon, {
                      size: "20px",
                      color: "white",
                    })
                  )}
                </span>
                <div className={styles.sideMenuNames}>{item.name}</div>
              </div>
            ))
          ) : (
            <div className={styles.sideMenuNames}>No permissions available</div>
          )}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
