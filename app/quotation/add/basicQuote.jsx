import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import { clients } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { Grid, Skeleton } from "@mui/material";
import MultilineInput from "../../../components/generic/MultilineInput";
import Dropdown2 from "@/components/generic/DropDown2";

// Validation schema
const QuoteSchema = Yup.object().shape({
  user_id: Yup.string().required("Client selection is required"),
  quote_title: Yup.string().required("Quote title is required"),
  subject: Yup.string().required("Subject is required"),
  trn: Yup.string().required("TRN is required"),
  tag: Yup.string(),
  duration_in_months: Yup.number()
    .required("Duration is required")
    .positive("Duration must be positive")
    .integer("Duration must be a whole number"),
  description: Yup.string().required("Description is required"),
  client_address_id: Yup.string().required("Address selection is required"),
  isFoodWatchAccount: Yup.string().oneOf(["yes", "no"]).required(),
});

const BasicQuote = ({ setFormData, initialData = {} }) => {
  const api = new APICall();
  const [allBrandsList, setAllBrandsList] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [firmName, setFirmName] = useState("");
  const [referenceName, setReferenceName] = useState("");

  useEffect(() => {
    getAllClients();
  }, []);

  const getAllClients = async () => {
    setLoadingClients(true);
    try {
      const response = await api.getDataWithToken(clients);
      setAllClients(response.data);
      const transformedClients = response.data.map((client) => ({
        value: client.id,
        label: client.name || client.client?.firm_name || "Unknown Client",
        data: client,
      }));
      setAllBrandsList(transformedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleClientChange = (value, setFieldValue) => {
    const selectedClient = allClients.find((client) => client.id === value);

    if (selectedClient) {
      setFieldValue("user_id", selectedClient.id);

      if (selectedClient.client) {
        setFirmName(selectedClient.client.firm_name || "");
      }

      if (selectedClient.client?.referencable?.name) {
        setReferenceName(selectedClient.client.referencable.name);
      }

      if (selectedClient.client?.addresses) {
        const newAddresses = selectedClient.client.addresses.map((address) => ({
          value: address.id,
          label: address.address,
        }));
        setAddresses(newAddresses);
        // Clear the previous address selection
        setFieldValue("client_address_id", "");
      }
    }
  };

  return (
    <div
      className={styles.userFormContainer}
      style={{ fontSize: "16px", margin: "auto" }}
    >
      <Formik
        initialValues={{
          user_id: initialData.user_id || "",
          quote_title: initialData.quote_title || "",
          subject: initialData.subject || "",
          trn: initialData.trn || "",
          tag: initialData.tag || "",
          duration_in_months: initialData.duration_in_months || "",
          description: initialData.description || "",
          client_address_id: initialData.client_address_id || "",
          isFoodWatchAccount: initialData.isFoodWatchAccount || "no",
        }}
        validationSchema={QuoteSchema}
        onSubmit={(values) => {
          setFormData(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleChange,
          handleBlur,
        }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item lg={6} xs={12} md={6} mt={2}>
                {loadingClients ? (
                  <Skeleton variant="rectangular" width="100%" height={50} />
                ) : (
                  <Dropdown2
                    title="Select Client"
                    options={allBrandsList}
                    onChange={(value) =>
                      handleClientChange(value, setFieldValue)
                    }
                    value={values.user_id}
                    error={touched.user_id && errors.user_id}
                  />
                )}
              </Grid>

              <Grid item lg={6} xs={12} md={6} mt={2}>
                <InputWithTitle
                  title="Contract Reference"
                  type="text"
                  value={referenceName}
                  disable
                />
              </Grid>

              <Grid item lg={6} xs={12} md={6} mt={2}>
                <InputWithTitle
                  title="Firm"
                  type="text"
                  value={firmName}
                  disable
                />
              </Grid>

              <Grid item lg={6} xs={12} md={6} mt={2}>
                <Dropdown2
                  title="Select address"
                  options={addresses}
                  onChange={(value) =>
                    setFieldValue("client_address_id", value)
                  }
                  value={values.client_address_id}
                  error={touched.client_address_id && errors.client_address_id}
                />
              </Grid>

              <Grid item lg={6} xs={12} md={6} mt={2}>
                <InputWithTitle
                  title="Quotes title"
                  type="text"
                  name="quote_title"
                  value={values.quote_title}
                  onChange={(value) => setFieldValue("quote_title", value)}
                  onBlur={handleBlur}
                  error={touched.quote_title && errors.quote_title}
                />
              </Grid>

              <Grid item lg={6} xs={12} md={6} mt={2}>
                <InputWithTitle
                  title="Subject"
                  type="text"
                  name="subject"
                  value={values.subject}
                  onChange={(value) => setFieldValue("subject", value)}
                  onBlur={handleBlur}
                  error={touched.subject && errors.subject}
                />
              </Grid>

              <Grid item lg={6} xs={12} md={6} mt={2}>
                <InputWithTitle
                  title="TRN"
                  type="text"
                  name="trn"
                  value={values.trn}
                  onChange={(value) => setFieldValue("trn", value)}
                  onBlur={handleBlur}
                  error={touched.trn && errors.trn}
                />
              </Grid>

              <Grid item lg={6} xs={12} md={6} mt={2}>
                <InputWithTitle
                  title="Tag"
                  type="text"
                  name="tag"
                  value={values.tag}
                  onChange={(value) => setFieldValue("tag", value)}
                  onBlur={handleBlur}
                  error={touched.tag && errors.tag}
                />
              </Grid>

              <Grid item lg={6} xs={12} md={6} mt={2}>
                <InputWithTitle
                  title="Duration in Month"
                  type="number"
                  name="duration_in_months"
                  value={values.duration_in_months}
                  onChange={(value) =>
                    setFieldValue("duration_in_months", value)
                  }
                  onBlur={handleBlur}
                  error={
                    touched.duration_in_months && errors.duration_in_months
                  }
                />
              </Grid>

              <Grid className="mt-5" item lg={6} xs={12} md={6} mt={2}>
                <div>
                  <label className="block font-bold mb-2">
                    Food Watch Account
                  </label>
                  <button
                    type="button"
                    onClick={() => setFieldValue("isFoodWatchAccount", "yes")}
                    className={`px-4 py-2 rounded ${
                      values.isFoodWatchAccount === "yes"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setFieldValue("isFoodWatchAccount", "no")}
                    className={`px-4 py-2 rounded ml-2 ${
                      values.isFoodWatchAccount === "no"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    Unlink
                  </button>
                </div>
              </Grid>

              <Grid item lg={12} xs={12} mt={5}>
                <MultilineInput
                  title="Description"
                  name="description"
                  value={values.description}
                  onChange={(value) => setFieldValue("description", value)}
                  onBlur={handleBlur}
                  error={touched.description && errors.description}
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BasicQuote;
