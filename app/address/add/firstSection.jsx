import React, { useState, useCallback, useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import styles from "../../../styles/loginStyles.module.css";

const libraries = ["places"];

const FirstSection = () => {
    
  console.log("FirstSection component rendering");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyD1nQhK29CQk2DAdE96qT9ta3XOtkqg6uI",
    libraries,
  });

  console.log("useLoadScript result:", { isLoaded, loadError });

  const [forms, setForms] = useState([
    { search: "", address: "", city: "", lat: "", lng: "", isLoading: false },
  ]);

  const autocompleteRefs = useRef([]);

  useEffect(() => {
    console.log("Current forms state:", forms);
  }, [forms]);

  const handlePlaceSelected = useCallback((index, place) => {
    console.log(`Place selected for index ${index}:`, place);
    if (!place.geometry) {
      console.error("No geometry found for the selected place.");
      return;
    }

    const address = place.formatted_address;
    const city =
      place.address_components.find((component) =>
        component.types.includes("locality")
      )?.long_name || "";
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    console.log("Extracted place details:", { address, city, lat, lng });

    setForms((prevForms) => {
      const newForms = [...prevForms];
      newForms[index] = {
        ...newForms[index],
        address,
        city,
        lat,
        lng,
        search: address,
      };
      console.log(`Updated form at index ${index}:`, newForms[index]);
      return newForms;
    });
  }, []);

  const handleInputChange = useCallback((index, value) => {
    console.log(`Input changed for index ${index}:`, value);
    setForms((prevForms) => {
      const newForms = [...prevForms];
      newForms[index] = { ...newForms[index], search: value };
      return newForms;
    });
  }, []);

  const handleFormSubmit = async (index) => {
    console.log(`Form submit triggered for index ${index}`);
    // ... (rest of the handleFormSubmit function remains unchanged)
  };

  const addNewForm = useCallback(() => {
    console.log("Adding new form");
    setForms((prevForms) => [
      ...prevForms,
      { search: "", address: "", city: "", lat: "", lng: "", isLoading: false },
    ]);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      console.log("Google Maps script loaded successfully");
    }
  }, [isLoaded]);

  if (loadError) {
    console.error("Error loading Google Maps API:", loadError);
    return <div>Error loading maps: {loadError.message}</div>;
  }
  if (!isLoaded) {
    console.log("Google Maps script is still loading");
    return <div>Loading maps...</div>;
  }

  return (
    <div
      className="grid grid-cols-12 gap-4"
      style={{ width: "100%", maxWidth: "1200px" }}
    >
      <div className="col-span-6">
        {forms.map((form, index) => (
          <div
            key={index}
            className="centerContainer"
            style={{ marginBottom: "20px" }}
          >
            <div
              className={styles.userFormContainer}
              style={{ fontSize: "16px", margin: "auto" }}
            >
              <div className="mt-10">
                <InputWithTitle title={"Search"}>
                  <div>
                    <input
                      ref={(el) => {
                        autocompleteRefs.current[index] = el;
                        console.log(`Input ref set for index ${index}:`, el);
                      }}
                      type="text"
                      placeholder="Search for a place"
                      value={form.search}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      style={{ width: "100%", height: "40px", padding: "12px" }}
                    />
                    {isLoaded && (
                      <div style={{ display: "none" }}>
                        <div
                          ref={(el) => {
                            if (
                              el &&
                              !autocompleteRefs.current[index].pacInstance
                            ) {
                              console.log(`Initializing Autocomplete for index ${index}`);
                              try {
                                const autocomplete =
                                  new window.google.maps.places.Autocomplete(
                                    autocompleteRefs.current[index],
                                    {
                                      types: ["(cities)"],
                                      fields: [
                                        "address_components",
                                        "geometry",
                                        "formatted_address",
                                      ],
                                    }
                                  );
                                autocomplete.addListener("place_changed", () => {
                                  console.log(`Place changed for index ${index}`);
                                  const place = autocomplete.getPlace();
                                  handlePlaceSelected(index, place);
                                });
                                autocompleteRefs.current[index].pacInstance =
                                  autocomplete;
                                console.log(`Autocomplete initialized for index ${index}:`, autocomplete);
                              } catch (error) {
                                console.error(`Error initializing Autocomplete for index ${index}:`, error);
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </InputWithTitle>
              </div>

              {/* Rest of the form fields remain unchanged */}

              <div className="centerContainer">
                <div
                  className="client-save-button"
                  onClick={() => handleFormSubmit(index)}
                >
                  {form.isLoading ? "Saving..." : "Save"}
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