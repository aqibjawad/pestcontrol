"use client";

import React, { useState } from "react";
import styles from "../../styles/settings.module.css";
import Link from "next/link";
import { Grid } from "@mui/material";

import CashBalanceModal from "../accountant/cashBalance/cashBalance";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Grid container spacing={2}>
        {/* Supplier Grid */}
        <Grid item lg={12} xs={12}>
          <div style={{ border: "1px solid black", padding: "10px" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                marginBottom: "1rem",
              }}
            >
              Supplier
            </div>
            <Grid container spacing={2}>
              {/* Add Product */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/account/addProduct">Add Product</Link>
                </div>
              </Grid>

              {/* Add Supplier */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/account/addSuppliers">Add Supplier</Link>
                </div>
              </Grid>

              {/* Add Supplier Expense */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/operations/addSupplierExpense">
                    Add Supplier Payments
                  </Link>
                </div>
              </Grid>

              {/* Add Purchase Order */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/account/addPurchase">Add Delivery Order</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/account/purchaseOrders">
                    View Delivery Order
                  </Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/operations/viewInventory">View Inventory</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/account/viewSuppliers">View Suppliers</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/addPurchase">Add Purchase Order</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/viewPurchase">View Purchase Order</Link>
                </div>
              </Grid>

            </Grid>
          </div>
        </Grid>

        {/* Expenses Grid */}
        <Grid lg={12} item xs={12}>
          <div style={{ border: "1px solid black", padding: "10px" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                marginBottom: "1rem",
              }}
            >
              Expenses
            </div>
            <Grid container spacing={2}>
              {/* Add Expense Category */}
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <div className={styles.addProd}>
                  <Link href="/operations/expense_category">
                    Add Expense Category
                  </Link>
                </div>
              </Grid>

              {/* Add Expense */}
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <div className={styles.addProd}>
                  <Link href="/operations/addExpense">Add Expense</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={4}>
                <div className={styles.addProd}>
                  <Link href="/operations/viewAllExpenses">View Expense</Link>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>

        {/* Add VEHCILE */}
        <Grid lg={12} item xs={12}>
          <div style={{ border: "1px solid black", padding: "10px" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                marginBottom: "1rem",
              }}
            >
              Vehciles
            </div>
            <Grid container spacing={2}>
              {/* Add Expense Category */}
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <div className={styles.addProd}>
                  <Link href="/operations/vehciles">Add Vehicles</Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4}>
                <div className={styles.addProd}>
                  <Link href="/account/addVehiclesExpense">
                    Add Vehicle Expense
                  </Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={4}>
                <div className={styles.addProd}>
                  <Link href="/account/viewAllVehciles">View Vehicles</Link>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>

        {/* Add Clients */}
        <Grid lg={12} item xs={12}>
          <div style={{ border: "1px solid black", padding: "10px" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                marginBottom: "1rem",
              }}
            >
              Clients
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/quotation">Add Quotation</Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/createJob">Add Job</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/clients">View Clients</Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/setting/serviceAgreements">Add Services</Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/terms&conditions">Terms and Conditions</Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/operations/treatment_method">
                    Add Treatment Method
                  </Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/viewQuote">View Quote</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/allJobs">View Jobs</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/contracts">View Contracts</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/allServiceReports">View Service Reports</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/invoice">View Invoices</Link>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>

        {/* Add Employee */}
        <Grid lg={12} item xs={12}>
          <div style={{ border: "1px solid black", padding: "10px" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                marginBottom: "1rem",
              }}
            >
              Employee
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/hr/employee">Add Employee</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/operations/viewEmployees">View Emloyees</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/operations/firedEmployees">
                    View Fired Emloyees
                  </Link>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>

        {/* Add Vendors */}
        <Grid lg={12} item xs={12}>
          <div style={{ border: "1px solid black", padding: "10px" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                marginBottom: "1rem",
              }}
            >
              Vendors
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/addVendor">Add Vendors</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/allVendors">View Vendors</Link>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>

        {/* Add Accountant */}
        <Grid lg={12} item xs={12}>
          <div style={{ border: "1px solid black", padding: "10px" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                marginBottom: "1rem",
              }}
            >
              Accountant
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/accountant/viewTransactions">
                    View Transactions{" "}
                  </Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/accountant/payments">Pending Payments</Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/device">Devices</Link>
                </div>
              </Grid>

              <>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <div className={styles.addProd} onClick={handleOpenModal}>
                    Add Capital
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <div className={styles.addProd}>
                    <Link href="/operations/banks">View Banks</Link>
                  </div>
                </Grid>

                {/* Pass the open and onClose props */}
                <CashBalanceModal
                  open={isModalOpen}
                  onClose={handleCloseModal}
                />
              </>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/branches">Add Branches</Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/branches">Add Client Banks</Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/settelmentedInvoice">
                    {" "}
                    Settelmented Invoices{" "}
                  </Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/cheques"> Recieveable Cheques </Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/accountant/payablecheques">
                    {" "}
                    Payable Cheques{" "}
                  </Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/agreement"> Agreement </Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/accountant/totalRecieves"> Total Recieves </Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/accountant/totalPayments"> Total Payments </Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/stockUseReport"> Stock Report </Link>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
