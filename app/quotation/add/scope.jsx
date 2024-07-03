import React from "react";

const Scope = () => {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col">Scope of Work</div>

      <div className="flex flex-col">
        <div className="flex justify-between">
            <div>
                Enable
            </div>

            <div style={{color:"#38A73B"}}>
                Disable
            </div>
        </div>
      </div>
    </div>
  );
};

export default Scope;
