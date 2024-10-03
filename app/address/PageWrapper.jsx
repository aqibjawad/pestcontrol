"use client";

import { useSearchParams } from "next/navigation";
import Page from "./Page";  // Adjust the import path as necessary

const PageWrapper = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const phoneNumber = searchParams.get("phone_number");

  return <Page id={id} name={name} phoneNumber={phoneNumber} />;
};

export default PageWrapper;