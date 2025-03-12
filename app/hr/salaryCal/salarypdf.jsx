import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 8,
    fontFamily: "Helvetica",
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "#00A651",
    padding: 6,
    marginBottom: 1,
  },
  logoContainer: {
    width: "15%",
    borderRight: "1px solid #FFFFFF",
  },
  logo: {
    width: "100%",
    height: "auto",
  },
  companyNameContainer: {
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
  },
  companyName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  subHeader: {
    flexDirection: "row",
    marginBottom: 1,
  },
  payrollReport: {
    backgroundColor: "#00A651",
    color: "white",
    padding: 6,
    flex: 2,
    fontSize: 14,
    fontWeight: "bold",
  },
  netPayContainer: {
    flexDirection: "row",
    flex: 1,
  },
  netPayLabel: {
    backgroundColor: "#00A651",
    color: "white",
    padding: 6,
    fontSize: 14,
    fontWeight: "bold",
  },
  netPayAmount: {
    backgroundColor: "#FFFF00",
    padding: 6,
    width: 100,
    fontSize: 14,
    fontWeight: "bold",
  },
  periodContainer: {
    backgroundColor: "#FFF8DC",
    padding: 5,
    marginBottom: 1,
  },
  periodText: {
    textAlign: "center",
    fontSize: 10,
  },
  // Table styles
  table: {
    marginTop: 5,
    flexGrow: 1, // Allow table to grow and fill available space
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    minHeight: 25,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#E8E8E8",
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    padding: 4,
    textAlign: "center",
  },
  tableCell: {
    fontSize: 9,
    padding: 4,
    textAlign: "center",
  },
  col1: { width: "4%" },
  col2: { width: "12%" },
  col3: { width: "8%" },
  col4: { width: "7%" },
  col5: { width: "7%" },
  col6: { width: "8%" },
  col7: { width: "8%" },
  col8: { width: "8%" },
  col9: { width: "7%" },
  col10: { width: "8%" },
  col11: { width: "8%" },
  col12: { width: "15%" },
  // Content container for proper spacing
  contentContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  headerSection: {
    marginBottom: 5, // Reduced space between header and table
  },
  footer: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
  },
});

// Create a separate Header component
const PageHeader = ({ totalNetPay, period }) => (
  <View style={styles.headerSection}>
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image src="/logo.jpeg" style={styles.logo} />
      </View>
      <View style={styles.companyNameContainer}>
        <Text style={styles.companyName}>
          ACCURATE PEST CONTROL SERVICES LLC
        </Text>
      </View>
    </View>

    <View style={styles.subHeader}>
      <Text style={styles.payrollReport}>PAYROLL REPORT</Text>
      <View style={styles.netPayContainer}>
        <Text style={styles.netPayLabel}>NET PAY AED :</Text>
        <Text style={styles.netPayAmount}>{totalNetPay.toFixed(2)}</Text>
      </View>
    </View>

    <View style={styles.periodContainer}>
      <Text style={styles.periodText}>Payroll Period : {period}</Text>
    </View>
  </View>
);

const SalaryPDFGenerator = ({ data, selectedMonth }) => {
  const totalNetPay = data.reduce(
    (sum, emp) => sum + Number(emp.paid_salary || 0),
    0
  );
  const monthYear = selectedMonth
    ? new Date(selectedMonth + "-01").toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";
  const period = `${monthYear} 1, 2025- ${monthYear} 31, 2025`;

  // Use more efficient pagination to maximize space usage
  // Increased items per page to utilize more space
  const itemsPerPage = 25; // Increased from 20

  // Calculate the number of whole pages needed
  const pageCount = Math.ceil(data.length / itemsPerPage);

  // Create pages array with better distribution of items
  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    // Calculate start and end indices for this page
    const startIdx = i * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, data.length);

    // Add this page's data to the pages array
    pages.push(data.slice(startIdx, endIdx));
  }

  return (
    <PDFViewer width="100%" height={800}>
      <Document>
        {pages.map((pageData, pageIndex) => (
          <Page
            key={pageIndex}
            size="A4"
            orientation="landscape"
            style={styles.page}
            wrap={false} // Prevent automatic wrapping which can cause gaps
          >
            <View style={styles.contentContainer}>
              <PageHeader totalNetPay={totalNetPay} period={period} />

              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCellHeader, styles.col1]}>
                    S.NO
                  </Text>
                  <Text style={[styles.tableCellHeader, styles.col2]}>
                    Employee Name
                  </Text>
                  <Text style={[styles.tableCellHeader, styles.col3]}>
                    Department
                  </Text>
                  <Text style={[styles.tableCellHeader, styles.col4]}>
                    Salary
                  </Text>
                  <Text style={[styles.tableCellHeader, styles.col5]}>
                    Salary/Day
                  </Text>
                  <Text style={[styles.tableCellHeader, styles.col6]}>
                    Deduction (No Pays)
                  </Text>
                  <Text style={[styles.tableCellHeader, styles.col7]}>
                    Deduction (Fines)
                  </Text>
                  <Text style={[styles.tableCellHeader, styles.col8]}>
                    Deduction (Advance)
                  </Text>
                  <Text style={[styles.tableCellHeader, styles.col9]}>OT</Text>
                  <Text style={[styles.tableCellHeader, styles.col10]}>
                    Net Pay
                  </Text>
                  <Text style={[styles.tableCellHeader, styles.col11]}>
                    Mode
                  </Text>
                  <Text style={[styles.tableCellHeader, styles.col12]}>
                    Deduction Details
                  </Text>
                </View>
                {pageData.map((employee, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.col1]}>
                      {pageIndex * itemsPerPage + index + 1}
                    </Text>
                    <Text style={[styles.tableCell, styles.col2]}>
                      {employee?.user?.name}
                    </Text>
                    <Text style={[styles.tableCell, styles.col3]}>
                      Operation
                    </Text>
                    <Text style={[styles.tableCell, styles.col4]}>
                      {employee.basic_salary}
                    </Text>
                    <Text style={[styles.tableCell, styles.col5]}>
                      {(employee.basic_salary / 30).toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCell, styles.col6]}>
                      {employee.no_pay_deduction || ""}
                    </Text>
                    <Text style={[styles.tableCell, styles.col7]}>
                      {employee.fine_received || ""}
                    </Text>
                    <Text style={[styles.tableCell, styles.col8]}>
                      {employee.adv_received || ""}
                    </Text>
                    <Text style={[styles.tableCell, styles.col9]}>
                      {employee.overtime || ""}
                    </Text>
                    <Text style={[styles.tableCell, styles.col10]}>
                      {employee.paid_salary || ""}
                    </Text>
                    <Text style={[styles.tableCell, styles.col11]}>
                      {employee.payment_type?.toUpperCase() || "WPS"}
                    </Text>
                    <Text style={[styles.tableCell, styles.col12]}>
                      {employee.description || ""}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Optional: Page number at bottom */}
              <Text style={styles.footer}>
                Page {pageIndex + 1} of {pages.length}
              </Text>
            </View>
          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
};

export default SalaryPDFGenerator;
