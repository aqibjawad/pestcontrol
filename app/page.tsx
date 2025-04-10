// pages/login.js
"use client";

import Image from "next/image";
import styles from "../styles/loginStyles.module.css";
import {
  Alert,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import User from "../networkUtil/user";
import APICall from "../networkUtil/APICall";
import { login } from "../networkUtil/Constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const apiCall = new APICall();
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [checked, setChecked] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [showErrorAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = User.getAccessToken();
      const roleId = User.getUserRoleId();
      const userId = User.getUserId();

      if (token && roleId && userId) {
        redirectBasedOnRole(roleId);
      } else {
        setIsChecking(false);
      }
    };

    checkAuthStatus();
  }, []);

  const redirectBasedOnRole = (roleId: number) => {
    switch (roleId) {
      case 1:
        router.replace("/superadmin/dashboard");
        break;
      case 2:
        router.replace("/hr/hr");
        break;
      case 4:
        const storedUserId = User.getUserId();
        router.replace(`/hr/employeeDetails/?id=${storedUserId}`);
        break;
      case 7:
        const storedUserIdRecovery = User.getUserId();
        router.replace(`/recovery/dashboard/?id=${storedUserIdRecovery}`);
        break;
      case 9:
        const storedUserIdSaleOfficer = User.getUserId();
        router.replace(
          `/salesOfficer/dashboard/?id=${storedUserIdSaleOfficer}`
        );
        break;
      default:
        router.replace("/accountant");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      tryLogin();
    }
  };

  const LoadingLogo = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img
        src="/logo.jpeg"
        height={100}
        width={100}
        alt="Logo"
        className="mb-4"
      />
      <CircularProgress color="primary" />
    </div>
  );

  const loginForm = () => (
    <div className={styles.loginBg}>
      <div className={styles.formContainer}>
        <div className="mb-6">
          <img
            src="/logo-black.png"
            height={80}
            width={80}
            alt="Logo"
            className="mx-auto"
          />
        </div>
        <div className={styles.loginTextContainer}>
          {"Sign in to your account"}
        </div>
        <div className={styles.subTitle}>
          Please sign in to your account to access all features and personalized
          content.
        </div>
        <div className={styles.userFormContainer}>
          <div className={styles.formTitle}>Enter Email Address</div>
          <div className={styles.inputContainer}>
            <input
              type="email"
              className={styles.inputField}
              placeholder="Please enter email"
              value={userEmail}
              onChange={(event) => setUserEmail(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className={styles.formTitle}>Enter Password</div>
          <div className={styles.inputContainer}>
            <input
              type="password"
              className={styles.inputField}
              placeholder="Please enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className={styles.rememberContainer}>
            <div className="flex">
              <div className="flex-grow">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        sx={{
                          color: "white",
                          "&.Mui-checked": { color: "white" },
                        }}
                      />
                    }
                    label="Remember me"
                  />
                </FormGroup>
              </div>
              <div className={styles.forgotPassword}>{"Forgot password?"}</div>
            </div>
          </div>
          <div onClick={() => tryLogin()} className={styles.loginBtn}>
            {sendingData ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Login"
            )}
          </div>

          {showErrorAlert && (
            <div className={styles.errorContainer}>
              <Alert severity="error">{errorMsg}</Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Inside your tryLogin function, update the error handling logic:

  // Modified tryLogin function with improved error handling
  const tryLogin = async () => {
    if (!isValidEmail(userEmail)) {
      alert("Please enter a valid email");
      return;
    }

    if (password.trim().length === 0) {
      alert("Please enter a valid password");
      return;
    }

    setSendingData(true);
    setShowAlert(false); // Reset error alert state

    const userObj = {
      email: userEmail,
      password: password,
    };

    try {
      const response = await apiCall.postData(login, userObj);

      console.log(response);
      

      // For debugging - log the response
      console.log("Login response:", response);

      // Check all possible error formats
      if (response.status === "error") {
        console.log("Error detected in status field");
        setErrorMsg(response.message || "Login failed");
        setShowAlert(true);
      } else if (response.error) {
        console.log("Error detected in error object");
        setErrorMsg(response.error.message || "Login failed");
        setShowAlert(true);
      } else if (!response.data) {
        console.log("No data in response");
        setErrorMsg("Invalid credentials. Please try again.");
        setShowAlert(true);
      } else {
        // Login success
        const user = new User(response);
        const roleId = response.data.role_id;
        const userId = response.data.user_id;
        redirectBasedOnRole(roleId);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setShowAlert(true);
    } finally {
      setSendingData(false);
    }
  };

  // Update the error alert display in the loginForm function
  // Replace the existing error alert section with this:
  {
    showErrorAlert && (
      <div
        className={styles.errorContainer}
        style={{ marginTop: "15px", width: "100%" }}
      >
        <Alert
          severity="error"
          style={{ width: "100%", display: "flex", alignItems: "center" }}
        >
          {errorMsg}
        </Alert>
      </div>
    );
  }

  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show loading state while checking authentication
  if (isChecking) {
    return <LoadingLogo />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-6 p-4 hidden md:block">
            <div className="flex justify-center items-center h-full">
              <img src="/loginImg.png" alt="Login Illustration" />
            </div>
          </div>
          <div className="md:col-span-6 p-4">{loginForm()}</div>
        </div>
      </div>
    </div>
  );
}
