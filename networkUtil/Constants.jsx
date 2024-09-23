const baseURL =
  "http://backend-pestcontrol.worldcitizenconsultants.com/new/public";
const apiPrefix = baseURL + "/api";

export const login = apiPrefix + "/login";
export const getCountriesURL = apiPrefix + "/get_countries";
export const addSupplier = apiPrefix + "/add-supplier";

export const addServicesURL = apiPrefix + "/add_agreement";

// admin Apis here
export const admin = apiPrefix + "/admin/ledger/get";


// Brand Apis here
export const brand = apiPrefix + "/brand";

// Products Apis here
export const product = apiPrefix + "/product";

// Products Apis here
export const purchaseOrder = apiPrefix + "/purchase_order";

// vehicles Apis here
export const vehciles = apiPrefix + "/vehicle";

// vehicles Apis here
export const bank = apiPrefix + "/bank";

// vehicles Apis here
export const expense_category = apiPrefix + "/expense_category";

export const vehicleExpense = apiPrefix + "/vehicle_expense"

export const treatmentMethod = apiPrefix + "/treatment_method"


// vehicles Apis here
export const expense = apiPrefix + "/expense";


// Venndor Apis
export const vendors = apiPrefix + "/vendor";

// Services Api
export const services = apiPrefix + "/service";

// Employee Api
export const addEmployee = apiPrefix + "/employee/create";

// Employee Api
export const addStock = apiPrefix + "/employee";

export const getAllEmpoyesUrl = apiPrefix + "/employee";

export const getAllSuppliers = apiPrefix + "/supplier";
