import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import InputWithTitle3 from "./generic/InputWithTitle3";
import UploadImagePlaceholder from "./generic/uploadImage";
import GreenButton from "@/components/generic/GreenButton";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import Swal from "sweetalert2";

const EmployeeUpdateModal = ({ open, handleClose, selectedEmployee }) => {
  const api = new APICall();

  const [eidStart, setEidStart] = useState("");
  const [eidExpiry, setEidExpiry] = useState("");
  const [passportStart, setPassportStart] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [hiStart, setHiStart] = useState("");
  const [hiExpiry, setHiExpiry] = useState("");
  const [uiStart, setUiStart] = useState("");
  const [uiExpiry, setUiExpiry] = useState("");
  const [dmStart, setDmStart] = useState("");
  const [dmExpiry, setDmExpiry] = useState("");
  const [labourCardExpiry, setLabourCardExpiry] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (selectedEmployee?.employee) {
      setEidStart(selectedEmployee.employee.eid_start || "");
      setEidExpiry(selectedEmployee.employee.eid_expiry || "");
      setPassportStart(selectedEmployee.employee.passport_start || "");
      setPassportExpiry(selectedEmployee.employee.passport_expiry || "");
      setHiStart(selectedEmployee.employee.hi_start || "");
      setHiExpiry(selectedEmployee.employee.hi_expiry || "");
      setUiStart(selectedEmployee.employee.ui_start || "");
      setUiExpiry(selectedEmployee.employee.ui_expiry || "");
      setDmStart(selectedEmployee.employee.dm_start || "");
      setDmExpiry(selectedEmployee.employee.dm_expiry || "");
      setLabourCardExpiry(selectedEmployee.employee.labour_card_expiry || "");
      setProfileImage(selectedEmployee.employee.profile_image || null);
    }
  }, [selectedEmployee]);

  const handleFileSelect = (file) => {
    setProfileImage(file);
  };

  const handleChange = (name, value) => {
    switch (name) {
      case "eid_start":
        setEidStart(value);
        break;
      case "eid_expiry":
        setEidExpiry(value);
        break;
      case "passport_start":
        setPassportStart(value);
        break;
      case "passport_expiry":
        setPassportExpiry(value);
        break;
      case "hi_start":
        setHiStart(value);
        break;
      case "hi_expiry":
        setHiExpiry(value);
        break;
      case "ui_start":
        setUiStart(value);
        break;
      case "ui_expiry":
        setUiExpiry(value);
        break;
      case "dm_start":
        setDmStart(value);
        break;
      case "dm_expiry":
        setDmExpiry(value);
        break;
      case "labour_card_expiry":
        setLabourCardExpiry(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    // Create base form data without image
    const formData = {
      user_id: selectedEmployee.id,
      eid_start: eidStart,
      eid_expiry: eidExpiry,
      passport_start: passportStart,
      passport_expiry: passportExpiry,
      hi_start: hiStart,
      hi_expiry: hiExpiry,
      ui_start: uiStart,
      ui_expiry: uiExpiry,
      dm_start: dmStart,
      dm_expiry: dmExpiry,
      labour_card_expiry: labourCardExpiry,
    };

    // Only add profile_image if it exists and is not null
    if (profileImage) {
      formData.profile_image = profileImage;
    }

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/update`,
        formData
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
        handleClose();
        window.location.reload();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.error.message}`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the data",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "57%",
          transform: "translate(-50%, -50%)",
          width: 1300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          {selectedEmployee?.name}
        </Typography>
        <UploadImagePlaceholder
          onFileSelect={handleFileSelect}
          title={"Profile Image"}
          imageUrl={profileImage}
        />
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <InputWithTitle3
              title="EID Start"
              type="date"
              placeholder="EID Start"
              name="eid_start"
              value={eidStart}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <InputWithTitle3
              title="EID End"
              type="date"
              placeholder="EID End"
              name="eid_expiry"
              value={eidExpiry}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <InputWithTitle3
              title="Passport Start"
              type="date"
              placeholder="Passport Start"
              name="passport_start"
              value={passportStart}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <InputWithTitle3
              title="Passport End"
              type="date"
              placeholder="Passport End"
              name="passport_expiry"
              value={passportExpiry}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <InputWithTitle3
              title="Health Insurance Start"
              type="date"
              placeholder="Health Insurance Start"
              name="hi_start"
              value={hiStart}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <InputWithTitle3
              title="Health Insurance End"
              type="date"
              placeholder="Health Insurance End"
              name="hi_expiry"
              value={hiExpiry}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <InputWithTitle3
              title="UnEmployment Start"
              type="date"
              placeholder="UnEmployment Start"
              name="ui_start"
              value={uiStart}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <InputWithTitle3
              title="UnEmployment End"
              type="date"
              placeholder="UnEmployment End"
              name="ui_expiry"
              value={uiExpiry}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <InputWithTitle3
              title="DM Card Start"
              type="date"
              placeholder="DM Card Start"
              name="dm_start"
              value={dmStart}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <InputWithTitle3
              title="DM Card Expiry"
              type="date"
              placeholder="DM Card Expiry"
              name="dm_expiry"
              value={dmExpiry}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <InputWithTitle3
              title="Labour Card Expiry"
              type="date"
              placeholder="Labour Card Expiry"
              name="labour_card_expiry"
              value={labourCardExpiry}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          justifyContent="flex-end"
          alignItems="center"
          className="mt-5"
        >
          <Grid item lg={6}>
            <GreenButton
              onClick={handleSubmit}
              title={
                loadingSubmit ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Submit"
                )
              }
              disabled={loadingSubmit}
            />
          </Grid>
          <Grid item lg={6}>
            <Button
              sx={{ width: "100%" }}
              variant="contained"
              onClick={handleClose}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EmployeeUpdateModal;
