"use client";

import React, { useState, useEffect } from "react";

import Layout from "../../components/layout";

import APICall from "@/networkUtil/APICall";
import { getDevicesURL } from "@/networkUtil/Constants";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import Box from "@mui/material/Box"; // Import Box for centering loader

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [allDevices, setAllDevices] = useState([]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getDevices(id);
    }
  }, [id]);

  const getDevices = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getDevicesURL}/${id}`);
      setAllDevices(response.data);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    } finally {
      setFetchingData(false);
    }
  };

  if (fetchingData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Layout>
      <div style={{ textAlign: "center", fontSize: "14t" }}>
        Asset Care Policy
      </div>
      <div style={{ fontWeight: "bold" }}>1. Introduction</div>
      <div className="mt-1" style={{ fontSize: "8pt" }}>
        The asset assigned to you is the property of APCS and has been prepared
        by the IT Department for use on the Accurate Pest Control network. You
        are personally responsible and liable for the care, safe storage, and
        appropriate use of any asset issued to you, including electronic
        equipment, portable devices, or related accessories. The term “asset”
        includes any company-owned item, such as: <br /> (a) SIM Card <br /> (b)
        Mobile phone
      </div>
      <div className="mt-3" style={{ fontWeight: "bold" }}>
        2. Policy Summary
      </div>
      <div className="mt-1" style={{ fontSize: "8pt" }}>
        By accepting an asset, the employee agrees to comply with APCS Asset
        Care Policy and understands they are fully responsible and liable for
        any damage, loss, or theft of the asset due to negligence or
        non-compliance with this policy. In such cases, the employee will be
        subject to paying the actual repair and/or replacement costs. The IT
        department will determine replacement costs based on the depreciated
        value of the asset. <br /> APCS may, at any time and without prior
        notice, require the return of the asset and any associated equipment
      </div>
      <div className="mt-3" style={{ fontWeight: "bold" }}>
        3. Usage Guidelines
      </div>
      <div style={{ fontSize: "8pt" }}>
        Local Calls Only: The assigned SIM card is intended strictly for local
        business-related calls. International calls are not permitted. Any
        unauthorized international calls made using the assigned SIM card will
        result in the charges being deducted directly from the employee
        salary.
      </div>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}
        border="1"
      >
        <tbody>
          <tr>
            <td style={{ padding: "8px" }}>Received By:</td>
            <td style={{ padding: "8px" }}> {allDevices?.user?.name} </td>
            <td style={{ padding: "8px" }}>Received from:</td>
            <td style={{ padding: "8px" }}>Admin</td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>Sim No:</td>
            <td style={{ padding: "8px" }}>
              {allDevices?.user?.employee?.phone_number}
            </td>
            <td style={{ padding: "8px" }}>Serial No:</td>
            <td style={{ padding: "8px" }}> {allDevices?.code_no} </td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }} colSpan="2">
              Make and Modal:
            </td>
            <td style={{ padding: "8px" }} colSpan="2">
              {allDevices?.name} {allDevices?.model}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }} colSpan="2">
              Equipment Included:
            </td>
            <td style={{ padding: "8px" }} colSpan="2">
              {allDevices?.desc}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }} colSpan="2">
              NOL Card:
            </td>
            <td style={{ padding: "8px" }} colSpan="2">
              _______________________________________________
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-5" style={{ fontWeight: "bold" }}>
        Receiver Signature: _______________________________________________
      </div>

      <div className="mt-3" style={{ fontWeight: "bold", fontStyle: "italic" }}>
        This form must be completed when receiving a device from the company.{" "}
      </div>

      <div className="mt-3" style={{ fontWeight: "bold", fontStyle: "italic" }}>
        Please ensure that all fields are filled out completely.
      </div>
    </Layout>
  );
};

export default Page;
