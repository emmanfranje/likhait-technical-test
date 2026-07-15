/**
 * Form component for adding/editing expenses
 */

import React from "react";
import { ExpenseFormData } from "../types";
import { TextField, SelectBox, Button } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { useCategoryOptions } from "../hooks/useCategoryOptions";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  const {
    categoryOptions,
    isAddingCategory,
    newCategoryName,
    setNewCategoryName,
    categoryError,
    isSavingCategory,
    startAddingCategory,
    cancelAddingCategory,
    saveNewCategory,
  } = useCategoryOptions();

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  const categoryLabelRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const categoryLabelStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: 600,
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />

      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />

      <div>
        <div style={categoryLabelRowStyle}>
          <label style={categoryLabelStyle}>
            Category
          </label>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={startAddingCategory}
          >
            + Add category
          </Button>
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <SelectBox
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            error={errors.category}
            fullWidth
            required
          />
        </div>

        {isAddingCategory && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "flex-start",
              marginTop: "0.5rem",
            }}
          >
            <TextField
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              error={categoryError}
              fullWidth
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                saveNewCategory((name) => handleChange("category", name))
              }
              disabled={isSavingCategory}
            >
              {isSavingCategory ? "Adding..." : "Add"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={cancelAddingCategory}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
