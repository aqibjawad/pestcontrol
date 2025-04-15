"use client";
import React, { useState, useEffect } from "react";
import InputWithTitle from "@/components/generic/InputWithTitle";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import MultilineInput from "@/components/generic/MultilineInput";
import Dropdown from "@/components/generic/dropDown";
import GreenButton from "@/components/generic/GreenButton";
import { CircularProgress } from "@mui/material";
import Tabs from "./tabs";
import { getAllSuppliers, bank, expense } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { AppAlerts } from "../../../Helper/AppAlerts";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";
import styles from "../../../styles/superAdmin/addExpensesStyles.module.css";

const Page = () => {
  const api = new APICall();
  const alerts = new AppAlerts();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("cash");
  const [vat, setVat] = useState("");
  const [total, setTotal] = useState("");
  const [description, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [receipt_no, setReceiptNo] = useState("");
  const [cheque_no, setChequeNumber] = useState("");
  const [cheque_date, setChequeDate] = useState("");
  const [transection_id, setTransactionId] = useState("");
  const [fetchingData, setFetchingData] = useState(false);
  const [allSupplierList, setAllSuppliersList] = useState([]);
  const [allSupplierNameList, setSupplierNameList] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [allBanksList, setAllBankList] = useState([]);
  const [allBankNameList, setBankNameList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [fetchingNotes, setFetchingNotes] = useState(false);
  const [receipt_file, setExpenseFile] = useState();

  const handleFileSelect = (file) => {
    setExpenseFile(file);
  };

  // Calculate total whenever amount or VAT changes
  useEffect(() => {
    calculateTotal();
  }, [amount, vat]);

  const calculateTotal = () => {
    const amountValue = parseFloat(amount) || 0;
    const vatPercentage = parseFloat(vat) || 0;
    const vatAmount = (amountValue * vatPercentage) / 100;
    const calculatedTotal = amountValue + vatAmount;
    setTotal(calculatedTotal.toFixed(2));
  };

  const handleAmountChange = (value) => {
    setAmount(value);
  };

  const handleVatChange = (value) => {
    setVat(value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset values when changing tabs
    if (!selectedInvoice) {
      setAmount("");
      setVat("");
      setTotal("");
    }
  };

  useEffect(() => {
    getAllSupplier();
    getAllBanks();
  }, []);

  // Fetch delivery notes when supplier is selected
  useEffect(() => {
    if (selectedSupplier) {
      fetchDeliveryNotes(selectedSupplier.id);
      setSelectedInvoice(null);
      setAmount("");
      setVat("");
      setTotal("");
    }
  }, [selectedSupplier]);

  const getAllSupplier = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllSuppliers}`);
      setAllSuppliersList(response.data);
      const expenseNames = response.data.map((item) => item.supplier_name);
      setSupplierNameList(expenseNames);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const fetchDeliveryNotes = async (supplierId) => {
    setFetchingNotes(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllSuppliers}/delivery_note/get/${supplierId}/unpaid`
      );
      if (response.data && response.data.delivery_note) {
        setDeliveryNotes(response.data.delivery_note);
      } else {
        setDeliveryNotes([]);
      }
    } catch (error) {
      console.error("Error fetching delivery notes:", error);
      setDeliveryNotes([]);
    } finally {
      setFetchingNotes(false);
    }
  };

  const getAllBanks = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${bank}`);
      setAllBankList(response.data);
      const expenseNames = response.data.map((item) => item.bank_name);
      setBankNameList(expenseNames);
    } catch (error) {
      console.error("Error fetching banks:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleExpenseChange = (name, index) => {
    const selectedSupplier = allSupplierList[index];
    setSelectedSupplier(selectedSupplier);
    setSelectedInvoice(null);
  };

  const supplierOptions = allSupplierList.map(
    (supplier) =>
      `${supplier.supplier_name} - ${supplier.company_name} (${supplier.number})`
  );

  const handleBankChange = (name, index) => {
    const idAtIndex = allBanksList[index].id;
    setSelectedBankId(idAtIndex);
  };

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setAmount(invoice.grand_total);
    // Reset VAT as it will be calculated on the full amount
    setVat("0");
  };

  const createExpenseObject = () => {
    let expenseObj = {
      supplier_id: selectedSupplier.id,
      vat,
      total,
      description,
      payment_type: activeTab,
      delivery_note_id: selectedInvoice.id,
      receipt_no,
    };
    if (receipt_file) {
      expenseObj.receipt_file = receipt_file;
    }

    if (activeTab === "cash") {
      expenseObj = {
        ...expenseObj,
        amount,
      };
    } else if (activeTab === "cheque") {
      expenseObj = {
        ...expenseObj,
        amount,
        cheque_no,
        cheque_date,
      };
    } else if (activeTab === "online") {
      expenseObj = {
        ...expenseObj,
        amount,
        transection_id,
      };
    }

    return expenseObj;
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);

    const expenseData = createExpenseObject();
    try {
      const response = await api.postFormDataWithToken(
        `${getAllSuppliers}/add_payment`,
        expenseData
      );

      if (response.status === "success") {
        alerts.successAlert("Payment has been added successfully");
        router.push(
          `/account/supplier_ledger/?id=${selectedSupplier.id}&supplier_name=${
            selectedSupplier.supplier_name
          }&company_name=${encodeURIComponent(
            selectedSupplier.company_name
          )}&number=${selectedSupplier.number}`
        );
      } else {
        alerts.errorAlert(response.error.message);
      }
    } catch (error) {
      alerts.errorAlert("An error occurred while processing payment");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleChequeDate = (name, value) => {
    setChequeDate(value);
  };

  const renderDeliveryNotes = () => {
    if (fetchingNotes) {
      return (
        <div className="flex justify-center p-4">
          <CircularProgress size={30} />
        </div>
      );
    }

    if (!selectedSupplier) {
      return (
        <div className="text-gray-500 p-4 text-center">
          Please select a supplier to view unpaid invoices
        </div>
      );
    }

    if (deliveryNotes.length === 0) {
      return (
        <div className="text-gray-500 p-4 text-center">
          No unpaid invoices found for this supplier
        </div>
      );
    }

    return (
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 border-b text-left">Select</th>
              <th className="py-2 px-3 border-b text-left">Invoice No</th>
              <th className="py-2 px-3 border-b text-left">PO Number</th>
              <th className="py-2 px-3 border-b text-left">Date</th>
              <th className="py-2 px-3 border-b text-left">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {deliveryNotes.map((note) => (
              <tr key={note.id} className="hover:bg-gray-50">
                <td className="py-2 px-3 border-b">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-green-600"
                    checked={selectedInvoice && selectedInvoice.id === note.id}
                    onChange={() => handleInvoiceSelect(note)}
                    name="invoice-selection"
                  />
                </td>
                <td className="py-2 px-3 border-b">
                  {note.invoice_no || "Not Generated"}
                </td>
                <td className="py-2 px-3 border-b">{note.dn_id}</td>
                <td className="py-2 px-3 border-b">{note.delivery_date}</td>
                <td className="py-2 px-3 border-b">{note.grand_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const expenseForm = () => {
    return (
      <div>
        <div className="mt-5">
          <Dropdown
            onChange={(name, index) => handleExpenseChange(name, index)}
            title={"Suppliers List"}
            options={allSupplierNameList}
          />
        </div>

        <div className="mt-5">
          <div className="text-xl font-semibold mb-2">Unpaid Invoices</div>
          {renderDeliveryNotes()}
        </div>

        <div className="mt-5">
          <MultilineInput
            title={"Description"}
            type={"text"}
            placeholder={"Enter description"}
            onChange={setDesc}
          />
        </div>

        <div className="flex items-start gap-4 mt-5">
          <div className="flex-1">
            <InputWithTitle
              title={"Receipt Number"}
              type={"text"}
              placeholder={"Enter Receipt Number"}
              onChange={setReceiptNo}
            />
          </div>
          <div>
            <UploadImagePlaceholder onFileSelect={handleFileSelect} />
          </div>
        </div>

        <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />

        {activeTab === "cash" && (
          <div>
            <div className="mt-5">
              <InputWithTitle
                title={"Cash Amount"}
                type={"number"}
                placeholder={"Cash Amount"}
                onChange={handleAmountChange}
                value={amount}
                disabled={true}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"VAT %"}
                type={"text"}
                placeholder={"VAT"}
                onChange={handleVatChange}
                value={vat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total"}
                type={"text"}
                placeholder={"Total"}
                value={total}
                disabled={true}
              />
            </div>
          </div>
        )}

        {activeTab === "cheque" && (
          <div>
            <div className="mt-5">
              <InputWithTitle3
                title={"Cheque Date"}
                type={"date"}
                placeholder={"Cheque Date"}
                value={cheque_date}
                onChange={handleChequeDate}
              />
            </div>
            <div className="mt-5">
              <InputWithTitle
                title={"Cheque Amount"}
                type={"number"}
                placeholder={"Cheque Amount"}
                onChange={handleAmountChange}
                value={amount}
                disabled={true}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Cheque Number"}
                type={"text"}
                placeholder={"Cheque Number"}
                onChange={setChequeNumber}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"VAT %"}
                type={"text"}
                placeholder={"VAT"}
                onChange={handleVatChange}
                value={vat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total"}
                type={"text"}
                placeholder={"Total"}
                value={total}
                disabled={true}
              />
            </div>
          </div>
        )}

        {activeTab === "online" && (
          <div>
            <div className="mt-5">
              <InputWithTitle
                title={"Transaction Amount"}
                type={"number"}
                placeholder={"Transaction Amount"}
                onChange={handleAmountChange}
                value={amount}
                disabled={true}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Transaction Id"}
                type={"text"}
                placeholder={"Transaction Id"}
                onChange={setTransactionId}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"VAT %"}
                type={"text"}
                placeholder={"VAT"}
                onChange={handleVatChange}
                value={vat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total"}
                type={"text"}
                placeholder={"Total"}
                value={total}
                disabled={true}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Add Supplier Payments</div>
      <div className="mt-10"></div>
      <div className="p-4">{expenseForm()}</div>
      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={
            loadingSubmit ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Submit"
            )
          }
          disabled={loadingSubmit || !selectedInvoice || !selectedSupplier}
        />
      </div>
    </div>
  );
};

export default withAuth(Page);
