import React from "react";

import FirstSection from "./addinventory/firstSection";
import SecondSection from "./addinventory/secondSection";

const AddInventory = () => {
    return (
        <>
            <div style={{ fontWeight: "600", fontsize: "20px", color: "#1C1C1E", marginLeft:"2rem" }}>
                Inventory items
            </div>


            <div style={{ color: "#667085", fontWeight: "600", fontsize: "16px", marginLeft:"2rem", marginTop:"1rem" }}>
                Us to meet your needs. We look forward to serving you with excellenc
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>


                <div className="grid grid-cols-12 gap-4" style={{ width: '100%', maxWidth: '1200px' }}>
                    <div className="col-span-6">
                        <FirstSection />
                    </div>

                    <div className="col-span-6">
                        <SecondSection />
                    </div>

                    <div className="col-span-12" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: "2rem" }}>
                        <div style={{
                            backgroundColor: "#32A92E",
                            color: 'white',
                            fontWeight: '600',
                            fontSize: "16px",
                            height: "48px",
                            width: "325px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "12px 16px",
                            borderRadius: "10px"
                        }}>
                            Submit
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddInventory;
