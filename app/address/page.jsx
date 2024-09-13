"use client";

import React, { useState } from "react";
import { Grid } from "@mui/material";
import FirstSection from "./add/firstSection";
import SecondSection from "./add/secondSection";

const Page = () => {
  const [sections, setSections] = useState([1]); // Start with one section

  const handleAddSection = () => {
    setSections((prevSections) => [...prevSections, prevSections.length + 1]);
  };

  return (
    <Grid container spacing={3}>
      <Grid lg={6} item xs={12} sm={6} md={4}>
        {sections.map((sectionId) => (
          <div className="mt-5">
            <FirstSection key={sectionId} />
          </div>
        ))}
      </Grid>
      <Grid lg={6} item xs={12} sm={6} md={4}>
        <SecondSection onClick={handleAddSection} />
      </Grid>
    </Grid>
  );
};

export default Page;
