"use client";
import React from "react";
import { useBanks } from "./useBankHook"; // Adjust the import path as needed
import Loading from "../../../components/generic/Loading";
import styles from "../../../styles/account/addBrandStyles.module.css";
import { Delete, Edit, Check, Close } from "@mui/icons-material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import GreenButton from "@/components/generic/GreenButton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Page = () => {
  const {
    fetchingData,
    vehiclesList,
    bank_name,
    balance,
    setBankNumber,
    setBalance,
    sendingData,
    addBank,
    updateBank,
    editingBanksId,
    startEditing,
    cancelEditing,
  } = useBanks();

  const handleEditClick = (id, number) => {
    startEditing(id, number);
  };

  const handleUpdateClick = () => {
    updateBank(editingBanksId, bank_name, balance);
  };

  const handleCancelClick = () => {
    cancelEditing();
  };

  const viewList = () => (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr #</TableCell>
            <TableCell>Bank Name</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehiclesList?.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {editingBanksId === item.id ? (
                  <input
                    type="text"
                    value={bank_name}
                    onChange={(e) => setBankNumber(e.target.value)}
                    className={styles.editInput}
                  />
                ) : (
                  item.bank_name
                )}
              </TableCell>
              <TableCell>
                {editingBanksId === item.id ? (
                  <input
                    type="text"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className={styles.editInput}
                  />
                ) : (
                  item.balance
                )}
              </TableCell>
              <TableCell>
                {editingBanksId === item.id ? (
                  <>
                    <Check
                      sx={{ color: "#3deb49", cursor: "pointer" }}
                      onClick={handleUpdateClick}
                    />
                    <Close
                      sx={{
                        color: "red",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                      onClick={handleCancelClick}
                    />
                  </>
                ) : (
                  <>
                    <Edit
                      sx={{ color: "#3deb49", cursor: "pointer" }}
                      onClick={() => handleEditClick(item.id, item.bank_name)}
                    />
                    <Delete
                      sx={{
                        color: "red",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div>
      <div className="pageTitle">Banks</div>
      <div className="mt-10"></div>
      {fetchingData ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>{viewList()}</div>
          <div>
            <div className="pageTitle">Add Bank</div>
            <div className="mt-10"></div>

            <InputWithTitle
              title={"Enter Bank Name"}
              placeholder={"Enter Bank Number"}
              value={bank_name}
              onChange={(value) => setBankNumber(value)}
            />
            <div className="mt-10"></div>

            <InputWithTitle
              title={"Enter Balance"}
              placeholder={"Enter Blance"}
              value={balance}
              onChange={(value) => setBalance(value)}
            />
            <div className="mt-10"></div>
            <GreenButton
              sendingData={sendingData}
              onClick={
                editingBanksId
                  ? () => updateBank(editingBanksId, bank_name)
                  : addBank
              }
              title={editingBanksId ? "Update Bank" : "Add Bank"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
