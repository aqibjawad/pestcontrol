import React, { useState } from "react";
import InputWithTitle2 from "@/components/generic/InputWithTitle2";

import "./index.css";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";
import {
  Box,
  FormControl,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dropdown from "@/components/generic/Dropdown";

import GreenButton from "@/components/generic/GreenButton";

const PersonalInformation = ({ data, onChange, handleSubmit, sendingData }) => {
  const [brands, setBrandList] = useState([]);

  const [productImage, setProductForImage] = useState();

  const roles = [
    { label: "HR-Manager", value: 2 },
    { label: "Operations", value: 3 },
    { label: "Office Staff", value: 8 },
    { label: "Sales-Manger", value: 4 },
    { label: "Accountant", value: 6 },
  ];

  const handleFileSelect = (file) => {
    setProductForImage(file);
    onChange("profile_image", file);
  };

  const setSelectedRole = (value) => {
    onChange("role_id", value);
  };

  const [selectedProfession, setSelectedProfession] = useState("");

  const handleProfessionChange = (value) => {
    setSelectedProfession(value);
    onChange("profession", value);
    console.log("Selected Profession:", value);
  };

  const professions = [
    "HR Manager",
    "Accountant",
    "Operation Manager",
    "Agriculture Engineer",
    "Sales Manager",
    "Pesticides Technician",
    "Sales Officer",
    "Receptionist",
    "Office Boy",
    "Technician helper",
    "Recovery Officer",
    "operation supervisor",
  ];

  return (
    <>
      <div>
        <UploadImagePlaceholder
          onFileSelect={handleFileSelect}
          title={"Profile Image"}
        />
        <div className="mb-10"></div>

        <div>
          <FormControl>
            <div className="roleText">Select Role</div>
            <RadioGroup
              aria-label="roles"
              name="roles"
              value={data.role_id}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                {roles.map((role) => (
                  <FormControlLabel
                    key={role.value}
                    value={role.value}
                    control={<Radio />}
                    label={role.label}
                    sx={{ mr: 2 }}
                  />
                ))}
              </Box>
            </RadioGroup>
          </FormControl>
        </div>

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
          {data.role_id === "4" && ( // Conditionally render based on role_id
            <Grid item lg={6} xs={12} md={6}>
              <InputWithTitle2
                title="Sales Target"
                type="text"
                placeholder="Target"
                name="target"
                value={data.target}
                onChange={(name, value) => onChange("target", value)}
              />
            </Grid>
          )}
          <Grid item lg={6} xs={12} md={6}>
            <Dropdown
              onChange={handleProfessionChange}
              title={"Select Profession"}
              options={professions}
            />
          </Grid>
        </Grid>
      </div>

      <div>
        {/* Emergency Contact Section */}
        <Typography variant="h6" gutterBottom className="health-head">
          Emergency Contact
        </Typography>

        <Grid container spacing={3} style={{ maxWidth: "1200px" }}>
          <Grid item xs={12} md={4}>
            <InputWithTitle2
              title="Relative Name"
              type="text"
              placeholder="Name of Relative"
              value={data.relative_name}
              onChange={(name, value) => onChange("relative_name", value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputWithTitle2
              title="Relation"
              type="text"
              placeholder="Relation"
              value={data.relation}
              onChange={(name, value) => onChange("relation", value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputWithTitle2
              title="Emergency Contact (Home Country)"
              type="text"
              placeholder="Emergency Contact (Home Country)"
              value={data.emergency_contact}
              onChange={(name, value) => onChange("emergency_contact", value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <InputWithTitle2
              title="Country"
              type="text"
              placeholder="Country"
              value={data.country}
              onChange={(name, value) => onChange("country", value)}
            />
          </Grid>
        </Grid>

        {/* Financial Condition Section */}
        <Typography
          variant="h6"
          gutterBottom
          className="health-head"
          style={{ marginTop: "2rem" }}
        >
          Financial Condition
        </Typography>

        <Grid container spacing={3} style={{ maxWidth: "1200px" }}>
          <Grid item xs={12} md={6}>
            <InputWithTitle2
              title="Basic Salary"
              type="text"
              placeholder="Basic Salary"
              value={data.basic_salary}
              onChange={(name, value) => onChange("basic_salary", value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputWithTitle2
              title="Allowance"
              type="text"
              placeholder="Allowance"
              value={data.allowance}
              onChange={(name, value) => onChange("allowance", value)}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={3}
          style={{ maxWidth: "1200px", marginTop: "1rem" }}
        >
          <Grid item xs={12} md={6}>
            <InputWithTitle2
              title="Other"
              type="text"
              placeholder="Other"
              value={data.other}
              onChange={(name, value) => onChange("other", value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputWithTitle2
              title="Comission %"
              type="text"
              placeholder="Comission"
              value={data.commission_per}
              onChange={(name, value) => onChange("commission_per", value)}
            />
          </Grid>
        </Grid>

        <div className="mb-10"></div>
        <GreenButton
          onClick={() => handleSubmit()}
          title={
            sendingData ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Save"
            )
          }
        />
      </div>
    </>
  );
};

export default PersonalInformation;
