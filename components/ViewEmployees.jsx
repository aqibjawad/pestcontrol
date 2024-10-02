import React, { useEffect, useState } from "react";
import GreenButton from "./generic/GreenButton";
import { useRouter } from "next/navigation";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Loading from "../components/generic/Loading";
import tableStyles from "../styles/tableStyles.module.css";
import { AppHelpers } from "../Helper/AppHelpers";
const ViewEmployees = () => {
  const router = useRouter();
  const api = new APICall();
  const [fethching, setFethching] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees();
  }, []);
  const getEmployees = async () => {
    setFethching(true);
    const response = await api.getDataWithToken(getAllEmpoyesUrl);
    console.log(response);
    setEmployees(response.data);
    setFethching(false);
  };

  const listTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table class="min-w-full bg-white ">
          <thead class="">
            <tr>
              <th class="py-5 px-4 border-b border-gray-200 text-left">
                Photo and Name
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Email
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Contact
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Passport
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">
                  <div className="flex items-center">
                    <div className={tableStyles.clientPhoto}>
                      <img
                        className={tableStyles.clientImage}
                        src={row.employee[0]?.profile_image}
                      />
                    </div>
                    <div className="ml-10">
                      <div className={tableStyles.clientName}>{row.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientName}>{row.email}</div>
                  <div className={tableStyles.clientPhone}>
                    {row.clientEmail}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientName}>
                    {row.employee?.phone_number}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientName}>
                      {row.employee?.passport_no}
                  </div>
                </td>

                <td className="py-2 px-4">
                  <div className={tableStyles.clientName}>{"View Detail"}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="flex">
        <div className="flex-grow">
          <div className="pageTitle">Employees</div>
        </div>
        <div>
          <GreenButton
            onClick={() => {
              router.push("/hr/employee");
            }}
            title={"Add"}
          />
        </div>
      </div>
      {fethching ? <Loading /> : <>{listTable()}</>}
    </div>
  );
};

export default ViewEmployees;
