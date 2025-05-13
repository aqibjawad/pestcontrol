"use client";

import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import styles from "../../styles/serviceReport.module.css";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button
} from "@mui/material";

const UseChemicals = ({ formData, setFormData, employeeList }) => {
  const [used_products, setChemicals] = useState([]);
  const [editingChemical, setEditingChemical] = useState(null);

  // Initialize chemicals from formData
  useEffect(() => {
    if (formData.used_products) {
      const chemicalsWithDefaults = formData.used_products.map((chemical) => ({
        ...chemical,
        is_extra: 0,
        price: 0,
      }));
      setChemicals(chemicalsWithDefaults);
    }
  }, [formData]);

  // Handle opening edit modal
  const handleEditChemical = (chemical) => {
    setEditingChemical({ ...chemical });
  };

  // Handle closing edit modal
  const handleCloseEditModal = () => {
    setEditingChemical(null);
  };

  // Update chemical in the list
  const handleUpdateChemical = () => {
    if (!editingChemical) return;

    const updatedChemicals = used_products.map(chemical => 
      chemical.id === editingChemical.id ? editingChemical : chemical
    );

    setChemicals(updatedChemicals);
    setFormData((prevFormData) => ({
      ...prevFormData,
      used_products: updatedChemicals
    }));

    handleCloseEditModal();
  };

  // Delete chemical from the list
  const handleDeleteChemical = (chemicalId) => {
    const updatedChemicals = used_products.filter(
      (chemical) => chemical.id !== chemicalId
    );
    
    setChemicals(updatedChemicals);
    setFormData((prevFormData) => ({
      ...prevFormData,
      used_products: updatedChemicals
    }));
  };

  return (
    <div>
      <div className="flex justify-between p-8">
        <div className="flex flex-col">
          <div className={styles.areaHead}>Chemical and Material</div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Chemical and Material Used</th>
              <th>Dose</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {used_products.map((chemical, index) => (
              <tr key={chemical.id}>
                <td className="text-center">{index + 1}</td>
                <td style={{textAlign:"center"}}>
                  {chemical.product?.product_name || 'Unnamed Product'}
                </td>
                <td className="text-center">{chemical.dose}</td>
                <td className="text-center">{chemical.qty}</td>
                <td className="text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <FaEdit 
                      className="text-blue-500 cursor-pointer" 
                      onClick={() => handleEditChemical(chemical)}
                    />
                    <FaTrash
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDeleteChemical(chemical.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Chemical Modal */}
      <Dialog 
        open={!!editingChemical} 
        onClose={handleCloseEditModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Chemical</DialogTitle>
        <DialogContent>
          <div className="grid gap-4 py-4">
            <TextField
              margin="dense"
              label="Product"
              type="text"
              fullWidth
              variant="outlined"
              value={editingChemical?.product?.product_name || 'Unnamed Product'}
              disabled
            />
            <TextField
              margin="dense"
              label="Dose"
              type="text"
              fullWidth
              variant="outlined"
              value={editingChemical?.dose || ''}
              onChange={(e) => 
                setEditingChemical(prev => 
                  prev ? { ...prev, dose: e.target.value } : null
                )
              }
            />
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              variant="outlined"
              value={editingChemical?.qty || ''}
              onChange={(e) => 
                setEditingChemical(prev => 
                  prev ? { ...prev, qty: Number(e.target.value) } : null
                )
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateChemical} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UseChemicals;