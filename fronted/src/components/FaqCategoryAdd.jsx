import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FaqManagament() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // Fetch all FAQ categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/faq-categories/list");
     setCategories(response.data); // Ensure correct data extraction
    } catch (error) {
      console.error("Error fetching categories:", error.response || error.message);
    }
  };

  // Add a new FAQ category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      alert("Category name is required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/faq-categories/add", {
        faq_cat_name: newCategory,
      });

    // Assuming response.data.data contains the newly created category object
   if (response.data && response.data.category) {
  setCategories((prevCategories) => [...prevCategories, response.data.category]);
} else {
      alert("Unexpected response structure");
    }
      setNewCategory("");
      alert("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error.response || error.message);
      alert("Failed to add category. Please try again.");
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">FAQ Category Management</h1>

      {/* Add Category Form */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New FAQ Category</h2>
        <form onSubmit={handleAddCategory}>
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter category name"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* List Categories Table */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">FAQ Categories</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.faq_cat_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.createdAt ? new Date(category.createdAt).toLocaleString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
