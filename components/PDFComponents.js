"use client";
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 10 },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minHeight: 30,
    alignItems: "center",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    flex: 1,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  dateRange: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
    color: "#666666",
  },
});

export const JobsTablePDF = ({ data, startDate, endDate }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Image src="/logo.jpeg" style={pdfStyles.logo} />
        <Text style={pdfStyles.title}>Upcoming Jobs</Text>
        <Text style={pdfStyles.dateRange}>
          {startDate &&
            endDate &&
            `Date Range: ${new Date(
              startDate
            ).toLocaleDateString()} to ${new Date(
              endDate
            ).toLocaleDateString()}`}
        </Text>
      </View>

      <View style={pdfStyles.table}>
        <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
          {[
            "Sr No",
            "Client Name",
            "Firm Name",
            "Job Name",
            "Status",
            "Job Schedule",
            "Team Captain",
          ].map((header) => (
            <View key={header} style={pdfStyles.tableCell}>
              <Text>{header}</Text>
            </View>
          ))}
        </View>
        {data &&
          data.map((row) => (
            <View key={row.id} style={pdfStyles.tableRow}>
              <View style={pdfStyles.tableCell}>
                <Text>{row.id}</Text>
              </View>
              <View style={pdfStyles.tableCell}>
                <Text>{`${row.job_title}\n${new Date(
                  row.job_date
                ).toLocaleDateString()}\n${
                  row?.client_address?.area || "No Area"
                }`}</Text>
              </View>
              <View style={pdfStyles.tableCell}>
                <Text>{row?.user?.client?.firm_name}</Text>
              </View>
              <View style={pdfStyles.tableCell}>
                <Text>{row.job_title}</Text>
              </View>
              <View style={pdfStyles.tableCell}>
                <Text>{getStatusText(row.is_completed)}</Text>
              </View>
              <View style={pdfStyles.tableCell}>
                <Text>
                  {row.reschedule_dates?.length > 1
                    ? `Reschedule\n${formatDateTime(
                        row.reschedule_dates[row.reschedule_dates.length - 1]
                          .job_date
                      )}`
                    : `Regular${
                        row.reschedule_dates?.[0]?.job_date ?? ""
                          ? "\n" +
                            formatDateTime(row.reschedule_dates[0].job_date)
                          : ""
                      }`}
                </Text>
              </View>
              <View style={pdfStyles.tableCell}>
                <Text>{row?.captain?.name || "Not Assigned"}</Text>
              </View>
            </View>
          ))}
      </View>
    </Page>
  </Document>
);

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusText = (status) => {
  switch (status) {
    case 0:
      return "Not Started";
    case 1:
      return "Completed";
    case 2:
      return "In Progress";
    default:
      return "Unknown";
  }
};

export const PDFDownloadButton = ({ filteredJobs, startDate, endDate }) => (
  <PDFDownloadLink
    document={
      <JobsTablePDF
        data={filteredJobs}
        startDate={startDate}
        endDate={endDate}
      />
    }
    fileName="jobs-table.pdf"
    className="py-2 px-4 rounded text-white ml-3 bg-green-500 hover:bg-green-600"
  >
    {({ loading }) => (loading ? "Generating PDF..." : "PDF")}
  </PDFDownloadLink>
);
