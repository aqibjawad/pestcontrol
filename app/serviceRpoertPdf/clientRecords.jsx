import React from "react";
import styles from "../../styles/viewQuote.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Skeleton,
} from "@mui/material";

const ClientRecords = ({ serviceReportList, loading }) => {
  const rows = serviceReportList?.pest_found_services || [];
  const rowsAreas = serviceReportList?.areas || [];
  const rowsProducts = serviceReportList?.used_products || [];

  // Skeleton Loader for rows
  const skeletonRows = [1, 2, 3, 4].map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton variant="text" width={100} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={150} />
      </TableCell>
    </TableRow>
  ));

  const skeletonAreaRows = [1, 2, 3, 4].map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton variant="text" width={100} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={100} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={150} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={200} />
      </TableCell>
    </TableRow>
  ));

  const skeletonProductRows = [1, 2, 3, 4].map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton variant="text" width={100} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={50} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={50} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={50} />
      </TableCell>
    </TableRow>
  ));

  return (
    <div>
      <div className={styles.clientRecord}>
        <div className={styles.clientHead}>Pest Service Record</div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell>Pest Name</TableCell>
                <TableCell>Service Title</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? skeletonRows
                : rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.pest_name}</TableCell>
                      <TableCell>{row.service_title}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className={styles.clientRecord}>
        <div className={styles.clientHead}>Areas</div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell>Inspected Area</TableCell>
                <TableCell>Infection Level</TableCell>
                <TableCell>Manifested Area</TableCell>
                <TableCell>Report and Follow Up</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? skeletonAreaRows
                : rowsAreas.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.inspected_areas}</TableCell>
                      <TableCell>{row.infestation_level}</TableCell>
                      <TableCell>{row.manifested_areas}</TableCell>
                      <TableCell>{row.report_and_follow_up_detail}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className={styles.clientRecord}>
        <div className={styles.clientHead}>Products Used</div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Dose</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? skeletonProductRows
                : rowsProducts.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.product_name}</TableCell>
                      <TableCell>{row.dose}</TableCell>
                      <TableCell>{row.qty}</TableCell>
                      <TableCell>{row.total}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ClientRecords;
