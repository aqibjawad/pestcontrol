import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import styles from "../../styles/quotes.module.css";

const SchedulePlan = () => {
  return (
    <div className="mt-10">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div className={styles.termHead}>Schedule Plan</div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="text-dark">
                <tr>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Date & Time</th>
                  <th className="px-4 py-2">Job Site</th>
                  <th className="px-4 py-2">Job Type</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-200">
                  <td className="border px-4 py-2">Monday</td>
                  <td className="border px-4 py-2">10:00 AM</td>
                  <td className="border px-4 py-2">Team Meeting</td>
                  <td className="border px-4 py-2">Team Meeting</td>
                </tr>
              </tbody>
            </table>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default SchedulePlan;
