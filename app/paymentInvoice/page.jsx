"use client";

import React, { useState, useEffect } from "react";

import { serviceInvoice, clients } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper, Skeleton
} from "@mui/material";

import styles from "../../styles/paymentPdf.module.css";
import { format } from "date-fns";

import { FaPhone } from "react-icons/fa";
import { TbDeviceLandlinePhone } from "react-icons/tb";

const getParamsFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const params = {};
    const queryParams = parts[1].split("&");

    for (const param of queryParams) {
      const [key, value] = param.split("=");
      params[key] = value;
    }

    return params;
  }
  return { id: null, userId: null };
};

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState("");
  const [userId, setUserId] = useState(null);

  const [allInvoiceList, setAllInvoiceList] = useState([]);
  const [rowData, setRowData] = useState([]);

  console.log(rowData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    const params = getParamsFromUrl(currentUrl);
    setId(params.id);
    setUserId(params.userId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllServices(id);
    }
    if (userId !== undefined && userId !== null) {
      fetchData(userId);
    }
  }, [id, userId]);

  const getAllServices = async () => {
    setFetchingData(true);
    try {
      if (id !== "") {
        const response = await api.getDataWithToken(`${serviceInvoice}/${id}`);

        setAllInvoiceList(response.data);
      }
    } catch (error) {
      console.error("Error fetching Services:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const fetchData = async (userId) => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(
        `${clients}/ledger/get/${userId}`
      );
      // Get only last 5 arrays using slice
      const lastFiveArrays = response.data.slice(-5);
      setRowData(lastFiveArrays);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const numberToWords = (num) => {
    const belowTwenty = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const aboveThousand = ["", "Thousand", "Million", "Billion"];

    if (num === 0) return "Zero";

    let words = "";
    let i = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk) {
        let str = "";
        if (chunk % 100 < 20) {
          str = belowTwenty[chunk % 100];
        } else {
          str =
            tens[Math.floor((chunk % 100) / 10)] +
            (chunk % 10 ? " " + belowTwenty[chunk % 10] : "");
        }
        if (Math.floor(chunk / 100) > 0) {
          str =
            belowTwenty[Math.floor(chunk / 100)] +
            " Hundred" +
            (str ? " " + str : "");
        }
        words =
          str +
          (aboveThousand[i] ? " " + aboveThousand[i] : "") +
          (words ? " " + words : "");
      }
      num = Math.floor(num / 1000);
      i++;
    }
    return words.trim();
  };

  return (
    <div className={styles.customSize}>
      <Grid container spacing={2}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <img className={styles.logo} src="/logo.jpeg" />
        </Grid>

        <Grid className="mt-5" item lg={6} xs={12} sm={6} md={4}>
          <div className="flex">
            <div className="flex items-center">
              <FaPhone />
              <div className={styles.infoInvoice}>+971 52 152 8725</div>
            </div>

            <div className="flex items-center">
              <TbDeviceLandlinePhone className="ml-20" />
              <div className={styles.infoInvoice}>043 756 435</div>
            </div>
          </div>
          <div className="flex items-center">
            <FaPhone />
            <div className={styles.infoInvoice}>www.accuratepestcontrol.ae</div>
          </div>
          <div className="flex items-center">
            <FaPhone />
            <div className={styles.infoInvoice}>info@pestcontrol.ae</div>
          </div>
          <div className="flex items-center">
            <FaPhone />
            <div className={styles.infoAddress}>
              S-12 Greece # K-12 International City Dubai UAE
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid className="mt-5" item lg={3} xs={12} sm={6} md={4}></Grid>

        <Grid className="mt-5" item lg={4} xs={12} sm={6} md={4}>
          <div className={styles.payment}>Paymen Voucher</div>
        </Grid>

        <Grid className="mr-2" item lg={3} xs={12} sm={6} md={4}>
          <div>
            <div className="border border-black">
              <div className="flex">
                {/* Receipt No Box */}
                <div className="flex-1 border-r border-black">
                  <div
                    className={`${styles.color} text-white p-1 text-xs flex justify-between items-center`}
                  >
                    <span>Receipt No</span>
                    <span className="text-right" dir="rtl">
                      رسید نمبر
                    </span>
                  </div>
                  {/* {allInvoiceList.service_invoice_id} */}
                  <div className="h-16 p-2">
                    {allInvoiceList.service_invoice_id}
                  </div>
                </div>

                {/* Date Box */}
                <div className="flex-1">
                  <div
                    className={`${styles.color} text-white p-1 text-xs flex justify-between items-center`}
                  >
                    <span>Date</span>
                    <span className="text-right" dir="rtl">
                      تاريخ
                    </span>
                  </div>
                  <div className="h-16 p-2">{allInvoiceList.issued_date}</div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>

      <div className="flex mt-5">
        {/* Black Left Section */}
        <div
          className={`text-white p-2 flex items-center justify-center ${styles.color}`}
          style={{ width: "100px" }}
        >
          <span className="text-sm font-medium">Mr/Mrs</span>
        </div>

        {/* Main Title Section */}
        <div className="flex-1 border-y border-black py-2 px-4">
          <h1 className="text-xl text-center font-handwriting tracking-wide">
            {allInvoiceList?.user?.name}
          </h1>
        </div>

        <div
          className={`text-white p-2 flex items-center justify-center ${styles.color}`}
          style={{ width: "100px" }}
        >
          <span className="text-lg">السيد/ السيدة</span>
        </div>
      </div>

      <div className="flex mt-5">
        {/* Black Left Section */}
        <div
          className={`text-white p-2 flex items-center justify-center ${styles.color}`}
          style={{ width: "200px" }}
        >
          <span className="text-sm font-medium">The Sum of DHS</span>
        </div>

        {/* Main Title Section */}
        <div className="flex-1 border-y border-black py-2 px-4">
          <h1 className="text-xl text-center font-handwriting tracking-wide">
            {numberToWords(allInvoiceList.paid_amt)} only /-
          </h1>
        </div>

        <div
          className={`text-white p-2 flex items-center justify-center ${styles.color}`}
          style={{ width: "230px" }}
        >
          <span className="text-lg text-right" dir="rtl">
            مجموع دائرة الخدمات الإنسانية
          </span>
        </div>
      </div>

      <div className="flex mt-5">
        {/* Cash Section */}
        <div className="flex flex-1">
          <div
            className={`text-white p-2 flex items-center justify-center ${styles.color}`}
            style={{ width: "40px" }}
          >
            <span className="text-xs font-medium">Cash</span>
          </div>
          <div className="flex-1 border-y border-black py-1 px-2">test</div>
          <div
            className={`text-white p-2 flex items-center justify-center ${styles.color}`}
            style={{ width: "40px" }}
          >
            <span className="text-xs text-right" dir="rtl">
              نقد
            </span>
          </div>
        </div>

        {/* Bank Section */}
        <div className="flex flex-1">
          <div
            className={`text-white p-2 flex items-center justify-center ${styles.color}`}
            style={{ width: "40px" }}
          >
            <span className="text-xs font-medium">Bank</span>
          </div>
          <div className="flex-1 border-y border-black py-1 px-2">test</div>
          <div
            className={`text-white p-2 flex items-center justify-center ${styles.color}`}
            style={{ width: "40px" }}
          >
            <span className="text-xs text-right" dir="rtl">
              بنك
            </span>
          </div>
        </div>

        {/* Date Section */}
        <div className="flex flex-1">
          <div
            className={`text-white p-2 flex items-center justify-center ${styles.color}`}
            style={{ width: "40px" }}
          >
            <span className="text-xs font-medium">Date</span>
          </div>
          <div className="flex-1 border-y border-black py-1 px-2">test</div>
          <div
            className={`text-white p-2 flex items-center justify-center ${styles.color}`}
            style={{ width: "40px" }}
          >
            <span className="text-xs text-right" dir="rtl">
              تاريخ
            </span>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="px-4 mt-5">
          <div className="border border-black" style={{ width: "350px" }}>
            <div
              className={`${styles.color} text-white p-1 text-sm flex justify-between items-center`}
            >
              <span>Receivers Sign</span>
              <span style={{ fontFamily: "Arial, sans-serif" }}>
                توقيع المستلم
              </span>
            </div>
            <div className="h-16 p-2">{/* Space for actual signature */}</div>
          </div>
        </div>

        <div className="px-4 mt-5">
          <div className="border border-black" style={{ width: "350px" }}>
            <div
              className={`${styles.color} text-white p-1 text-sm flex justify-between items-center`}
            >
              <span>Receivers Sign</span>
              <span style={{ fontFamily: "Arial, sans-serif" }}>
                أمين الصندوق
              </span>
            </div>
            <div className="h-16 p-2">{/* Space for actual signature */}</div>
          </div>
        </div>

        <div className="px-4 mt-5">
          <img className={styles.qrImage} src="/qr.png" />
        </div>
      </div>

      <TableContainer className="mt-5" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Debit</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="wave" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="wave" width={200} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="wave" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="wave" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="wave" width={100} />
                    </TableCell>

                  </TableRow>
                ))
              : rowData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {format(new Date(row.updated_at), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.cr_amt}</TableCell>
                    <TableCell>{row.dr_amt}</TableCell>
                    <TableCell>{row.cash_balance}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Page;
