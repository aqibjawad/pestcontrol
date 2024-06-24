import React, { useState } from "react";
import tableStyles from "../../../../styles/upcomingJobsStyles.module.css";
import SearchInput from "@/components/generic/SearchInput";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import styles from "../../../../styles/loginStyles.module.css";

const rows = Array.from({ length: 10 }, (_, index) => ({
    clientName: "Olivia Rhye",
    clientContact: "10",
    quoteSend: "10",
    quoteApproved: "50",
    cashAdvance: "$50,000"
}));

const listServiceTable = () => {
    return (
        <div className={tableStyles.tableContainer}>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-5 px-4 border-b border-gray-200 text-left"> Customer </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left"> Quotes By </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left"> Job Title </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left"> Reference </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left"> Priority </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left"> Date </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left"> Status </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="py-5 px-4">{row.clientName}</td>
                            <td className="py-2 px-4"><div className={tableStyles.clientContact}>{row.clientContact}</div></td>
                            <td className="py-2 px-4"><div className={tableStyles.clientContact}>{row.clientContact}</div></td>
                            <td className="py-2 px-4"><div className={tableStyles.clientContact}>{row.clientContact}</div></td>
                            <td className="py-2 px-4"><div className={tableStyles.clientContact}>{row.clientContact}</div></td>
                            <td className="py-2 px-4"><div className={tableStyles.clientContact}>{row.clientContact}</div></td>
                            <td className="py-2 px-4"><div className={tableStyles.clientContact}>{row.clientContact}</div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Quotation = () => {

    return (
        <div>
            <div style={{ padding: "30px", borderRadius: "10px" }}>
                <div style={{ fontSize: "20px", fontFamily: "semibold", marginBottom: "-4rem" }}> Quotations </div>
                <div className="flex">
                    <div className="flex-grow"></div>
                    <div className="flex" style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginTop: "2rem", marginRight: "2rem" }}>
                            <SearchInput />
                        </div>
                        <div style={{ marginTop: "2rem", border: "1px solid #38A73B", borderRadius: "8px", height: "40px", width: '100px', alignItems: "center", display: 'flex' }}>
                            <img src="/Filters lines.svg" height={20} width={20} className="ml-2 mr-2" />
                            Filters
                        </div>
                        <div onClick={handleClickOpen} style={{ marginTop: "2rem", backgroundColor: "#32A92E", color: 'white', fontWeight: '600', fontSize: "16px", marginLeft: "auto", marginRight: "auto", height: "48px", width: "150px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "1rem", cursor: "pointer" }}>
                            + Vendors
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                    <div style={{ backgroundColor: "#32A92E", color: 'white', fontWeight: '600', fontSize: "16px", height: "44px", width: "202px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "1rem", padding: "12px, 16px, 12px, 16px", borderRadius: "10px" }}>
                        Download all
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">{listServiceTable()}</div>
            </div>

        </div>
    );
};

export default Quotation;
