import React from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const JobDetails = ({ jobList }) => {
  return (
    <div>
      <div className="pageTitle"> {jobList?.user?.name} </div>
      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <TableContainer sx={{ mt: 6 }}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Job Title : </strong>
                  </TableCell>
                  <TableCell> {jobList?.job_title} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Description : </strong>
                  </TableCell>
                  <TableCell> {jobList?.description} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Reference : </strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    {jobList?.user?.client?.referencable?.name}{" "}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={4}>
          <TableContainer sx={{ mt: 6 }}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Services : </strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    {jobList?.job_services
                      ?.map((service) => service?.service?.service_title)
                      .join(", ") || "N/A"}{" "}
                  </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Treatment Methods : </strong>
                  </TableCell>
                  <TableCell>
                    {jobList?.treatment_methods
                      ?.map((method) => method.name)
                      .join(", ") || "N/A"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default JobDetails;
