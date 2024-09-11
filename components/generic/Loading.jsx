import { Skeleton } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} height={70} />
      ))}
    </div>
  );
};

export default Loading;
