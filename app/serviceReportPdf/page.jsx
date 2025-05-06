import React from "react";

const Page = () => {
  return (
    <div style={{width:"1000px", border:"1px solid black", marginTop:"2rem", marginLeft:"2rem"}}>
      <div className="p-4 border-b space-y-6">
        <div className="flex justify-between items-start">
          {/* Centered "SERVICE REPORT" with city options */}
          <div className="flex flex-col items-center w-full">
            <div className="bg-black text-white font-bold px-4 py-1 rounded">
              SERVICE REPORT
            </div>
            <div className="flex gap-4 mt-2">
              {["Dubai", "Sharjah", "Ajman"].map((city) => (
                <div className="flex items-center gap-1" key={city}>
                  <span>{city}</span>
                  <div className="w-4 h-4 border border-black rounded-sm"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: No. and Date */}
          <div className="text-sm text-right space-y-1">
            <div>
              <span className="font-semibold">No.</span>
            </div>
            <div>
              <span className="font-semibold">Date:</span>
              <span className="inline-block ml-2 border-b border-black w-24"></span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start">
          {/* Left: Logo & Municipality */}
          <div className="flex gap-8">
            {/* Logo */}
            <div>
              <img
                src="/logo.jpeg"
                alt="Accurate Pest Control"
                className="w-32"
              />
            </div>

            {/* Municipality Approval */}
            <div>
              <img
                src="/approved_by_logo.svg"
                alt="Approved by Dubai Municipality"
                className="w-60"
              />
            </div>
          </div>

          {/* Right: Client Info */}
          <div className="text-sm space-y-2">
            <div>
              <span className="font-semibold">Client Name:</span>
              <span className="border-b border-black inline-block w-40 ml-2"></span>
            </div>
            <div>
              <span className="font-semibold">Facility Covered:</span>
              <span className="border-b border-black inline-block w-32 ml-2"></span>
            </div>
            <div>
              <span className="font-semibold">Address:</span>
              <span className="border-b border-black inline-block w-48 ml-2"></span>
            </div>
            <div>
              <span className="font-semibold">Contact No:</span>
              <span className="border-b border-black inline-block w-40 ml-2"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
