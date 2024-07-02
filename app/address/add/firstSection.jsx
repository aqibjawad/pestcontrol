import React, { useState } from "react";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Autocomplete from "react-google-autocomplete";
import styles from "../../../styles/loginStyles.module.css";
import { addAddress } from "../../../networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

import "./index.css"

const FirstSection = () => {
    const api = new APICall();

    const [forms, setForms] = useState([
        { search: "", address: "", city: "", lat: "", lng: "", isLoading: false },
    ]);

    const handlePlaceSelected = (index, place) => {
        const address = place.formatted_address;
        const city = place.address_components.find((component) => component.types.includes("locality"))?.long_name || "";
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        const newForms = [...forms];
        newForms[index] = { ...newForms[index], address, city, lat, lng };
        setForms(newForms);
    };

    const handleFormSubmit = async (index) => {
        const form = forms[index];
        const { address, city, lat, lng } = form;

        const newForms = [...forms];
        newForms[index].isLoading = true;
        setForms(newForms);

        const formData = {
            user_id: "63",
            address: address,
            city: city,
            lat: lat,
            lang: lng,
        };

        try {
            const response = await api.postDataWithTokn(addAddress, formData);

            console.log("Form data:", formData);
            alert(response.data.data);
        } catch (error) {
            console.error("Error adding address:", error);
            alert("An error occurred. Please try again.");
        } finally {
            newForms[index].isLoading = false;
            setForms(newForms);
        }
    };

    const addNewForm = () => {
        setForms([
            ...forms,
            { search: "", address: "", city: "", lat: "", lng: "" },
        ]);
    };

    return (
        <div className="grid grid-cols-12 gap-4" style={{ width: '100%', maxWidth: '1200px' }}>
            <div className="col-span-6">
                {forms.map((form, index) => (
                    <div key={index} className="centerContainer" style={{ marginBottom: "20px" }}>
                        <div className={styles.userFormContainer} style={{ fontSize: "16px", margin: "auto" }}>
                            <div className="mt-10">
                                <InputWithTitle title={"Search"}>
                                    <Autocomplete
                                        apiKey="AIzaSyD1nQhK29CQk2DAdE96qT9ta3XOtkqg6uI"
                                        onPlaceSelected={(place) => handlePlaceSelected(index, place)}
                                        types={['(cities)']}
                                        placeholder="Search"
                                        value={form.search}
                                        onChange={(e) => {
                                            const newForms = [...forms];
                                            newForms[index].search = e.target.value;
                                            setForms(newForms);
                                        }}
                                        style={{ width: '100%', height: '40px', padding: '12px' }}
                                    />
                                </InputWithTitle>
                            </div>

                            <div className="mt-10">
                                <InputWithTitle
                                    title={"Address"}
                                    type={"text"}
                                    placeholder={"Address"}
                                    value={form.address}
                                    onChange={(e) => {
                                        const newForms = [...forms];
                                        newForms[index].address = e.target.value;
                                        setForms(newForms);
                                    }}
                                    disabled
                                />
                            </div>

                            <div className="mt-10">
                                <InputWithTitle
                                    title={"City"}
                                    type={"text"}
                                    placeholder={"City"}
                                    value={form.city}
                                    onChange={(e) => {
                                        const newForms = [...forms];
                                        newForms[index].city = e.target.value;
                                        setForms(newForms);
                                    }}
                                    disabled
                                />
                            </div>

                            <div className="centerContainer" style={{ marginTop: "1rem" }}>
                                <div style={{ display: "flex", gap: "1rem" }}>
                                    <div style={{ width: "50%" }}>
                                        <InputWithTitle
                                            title={"Latitude"}
                                            type={"text"}
                                            placeholder={"Latitude"}
                                            value={form.lat}
                                            onChange={(e) => {
                                                const newForms = [...forms];
                                                newForms[index].lat = e.target.value;
                                                setForms(newForms);
                                            }}
                                            disabled
                                        />
                                    </div>

                                    <div style={{ width: "50%" }}>
                                        <InputWithTitle
                                            title={"Longitude"}
                                            type={"text"}
                                            placeholder={"Longitude"}
                                            value={form.lng}
                                            onChange={(e) => {
                                                const newForms = [...forms];
                                                newForms[index].lng = e.target.value;
                                                setForms(newForms);
                                            }}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="centerContainer">
                                <div className="client-save-button" onClick={() => handleFormSubmit(index)}>
                                    {form.isLoading ? 'Saving...' : 'Save'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="col-span-6 plusborder-container">
                <div className="plusborder" onClick={addNewForm}>
                    +
                </div>
            </div>
        </div>
    );
};

export default FirstSection;
