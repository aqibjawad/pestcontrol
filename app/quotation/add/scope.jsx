import { useState, useEffect } from "react";

export default function Scope({
  selectedServices = [],
  setFormData,
  formData = {},
}) {
  // Initialize state based on formData, but only on mount
  const [isScopeVisible, setIsScopeVisible] = useState(
    formData?.is_enable_scope_of_work === undefined
      ? true
      : formData.is_enable_scope_of_work === 1
  );

  // Handle toggling of scope visibility
  const handleToggleScope = (isVisible) => {
    setIsScopeVisible(isVisible);
    // Update formData directly when toggled
    if (setFormData) {
      setFormData((prevData) => ({
        ...prevData,
        is_enable_scope_of_work: isVisible ? 1 : 0,
      }));
    }
  };

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Scope of Work</h2>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleToggleScope(false)}
            className={`px-4 py-2 rounded font-medium ${
              !isScopeVisible
                ? "bg-green-600 text-white"
                : "bg-white text-black border border-gray-300"
            }`}
          >
            Disable
          </button>

          <button
            onClick={() => handleToggleScope(true)}
            className={`px-4 py-2 rounded font-medium ${
              isScopeVisible
                ? "bg-green-600 text-white"
                : "bg-white text-black border border-gray-300"
            }`}
          >
            Enable
          </button>
        </div>
      </div>

      {isScopeVisible && (
        <div className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedServices.length === 0 ? (
              <div className="col-span-2">
                <p className="text-gray-500">No services selected</p>
              </div>
            ) : (
              selectedServices.map((service, index) => (
                <div
                  key={`${service.pest_name}-${index}`}
                  className="border border-gray-200 rounded-lg p-4 h-full"
                >
                  <h3 className="text-lg font-bold mb-2">
                    {service.pest_name}
                  </h3>

                  <p className="font-medium mt-4">Service Title:</p>
                  <p>{service.service_title}</p>

                  <p className="font-medium mt-4">Terms and Conditions:</p>
                  <div
                    className="pl-2 prose"
                    dangerouslySetInnerHTML={{
                      __html: service.term_and_conditions,
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
