import React from "react";
import styles from "../../styles/settings.module.css";
import Link from "next/link";
import { Grid } from "@mui/material";

const Page = () => {
  return (
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
          <Link href="/operations/expense_category">Add Expense Category</Link>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <div className={styles.addProd}>
          <Link href="/operations/addExpense">Add Expense</Link>
        </div>
      </Grid>
    </Grid>
  );
};

export default Page;
