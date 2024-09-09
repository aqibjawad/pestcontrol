import React from "react";
import SearchInput from "@/components/generic/SearchInput";

import tableStyles from "../../../../styles/upcomingJobsStyles.module.css";

import styles from "../../../../styles/generics/serachInputStyles.module.css";

const serviceReport = () => {
    return (
        <div style={{padding: "30px" }}>
            <div style={{ fontSize: "20px", fontFamily: "semibold", marginBottom: "0.5rem" }}> Services report </div>
            {listServiceTable()}
        </div>
    );
};

const sales = () => {
    return (
        <div style={{ border: "1px solid #68CC5838", padding: "30px", borderRadius: "10px" }}>
            <div style={{ fontSize: "20px", fontFamily: "semibold", marginBottom: "-4rem" }}> Sales </div>
            <div className="flex">
                <div className="flex-grow">

                </div>
                <div className="flex">
                    <div style={{ marginTop: "2rem", marginRight: "2rem" }}>
                        <SearchInput />
                    </div>
                </div>
            </div>
            {listSaleTable()}
        </div>
    );
};

const FeedBack = () => {
    return (
        <div style={{ border: "1px solid #68CC5838", padding: "30px", borderRadius: "10px" }}>
            <div style={{ fontSize: "20px", fontFamily: "semibold", marginBottom: "-4rem" }}> Feedback </div>
            <div className="flex">
                <div className="flex-grow">

                </div>
                <div className="flex" style={{ display: "flex", alignItems: "center" }}>

                    <div style={{ marginTop: "2rem", marginRight: "2rem" }}>
                        <SearchInput />
                    </div>

                    <div style={{ marginTop: "2rem", border: "1px solid #38A73B", borderRadius: "8px", height: "40px", width: '100px', alignItems: "center", display: 'flex' }}>
                        <img
                            src="/Filters lines.svg"
                            height={20}
                            width={20}
                            className="ml-2 mr-2"
                        />
                        Filters
                    </div>

                </div>
            </div>
            {listeedBackTable()}
        </div>
    );
};

const rows = Array.from({ length: 2 }, (_, index) => ({
    clientName: "Olivia Rhye",
    clientContact: "10",
    quoteSend: "10",
    quoteApproved: "50",
    cashAdvance: "$50,000"
}));

const listSaleTable = () => {
    return (
        <div className={tableStyles.tableContainer}>
            <table class="min-w-full bg-white ">
                <thead class="">
                    <tr>
                        <th class="py-5 px-4 border-b border-gray-200 text-left"> Name </th>
                        <th class="py-2 px-4 border-b border-gray-200 text-left">Contact</th>
                        <th class="py-2 px-4 border-b border-gray-200 text-left">
                            Quote Send
                        </th>
                        <th class="py-2 px-4 border-b border-gray-200 text-left">
                            Quote Approved
                        </th>

                        <th class="py-2 px-4 border-b border-gray-200 text-left">
                            Cash Advance
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">

                            <td className="py-5 px-4"> {row.clientName} </td>

                            <td className="py-2 px-4">
                                <div className={tableStyles.clientContact}>{row.clientContact}</div>
                            </td>

                            <td className="py-2 px-4">
                                <div className={tableStyles.clientContact}>{row.clientContact}</div>
                            </td>

                            <td className="py-2 px-4">
                                <div className={tableStyles.clientContact}>{row.clientContact}</div>
                            </td>

                            <td className="py-2 px-4">
                                <div className={tableStyles.clientContact}>{row.clientContact}</div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const listeedBackTable = () => {
    return (
        <div className={tableStyles.tableContainer}>
            <table class="min-w-full bg-white ">
                <thead class="">
                    <tr>
                        <th class="py-5 px-4 border-b border-gray-200 text-left"> Name </th>
                        <th class="py-2 px-4 border-b border-gray-200 text-left">Report</th>
                        <th class="py-2 px-4 border-b border-gray-200 text-left">
                            Date
                        </th>
                        <th class="py-2 px-4 border-b border-gray-200 text-left">
                            Feedback
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">

                            <td className="py-5 px-4"> {row.clientName} </td>

                            <td className="py-2 px-4">
                                <div className={tableStyles.clientContact}>{row.clientContact}</div>
                            </td>

                            <td className="py-2 px-4">
                                <div className={tableStyles.clientContact}>{row.clientContact}</div>
                            </td>

                            <td className="py-2 px-4">
                                <div className={tableStyles.clientContact}>{row.clientContact}</div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const listServiceTable = () => {
    return (
        <div className={tableStyles.tableContainer}>
            <table class="min-w-full bg-white ">
                <thead class="">
                    <tr>
                        <th class="py-5 px-4 border-b border-gray-200 text-left"> Sr. </th>
                        <th class="py-2 px-4 border-b border-gray-200 text-left"> Name </th>
                        <th class="py-2 px-4 border-b border-gray-200 text-left">
                            Completed Jobs
                        </th>
                        <th class="py-2 px-4 border-b border-gray-200 text-left">
                            Reports
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">

                            <td className="py-5 px-4"> {row.clientName} </td>

                            <td className="py-2 px-4">
                                <div className={tableStyles.clientContact}>{row.clientContact}</div>
                            </td>

                            <td className="py-2 px-4">
                                <div className={tableStyles.clientContact}>{row.clientContact}</div>
                            </td>

                            <td className="py-2 px-4">
                                <div className={tableStyles.clientContact}>{row.clientContact}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Reports = () => {
    return (
        <div>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12"> {serviceReport()} </div>
            </div>

            <div className="mt-10 mb-10">{sales()}</div>
            <div className="mt-10 mb-10">{FeedBack()}</div>

        </div>
    )
}

export default Reports