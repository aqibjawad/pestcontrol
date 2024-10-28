import React from "react";
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr No</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Client Name</TableCell>
            <TableCell>Recieved By</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>View Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableCell> 1 </TableCell>
          <TableCell> October 28, 2024 </TableCell>
          <TableCell> Aqib Jawad </TableCell>
          <TableCell> Shahbaz Ali </TableCell>
          <TableCell> 2800 </TableCell>
          <TableCell> View Details </TableCell>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Page;
