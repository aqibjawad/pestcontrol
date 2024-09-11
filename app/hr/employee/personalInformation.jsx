import React, { useState } from "react";
import InputWithTitle2 from "@/components/generic/InputWithTitle2";

import "./index.css";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";
import { Grid, Typography } from "@mui/material";

const PersonalInformation = ({ data, onChange }) => {
  const [productImage, setProductForImage] = useState();
  const handleFileSelect = (file) => {
    setProductForImage(file);
    onChange("profile_image", file);
  };

  return (
    <div>
      <UploadImagePlaceholder
        onFileSelect={handleFileSelect}
        title={"Product Image"}
      />

      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle2
            title="Name"
            type="text"
            name="name"
            placeholder="Name"
            value={data.name}
            onChange={(name, value) => onChange("name", value)}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle2
            title="Phone Number"
            type="text"
            placeholder="Phone Number"
            value={data.phone_number}
            name="phone_number"
            onChange={(name, value) => onChange("phone_number", value)}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle2
            title="Email"
            type="text"
            placeholder="Email"
            name="email"
            value={data.email}
            onChange={(name, value) => onChange("email", value)}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle2
            title="EID Number"
            type="text"
            placeholder="EID Number"
            name="eid_no"
            value={data.eid_no}
            onChange={(name, value) => onChange("eid_no", value)}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle2
            title="Target"
            type="text"
            placeholder="Target"
            name="target"
            value={data.target}
            onChange={(name, value) => onChange("target", value)}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle2
            title="EID Start"
            type="date"
            placeholder="EID Start"
            name="eid_start"
            value={data.eid_start}
            onChange={(name, value) => onChange("eid_start", value)}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle2
            title="EID Expiry"
            type="date"
            placeholder="EID Expiry"
            name="eid_expiry"
            value={data.eid_expiry}
            onChange={(name, value) => onChange("eid_expiry", value)}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle2
            title="Profession"
            type="text"
            placeholder="Profession"
            value={data.profession}
            name="profession"
            onChange={(name, value) => onChange("profession", value)}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom className="passport-head">
        Passport Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle2
            title="Passport Number"
            type="text"
            placeholder="Passport Number"
            value={data.passport_no}
            name="passport_no"
            onChange={(name, value) => onChange("passport_no", value)}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle2
            title="Passport Start"
            type="date"
            placeholder="Passport Start"
            name="passport_start"
            value={data.passport_start}
            onChange={(name, value) => onChange("passport_start", value)}
          />
        </Grid>
        <Grid item xs={12}>
          <InputWithTitle2
            title="Passport End"
            type="date"
            placeholder="Passport End"
            name="passport_expiry"
            value={data.passport_expiry}
            onChange={(name, value) => onChange("passport_expiry", value)}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default PersonalInformation;
