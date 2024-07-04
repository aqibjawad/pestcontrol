import React from "react";

import styles from "../../styles/viewQuote.module.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ServiceProduct = () => {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          className={styles.serviceHead}
        >
          Service Product
        </AccordionSummary>
        <AccordionDetails>
            <div className={styles.service}>
                Mian jee family restaurant
            </div>
            
            <div>

            </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ServiceProduct;
