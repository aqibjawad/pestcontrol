const baseURL =
  "http://backend-pestcontrol.worldcitizenconsultants.com/new/public";

// const baseURL = "https://api.dubaiaccuratepestcontrolservices.com";
const apiPrefix = baseURL + "/api";

export const login = apiPrefix + "/login";
export const getCountriesURL = apiPrefix + "/get_countries";
export const addSupplier = apiPrefix + "/add-supplier";

export const addServicesURL = apiPrefix + "/add_agreement";

// admin Apis here
export const dashboard = apiPrefix + "/dashboard";

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

export const clients = apiPrefix + "/client";

// vehicles Apis here
export const expense_category = apiPrefix + "/expense_category";

export const vehicleExpense = apiPrefix + "/vehicle_expense";

export const treatmentMethod = apiPrefix + "/treatment_method";

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

export const quotation = apiPrefix + "/quote";

export const termsCond = apiPrefix + "/terms_and_condition";

export const job = apiPrefix + "/job";

export const serviceInvoice = apiPrefix + "/service_invoices";

export const addSupplierBankInfo = apiPrefix + "/supplier/bank_info/add";

export const customers = apiPrefix + "/customer";

export const saleOrder = apiPrefix + "/sale_order";

export const supplierPayment = apiPrefix + "/add_payment";

export const payments = apiPrefix + "/received_cash_record";

export const admin = apiPrefix + "/ledger/get";

export const outstandings = apiPrefix + "/outstandings";
