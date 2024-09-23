"use client";
import React from "react";
import { useExpenseCategory } from "./useTreatMethodHook"; // Adjust the import path as needed
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
    expenseList,
    methodName,
    setTreatMethod,
    sendingData,
    addExpense,
    updateExpense,
    editingExpenseId,
    startEditing,
    cancelEditing,
  } = useExpenseCategory();

  const handleEditClick = (id, number) => {
    startEditing(id, number);
  };

  const handleUpdateClick = () => {
    updateExpense(editingExpenseId, methodName);
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
            <TableCell>Treatment Method</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenseList?.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {editingExpenseId === item.id ? (
                  <input
                    type="text"
                    value={methodName}
                    onChange={(e) => setTreatMethod(e.target.value)}
                    className={styles.editInput}
                  />
                ) : (
                  item.name
                )}
              </TableCell>
              <TableCell>
                {editingExpenseId === item.id ? (
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
                      onClick={() => handleEditClick(item.id, item.methodName)}
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
      <div className="pageTitle">Treatment Method</div>
      <div className="mt-10"></div>
      {fetchingData ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>{viewList()}</div>
          <div>
            <div className="pageTitle">Add Treatment Method</div>
            <div className="mt-10"></div>
            <InputWithTitle
              title={"Enter treatment Method"}
              placeholder={"Enter treatment Method"}
              value={methodName}
              onChange={(value) => setTreatMethod(value)}
            />
            <div className="mt-10"></div>
            <GreenButton
              sendingData={sendingData}
              onClick={
                editingExpenseId
                  ? () => updateExpense(editingExpenseId, methodName)
                  : addExpense
              }
              title={
                editingExpenseId
                  ? "Update treatment Method"
                  : "Add treatment Method"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
