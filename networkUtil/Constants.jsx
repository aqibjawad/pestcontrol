const baseURL = "http://backend-pestcontrol.worldcitizenconsultants.com/new/public";
const apiPrefix = baseURL + "/api";

export const login = apiPrefix + "/login";
export const getCountriesURL = apiPrefix + "/get_countries";
export const addSupplier = apiPrefix + "/add-supplier";

export const addServicesURL = apiPrefix + "/add_agreement";

// Suppliers api
export const suppliers = apiPrefix + "/supplier";

// reeference api
export const clients = apiPrefix + "/client";

// Brand Apis here
export const brand = apiPrefix + "/brand";

// Venndor Apis
export const vendors = apiPrefix + "/vendor";

// Services Api
export const services = apiPrefix + "/service";