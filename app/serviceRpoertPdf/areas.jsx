import React from "react";
import styles from "../../styles/serviceReportPdf.module.css";

const Area = () => {
  return (
    <div>
      <div className="flex justify-between" style={{ padding: "34px" }}>
      </div>

      <div className={styles.tableContainerPdf}>
      <div className={styles.areaHeadPdf}> Areas </div>

        <table className={styles.tablePdf}>
          <thead>
            <tr>
              <th> Sr No. </th>
              <th> Inspected Areas </th>
              <th> Infestation level </th>
              <th> Manifested areas </th>
              <th> Report and follow up detail </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> 01 </td>
              <td> Internal areas of restaurant </td>
              <td>High</td>
              <td>High</td>
              <td>High</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Area;
