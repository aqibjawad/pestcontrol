"use client";
import React from "react";
import { useExpenseCategory } from "./useTreatMethodHook";
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
import withAuth from "@/utils/withAuth";

const Page = () => {
  const {
    fetchingData,
    expenseList,
    methodName,
    setMethodName,
    sendingData,
    addExpense,
    updateExpense,
    editingExpenseId,
    startEditing,
    cancelEditing,
  } = useExpenseCategory();

  const handleEditClick = (id, name) => {
    startEditing(id, name);
  };

  const handleUpdateClick = () => {
    updateExpense();
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
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Edit
                  sx={{ color: "#3deb49", cursor: "pointer" }}
                  onClick={() => handleEditClick(item.id, item.name)}
                />
                <Delete
                  sx={{
                    color: "red",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                />
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
            <div className="pageTitle">
              {editingExpenseId ? "Edit" : "Add"} Treatment Method
            </div>
            <div className="mt-10"></div>
            <InputWithTitle
              title={"Enter Treatment Method"}
              placeholder={"Enter Treatment Method"}
              value={methodName}
              onChange={(value) => setMethodName(value)}
            />
            <div className="mt-10"></div>
            <GreenButton
              sendingData={sendingData}
              onClick={editingExpenseId ? handleUpdateClick : addExpense}
              title={
                editingExpenseId
                  ? "Update Treatment Method"
                  : "Add Treatment Method"
              }
            />
            {/* {editingExpenseId && (
              <button onClick={handleCancelClick} className="ml-4">
                Cancel
              </button>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Page);
