import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FaqManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
   setUser(storedUser)
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/faq-categories/list");

      setCategories(response.data); // Ensure correct data extraction
    } catch (error) {
      console.error("Error fetching categories:", error.response || error.message);
    }
  };

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

      if (response.data && response.data.category) {
        setCategories((prev) => [...prev, response.data.category]);
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

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">FAQ Category Management</h1>

      {user?.role === "admin" && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New FAQ Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              Add Category
            </button>
          </form>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">FAQ Categories</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                Category Name
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
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
