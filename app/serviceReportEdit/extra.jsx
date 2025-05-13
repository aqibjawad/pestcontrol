"use client";

import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import styles from "../../styles/serviceReport.module.css";
import AddExtraChemicals from "../../components/addExtraChemicals";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button
} from "@mui/material";

const Extra = ({ formData, setFormData }) => {
  const [openChemicals, setOpenChemicals] = useState(false);
  const [extraChemicals, setExtraChemicals] = useState([]);
  const [editingChemical, setEditingChemical] = useState(null);

  const handleOpenChemicals = () => setOpenChemicals(true);
  const handleCloseChemicals = () => setOpenChemicals(false);

  const handleAddExtraChemical = (newChemical) => {
    // Update the local state for extra chemicals
    const updatedExtraChemicals = [
      ...extraChemicals,
      { ...newChemical, id: Date.now() },
    ];
    setExtraChemicals(updatedExtraChemicals);

    // Update the parent formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      used_products: [
        ...(prevFormData.used_products || []),
        { ...newChemical, id: Date.now(), is_extra: 1 },
      ],
    }));
  };

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

    const updatedExtraChemicals = extraChemicals.map(chemical => 
      chemical.id === editingChemical.id ? editingChemical : chemical
    );

    setExtraChemicals(updatedExtraChemicals);

    // Update parent formData
    setFormData((prevFormData) => {
      const updatedUsedProducts = (prevFormData.used_products || []).map(product => 
        product.id === editingChemical.id ? editingChemical : product
      );

      return {
        ...prevFormData,
        used_products: updatedUsedProducts
      };
    });

    handleCloseEditModal();
  };

  // Delete chemical from the list
  const handleDeleteChemical = (chemicalId) => {
    const updatedExtraChemicals = extraChemicals.filter(
      (chemical) => chemical.id !== chemicalId
    );
    
    setExtraChemicals(updatedExtraChemicals);

    // Update parent formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      used_products: (prevFormData.used_products || []).filter(
        product => product.id !== chemicalId
      )
    }));
  };

  return (
    <div>
      <div className="flex justify-between" style={{ padding: "34px" }}>
        <div className="flex flex-col">
          <div className={styles.areaHead}>Extra Chemical and material</div>
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
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {extraChemicals.map((chemical, index) => (
              <tr key={chemical.id}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>{chemical.name}</td>
                <td style={{ textAlign: "center" }}>{chemical.dose}</td>
                <td style={{ textAlign: "center" }}>{chemical.quantity}</td>
                <td style={{ textAlign: "center" }}>{chemical.price}</td>
                <td style={{ textAlign: "center" }}>
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

      <AddExtraChemicals
        openChemicals={openChemicals}
        handleCloseChemicals={handleCloseChemicals}
        onAddExtraChemical={handleAddExtraChemical}
      />

      {/* Edit Chemical Modal */}
      <Dialog 
        open={!!editingChemical} 
        onClose={handleCloseEditModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Extra Chemical</DialogTitle>
        <DialogContent>
          <div className="grid gap-4 py-4">
            <TextField
              margin="dense"
              label="Chemical Name"
              type="text"
              fullWidth
              variant="outlined"
              value={editingChemical?.name || ''}
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
              value={editingChemical?.quantity || ''}
              onChange={(e) => 
                setEditingChemical(prev => 
                  prev ? { ...prev, quantity: e.target.value } : null
                )
              }
            />
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              value={editingChemical?.price || ''}
              onChange={(e) => 
                setEditingChemical(prev => 
                  prev ? { ...prev, price: e.target.value } : null
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

export default Extra;