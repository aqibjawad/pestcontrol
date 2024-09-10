import React, { use } from "react";

import styles from "../../styles/settings.module.css";
import Link from "next/link";
import { Grid } from "@mui/material";
const Page = () => {
  return (
    <div className="flex gap-4">
      <div className={styles.addProd}>
        <Link href="/account/addProduct">Add Product</Link>
      </div>
      <div className={styles.addProd}>
        <Link href="/setting/serviceAgreements">Add Services</Link>
      </div>
    </div>
  );
};

export default Page;
