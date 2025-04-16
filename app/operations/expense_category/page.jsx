"use client";
import React from "react";
import { useExpenseCategory } from "./useExpenseHook";
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

  // Updated edit handler to set the expense category value
  const handleEditClick = (id, category) => {
    startEditing(id, category);
    setExpenseCategory(category); // Set the current category name in the input
  };

  const handleUpdateClick = () => {
    updateExpense(editingExpenseId, expense_category);
  };

  const handleCancelClick = () => {
    cancelEditing();
    setExpenseCategory(""); // Clear the input field when canceling
  };

  // Handle input change for inline editing
  const handleInlineEdit = (e) => {
    setExpenseCategory(e.target.value);
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
                    onChange={handleInlineEdit}
                    className={styles.editInput}
                    autoFocus // Automatically focus the input when editing starts
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
      <div className="pageTitle">Expense Category</div>
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
              title={
                editingExpenseId
                  ? "Update Expense Category"
                  : "Add Expense Category"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Page);
