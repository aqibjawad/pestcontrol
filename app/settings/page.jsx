import React from "react";

import styles from "../../styles/settings.module.css"
import Link from "next/link";

const Page =()=>{
    return(
        <div>
            <div className={styles.addProd}>
                <Link href="/account/addProduct">
                    Add Product
                </Link>
            </div>
        </div>
    )
}

export default Page