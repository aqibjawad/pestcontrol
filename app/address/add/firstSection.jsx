    import React from "react";

    import InputWithTitle from "@/components/generic/InputWithTitle";
    import styles from "../../../styles/loginStyles.module.css";

    import AddLocationIcon from '@mui/icons-material/AddLocation';

    const FirstSection = () => {
        return (
            <div className="centerContainer">
                <div className={styles.userFormContainer} style={{ fontSize: "16px", margin: "auto" }}>
                    <div className="mt-10" >
                        <InputWithTitle
                            type={"search"}
                            placeholder={"search"}
                        />
                    </div>

                    <div className="mt-10" >
                        <InputWithTitle
                            title={"Address"}
                            type={"text"}
                            placeholder={"Address"}
                        />
                    </div>

                    <div className="mt-10" >
                        <InputWithTitle
                            title={"City"}
                            type={"text"}
                            placeholder={"City"}
                        />
                    </div>

                    <div className="centerContainer">
                        <div className={styles.userFormContainer} style={{ fontSize: "16px", margin: "auto" }}>
                            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>

                                <div className="mt-10" style={{ width: "500px" }}>
                                    <InputWithTitle
                                        title={"Latitude"}
                                        type={"text"}
                                        placeholder={"Latitude"}

                                    />
                                </div>


                                <div className="mt-10" style={{ width: "500px" }}>
                                    <InputWithTitle
                                        title={"Longitude"}
                                        type={"text"}
                                        placeholder={"Longitude"}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="centerContainer">
                        <div className="client-save-button">
                            Save
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    export default FirstSection