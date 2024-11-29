"use client";
import React from "react";
import { useExpenseCategory } from "./useExpenseHook"; // Adjust the import path as needed
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
    expense_category,
    setExpenseCategory,
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
    updateExpense(editingExpenseId, expense_category);
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
            <TableCell>Expense Category</TableCell>
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
                    value={expense_category}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className={styles.editInput}
                  />
                ) : (
                  item.expense_category
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
                      onClick={() =>
                        handleEditClick(item.id, item.expense_category)
                      }
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
      <div className="pageTitle">Vehicles</div>
      <div className="mt-10"></div>
      {fetchingData ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>{viewList()}</div>
          <div>
            <div className="pageTitle">Add Expense Category</div>
            <div className="mt-10"></div>
            <InputWithTitle
              title={"Enter Expense Category"}
              placeholder={"Enter Expense Category"}
              value={expense_category}
              onChange={(value) => setExpenseCategory(value)}
            />
            <div className="mt-10"></div>
            <GreenButton
              sendingData={sendingData}
              onClick={
                editingExpenseId
                  ? () => updateExpense(editingExpenseId, expense_category)
                  : addExpense
              }
              title={editingExpenseId ? "Update Expense Category" : "Add Expense Category"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Page);
