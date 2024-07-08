import React from "react";
import InputWithTitle from "@/components/generic/InputWithTitle";

import "./index.css";

const PersonalInformation = ({ data, onChange }) => {
    return (
        <div>
            <div>
                <div className="" style={{ width: "1000px" }}>
                    <InputWithTitle
                        title={"Name"}
                        type={"text"}
                        placeholder={"Name"}
                        value={data.name}
                        onChange={(e) => onChange("name")}
                    />
                </div>

                <div className="mt-5" style={{ width: "1000px" }}>
                    <InputWithTitle
                        title={"Phone Number"}
                        type={"text"}
                        placeholder={"Phone Number"}
                        value={data.phone_number}
                        onChange={(e) => onChange("phone_number")}
                    />
                </div>

                <div className="mt-5" style={{ width: "1000px" }}>
                    <InputWithTitle
                        title={"Email"}
                        type={"text"}
                        placeholder={"Email"}
                        value={data.email}
                        onChange={(e) => onChange("email")}
                    />
                </div>

                <div className="mt-5" style={{ width: "1000px" }}>
                    <InputWithTitle
                        title={"EID Number"}
                        type={"text"}
                        placeholder={"EID Number"}
                        value={data.eid_no}
                        onChange={(e) => onChange("eid_no")}
                    />
                </div>


                <div className="mt-5" style={{ width: "1000px" }}>
                    <InputWithTitle
                        title={"Target"}
                        type={"text"}
                        placeholder={"Target"}
                        value={data.target}
                        onChange={(e) => onChange("target")}
                    />
                </div>

                <div className="mt-5" style={{ width: "1000px" }}>
                    <InputWithTitle
                        title={"EID Start"}
                        type={"date"}
                        placeholder={"EID Start"}
                        value={data.eid_start}
                        onChange={(e) => onChange("eid_start")}
                    />
                </div>

                <div className="mt-5" style={{ width: "1000px" }}>
                    <InputWithTitle
                        title={"EID Expiry"}
                        type={"date"}
                        placeholder={"EID Expiry"}
                        value={data.eid_expiry}
                        onChange={(e) => onChange("eid_expiry")}
                    />
                </div>

                <div className="mt-5" style={{ width: "1000px" }}>
                    <InputWithTitle
                        title={"Profession"}
                        type={"text"}
                        placeholder={"Profession"}
                        value={data.profession}
                        onChange={(e) => onChange("profession")}
                    />
                </div>
            </div>

            <div>
                <div className="passport-head">
                    Passport Information
                </div>

                <div className="grid grid-cols-12 gap-4" style={{ width: '100%', maxWidth: '1200px' }}>
                    <div className="col-span-12">
                        <div className="flex flex-wrap justify-between">
                            <div className="mt-5" style={{ width: "48%" }}>
                                <InputWithTitle
                                    title={"Passport Number"}
                                    type={"text"}
                                    placeholder={"Passport Number"}
                                    value={data.passport_no}
                                    onChange={(e) => onChange("passport_no")}
                                />
                            </div>
                            <div className="mt-5" style={{ width: "48%" }}>
                                <InputWithTitle
                                    title={"Passport Start"}
                                    type={"text"}
                                    placeholder={"Passport Start"}
                                    value={data.passport_start}
                                    onChange={(e) => onChange("passport_start")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 mt-5" style={{ width: "100%" }}>
                        <InputWithTitle
                            title={"Passport End"}
                            type={"text"}
                            placeholder={"Passport End"}
                            value={data.passport_expiry}
                            onChange={(e) => onChange("passport_expiry")}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PersonalInformation