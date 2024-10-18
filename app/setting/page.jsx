import React from "react";
import styles from "../../styles/settings.module.css";
import Link from "next/link";
import { Grid } from "@mui/material";

const Page = () => {
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
                  <Link href="/account/addPurchase">Add Purchase Order</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/account/purchaseOrders">
                    View Purchase Order
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
                  <Link href="/account/viewVehicles">View Vehicle Expense</Link>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>

        {/* Add Customer */}
        <Grid lg={12} item xs={12}>
          <div style={{ border: "1px solid black", padding: "10px" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                marginBottom: "1rem",
              }}
            >
              Customer
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/customers">Add Customer</Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/addCustomerLedger">Add Customer Ledger</Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/sales/addSales">Add Sales</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/allCustomers">View Customers</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/sales/allSales">View Sales</Link>
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
                  <Link href="/operations/treatment_method">
                    Add Treatment Method
                  </Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/createJob">Add Job</Link>
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

              {/* <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/allJobs">View Contracts</Link>
                </div>
              </Grid> */}

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/allServiceReports">View Service Reports</Link>
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
                  <Link href="/hr/employee">Add Emplyees</Link>
                </div>
              </Grid>

              <Grid className="" item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/operations/viewEmployees">View Emloyees</Link>
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

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/terms&conditions">Terms and Conditions</Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={styles.addProd}>
                  <Link href="/operations/banks">Add Banks</Link>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* <Grid className="mt-5" item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/viewInvoice">View Invoice</Link>
          </div>
        </Grid> */}
      </Grid>
    </>
  );
};

export default Page;
