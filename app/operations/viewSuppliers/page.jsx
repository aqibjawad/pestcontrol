"use client";
import React, { useEffect, useState } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";

import { getAllSuppliers } from "@/networkUtil/Constants";
import Loading from "../../../components/generic/Loading";
import APICall from "@/networkUtil/APICall";
import { Delete, Edit, ViewAgenda } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const apiCall = new APICall();
  const router = new useRouter();
  const [fetchingData, setFetchingData] = useState(true);
  const [suppliersList, setSupplierList] = useState();

  const listServiceTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Supplier{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Company
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Email
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody className={tableStyles.rowContainer}>
            {suppliersList &&
              suppliersList.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row.supplier_name}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row.company_name}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>{row.email}</div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {"AED -9000"}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      <Edit color="primary" /> <Delete sx={{ color: "red" }} />
                      <Link
                        href={"operations/viewSuppliers/"}
                        sx={{
                          marginLeft: "10px",
                          color: "green",
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    setFetchingData(true);
    const response = await apiCall.getDataWithToken(getAllSuppliers);
    console.log(response);
    setSupplierList(response.data);
    setFetchingData(false);
  };

  return (
    <div>
      <>
        <div>
          <div className="flex">
            <div className="flex-grow">
              <div className="pageTitle">Supplier</div>
            </div>
            <div>
              <div className="flex">
                {/* <div>
                  <SearchInput />
                </div> */}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "2rem",
            }}
          >
            <div
              onClick={() => {
                router.push("/account/addSuppliers");
              }}
              style={{
                backgroundColor: "#32A92E",
                marginBottom: "2rem",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: "5px",
                height: "48px",
                width: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
                cursor: "pointer",
              }}
            >
              Add
            </div>

            <div
              style={{
                backgroundColor: "#32A92E",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                height: "44px",
                width: "202px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
                padding: "12px, 16px, 12px, 16px",
                borderRadius: "10px",
              }}
            >
              Download all
            </div>
          </div>
        </div>
        {fetchingData ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">{listServiceTable()}</div>
          </div>
        )}
      </>
    </div>
  );
};

export default Page;
