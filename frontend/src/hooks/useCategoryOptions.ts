/**
 * Custom hook for managing category options, including inline creation
 */

import { useState, useEffect } from "react";
import { EXPENSE_CATEGORIES } from "../constants/categories";
import { fetchCategories, createCategory } from "../services/api";

export function useCategoryOptions() {
  const [categories, setCategories] = useState<string[]>([
    ...EXPENSE_CATEGORIES,
  ]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        const names = data.map((c) => c.name);
        setCategories((prev) => Array.from(new Set([...prev, ...names])));
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  const startAddingCategory = () => {
    setIsAddingCategory(true);
  };

  const cancelAddingCategory = () => {
    setIsAddingCategory(false);
    setNewCategoryName("");
    setCategoryError("");
  };

  const saveNewCategory = async (onSuccess: (name: string) => void) => {
    const name = newCategoryName.trim();

    if (!name) {
      setCategoryError("Category name is required");
      return;
    }

    const isDuplicate = categories.some(
      (existing) => existing.toLowerCase() === name.toLowerCase(),
    );
    if (isDuplicate) {
      setCategoryError(`Category "${name}" already exists`);
      return;
    }

    setIsSavingCategory(true);
    setCategoryError("");
    try {
      const category = await createCategory(name);
      setCategories((prev) => Array.from(new Set([...prev, category.name])));
      onSuccess(category.name);
      cancelAddingCategory();
    } catch (err) {
      setCategoryError(
        err instanceof Error ? err.message : "Failed to add category",
      );
    } finally {
      setIsSavingCategory(false);
    }
  };

  return {
    categoryOptions,
    isAddingCategory,
    newCategoryName,
    setNewCategoryName,
    categoryError,
    isSavingCategory,
    startAddingCategory,
    cancelAddingCategory,
    saveNewCategory,
  };
}