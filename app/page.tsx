"use client";
import Image from "next/image";
import styles from "../styles/loginStyles.module.css";
import {
  Alert,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import User from "../networkUtil/user";
import APICall from "../networkUtil/APICall";
import { login } from "../networkUtil/Constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { log } from "console";

export default function Home() {
  const apiCall = new APICall();
  const router = useRouter();

  const [checked, setChecked] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [showErrorAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const imgSection = () => {
    return (
      <div>
        <img src="/logo.jpeg" height={100} width={100} />
        <div className="flex justify-center items-center h-full">
          <img src="/loginImg.png" />
        </div>
      </div>
    );
  };

  const loginForm = () => {
    return (
      <div className={styles.loginBg}>
        <div className={styles.formContainer}>
          <div className={styles.loginTextContainer}>
            {"Sign in to your account"}
          </div>
          <div className={styles.subTitle}>
            Please sign in to your account to access all features and
            personalized content.
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
                <div className={styles.forgotPassword}>
                  {"forgot passowrd?"}
                </div>
              </div>
            </div>
            <div onClick={() => tryLogin()} className={styles.loginBtn}>
              {sendingData ? (
                <CircularProgress color={"inherit"} size={20} />
              ) : (
                "Login"
              )}
            </div>

            {showErrorAlert ? (
              <div className={styles.errorContainer}>
                <Alert severity="error">{errorMsg}</Alert>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  };

  const tryLogin = async () => {
    if (!isValidEmail(userEmail)) {
      alert("Please enter a valid email");
    } else if (password.length < 0) {
      alert("Please enter a valid password");
    } else {
      setSendingData(true);
      const userObj = {
        email: userEmail,
        password: password,
      };
      const response = await apiCall.postData(login, userObj);
      if (response.error) {
        setErrorMsg(response.error.message);
        setShowAlert(true);
      } else {
        const user = new User(response);
        
        if (response.data.role === "1") { 
          router.replace("/superadmin/dashboard");
        }
      }
      setSendingData(false);
    }
  };

  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-6 p-4">{imgSection()}</div>
          <div className="md:col-span-6 p-4">{loginForm()}</div>
        </div>
      </div>
    </div>
  );
}
