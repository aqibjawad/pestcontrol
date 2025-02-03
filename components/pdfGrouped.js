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
  page: {
    padding: 30,
    fontSize: 10,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
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
  captionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: "#e6e6e6",
    padding: 8,
  },
});

const GroupedJobsTablePDF = ({ data, startDate, endDate }) => {
  // Group data by caption, excluding jobs without a captain
  const groupedData = data.reduce((groups, job) => {
    // Skip jobs that don't have a captain assigned
    if (!job.captain?.name) return groups;

    const caption = job.captain.name;
    if (!groups[caption]) {
      groups[caption] = [];
    }
    groups[caption].push(job);
    return groups;
  }, {});

  return (
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

        {Object.entries(groupedData).map(([caption, jobs]) => (
          <View key={caption}>
            <Text
              style={[
                pdfStyles.captionHeader,
                { backgroundColor: "#22C55E", color: "white" },
              ]}
            >
              {caption}
            </Text>
            <View style={pdfStyles.table}>
              <View
                style={[
                  pdfStyles.tableRow,
                  pdfStyles.tableHeader,
                  { backgroundColor: "#22C55E", color: "white" },
                ]}
              >
                {[
                  "Sr No",
                  "Client Name",
                  "Firm Name",
                  "Job Name",
                  "Date & Time",
                  "Status",
                  "Job Schedule",
                ].map((header) => (
                  <View key={header} style={pdfStyles.tableCell}>
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>

              {jobs.map((row, index) => (
                <View key={row.id} style={pdfStyles.tableRow}>
                  <View style={pdfStyles.tableCell}>
                    <Text>{index + 1}</Text>
                  </View>
                  <View style={pdfStyles.tableCell}>
                    <Text>{`${row.job_title}`}</Text>
                  </View>
                  <View style={pdfStyles.tableCell}>
                    <Text>{row?.user?.client?.firm_name}</Text>
                  </View>
                  <View style={pdfStyles.tableCell}>
                    <Text>{row.job_title}</Text>
                  </View>
                  <View style={pdfStyles.tableCell}>
                    <Text>{new Date(row.job_date).toLocaleDateString()}</Text>
                  </View>
                  <View style={pdfStyles.tableCell}>
                    <Text>{getStatusText(row.is_completed)}</Text>
                  </View>
                  <View style={pdfStyles.tableCell}>
                    <Text>
                      {row.reschedule_dates?.length > 1
                        ? `Reschedule\n${formatDateTime(
                            row.reschedule_dates[
                              row.reschedule_dates.length - 1
                            ].job_date
                          )}`
                        : `Regular${
                            row.reschedule_dates?.[0]?.job_date ?? ""
                              ? "\n" +
                                formatDateTime(row.reschedule_dates[0].job_date)
                              : ""
                          }`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

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

export const GroupedPDFDownloadButton = ({
  filteredJobs,
  startDate,
  endDate,
}) => (
  <PDFDownloadLink
    document={
      <GroupedJobsTablePDF
        data={filteredJobs}
        startDate={startDate}
        endDate={endDate}
      />
    }
    fileName="grouped-jobs-table.pdf"
  >
    {({ loading }) => (loading ? "Generating PDF..." : "Group Jobs")}
  </PDFDownloadLink>
);
