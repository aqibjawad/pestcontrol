// In ./salarypdf.js or wherever your SalaryPDFGenerator component is defined
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the PDF components with ssr: false to prevent SSR issues
const PDFRenderer = dynamic(
  () => import('@react-pdf/renderer').then(mod => ({ 
    default: mod.PDFViewer,
    Document: mod.Document,
    Page: mod.Page,
    Text: mod.Text,
    View: mod.View,
    StyleSheet: mod.StyleSheet
  })),
  { ssr: false }
);

const SalaryPDFGenerator = ({ data, selectedMonth }) => {
  // Check if we're in the browser environment
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) {
    // Return null or a placeholder during SSR
    return <div>Loading PDF viewer...</div>;
  }

  // Only render the PDF components on the client side
  const { default: PDFViewer, Document, Page, Text, View, StyleSheet } = PDFRenderer;

  // Define your styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 30,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20,
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#bfbfbf',
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableHeaderCell: {
      backgroundColor: '#f0f0f0',
      fontWeight: 'bold',
      padding: 5,
      borderWidth: 1,
      borderColor: '#bfbfbf',
    },
    tableCell: {
      padding: 5,
      borderWidth: 1,
      borderColor: '#bfbfbf',
    },
  });

  return (
    <PDFViewer width="100%" height="100%">
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Salary Report - {selectedMonth}</Text>
          
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableHeaderCell, width: '5%' }}><Text>Sr.</Text></View>
              <View style={{ ...styles.tableHeaderCell, width: '20%' }}><Text>Name</Text></View>
              <View style={{ ...styles.tableHeaderCell, width: '10%' }}><Text>Attendance</Text></View>
              <View style={{ ...styles.tableHeaderCell, width: '10%' }}><Text>Advance</Text></View>
              <View style={{ ...styles.tableHeaderCell, width: '10%' }}><Text>Fines</Text></View>
              <View style={{ ...styles.tableHeaderCell, width: '15%' }}><Text>Basic Salary</Text></View>
              <View style={{ ...styles.tableHeaderCell, width: '15%' }}><Text>Payable</Text></View>
              <View style={{ ...styles.tableHeaderCell, width: '15%' }}><Text>Status</Text></View>
            </View>
            
            {/* Table Rows */}
            {data.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={{ ...styles.tableCell, width: '5%' }}><Text>{index + 1}</Text></View>
                <View style={{ ...styles.tableCell, width: '20%' }}><Text>{row?.user?.name}</Text></View>
                <View style={{ ...styles.tableCell, width: '10%' }}><Text>{row.attendance_per}%</Text></View>
                <View style={{ ...styles.tableCell, width: '10%' }}><Text>{row.adv_paid}</Text></View>
                <View style={{ ...styles.tableCell, width: '10%' }}><Text>{row.total_fines}</Text></View>
                <View style={{ ...styles.tableCell, width: '15%' }}><Text>{row.basic_salary}</Text></View>
                <View style={{ ...styles.tableCell, width: '15%' }}><Text>{row.payable_salary}</Text></View>
                <View style={{ ...styles.tableCell, width: '15%' }}><Text>{row.status}</Text></View>
              </View>
            ))}
          </View>
          
          {/* Summary Section */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>Summary:</Text>
            <Text>Total Employees: {data.length}</Text>
            <Text>Paid Employees: {data.filter(emp => emp.status === 'paid').length}</Text>
            <Text>Unpaid Employees: {data.filter(emp => emp.status === 'unpaid').length}</Text>
            <Text>Total Payable Amount: {data.reduce((sum, emp) => sum + parseFloat(emp.payable_salary || 0), 0).toFixed(2)}</Text>
            <Text>Total Paid Amount: {data.reduce((sum, emp) => sum + parseFloat(emp.paid_salary || 0), 0).toFixed(2)}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default SalaryPDFGenerator;