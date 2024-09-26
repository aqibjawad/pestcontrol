import React from "react";
import styles from "../../styles/settings.module.css";
import Link from "next/link";
import { Grid } from "@mui/material";

const Page = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/account/addProduct">Add Product</Link>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/setting/serviceAgreements">Add Services</Link>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/account/addSuppliers">Add Supplier</Link>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/operations/addSupplierExpense">
              Add Supplier Expense
            </Link>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/addVendor">Add Vendors</Link>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/operations/vehciles">Add Vehicles</Link>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/operations/banks">Add Banks</Link>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/operations/expense_category">
              Add Expense Category
            </Link>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/operations/addExpense">Add Expense</Link>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/account/addVehiclesExpense">Add Vehicle Expense</Link>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/account/addPurchase">Add Purchase Order</Link>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/terms&conditions">Terms and Conditions</Link>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/quotation">Add Quotation</Link>
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
      </Grid>

      <div className={styles.border}></div>

      <Grid container spacing={2}>
        <Grid className="mt-5" item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/account/purchaseOrders">View Purchase Order</Link>
          </div>
        </Grid>

        <Grid className="mt-5" item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/operations/viewInventory">View Inventory</Link>
          </div>
        </Grid>

        <Grid className="mt-5" item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/account/viewSuppliers">View Suppliers</Link>
          </div>
        </Grid>

        <Grid className="mt-5" item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/allVendors">View Vendors</Link>
          </div>
        </Grid>

        <Grid className="mt-5" item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/operations/viewAllExpenses">View Expense</Link>
          </div>
        </Grid>

        <Grid className="mt-5" item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/account/viewVehicles">View Vehicle Expense</Link>
          </div>
        </Grid>

        <Grid className="mt-5" item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/viewQuote">View Quote</Link>
          </div>
        </Grid>

        <Grid className="mt-5" item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/viewQuote">View Jobs</Link>
          </div>
        </Grid>

        <Grid className="mt-5" item xs={12} sm={6} md={4} lg={3}>
          <div className={styles.addProd}>
            <Link href="/viewInvoice">View Invoice</Link>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
