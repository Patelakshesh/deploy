import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setDeleteLoading, setLoading } from "../redux/authSlice";
import { Loader2 } from "lucide-react";

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({
    cat_id: "",
    question: "",
    answer: "",
  });
  const [editFaq, setEditFaq] = useState(null);
  const [categories, setCategories] = useState([]);
  const [deletingFaqId, setDeletingFaqId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalPages: 1,
  });
  const { loading, deleteLoading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(
        "https://deploy-7q6y.onrender.com/api/v1/faqs/list",
        {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            search: searchTerm,
          },
        }
      );
      setFaqs(response.data.faqs);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalFaqs: response.data.totalFaqs,
      }));
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://deploy-7q6y.onrender.com/api/v1/faq-categories/list"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      await axios.post("https://deploy-7q6y.onrender.com/api/v1/faqs/add", newFaq);

      setNewFaq({ cat_id: "", question: "", answer: "" });
      fetchFaqs();
      alert("FAQ added successfully!");
    } catch (error) {
      alert("Failed to add FAQ");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditFaq = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      await axios.put(
        `https://deploy-7q6y.onrender.com/api/v1/faqs/edit/${editFaq._id}`,
        editFaq
      );
      setEditFaq(null);
      fetchFaqs();
      alert("FAQ updated successfully!");
    } catch (error) {
      alert("Failed to update FAQ");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        setDeletingFaqId(id);
        await axios.delete(`https://deploy-7q6y.onrender.com/api/v1/faqs/delete/${id}`);
        fetchFaqs();
        alert("FAQ deleted successfully!");
      } catch (error) {
        alert("Failed to delete FAQ");
      } finally {
        setDeletingFaqId(null);
      }
    }
  };

  useEffect(() => {
    fetchFaqs();
    fetchCategories();
  }, [pagination.page, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => {
              setNewFaq({ cat_id: "", question: "", answer: "" });
              setEditFaq({});
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Add New FAQ
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Answer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faqs.map((faq) => (
                <tr key={faq._id}>
                  <td className="px-6 py-4 max-w-xs whitespace-pre-wrap">
                    {faq.question}
                  </td>
                  <td className="px-6 py-4 max-w-xs whitespace-pre-wrap">
                    {faq.answer}
                  </td>
                  <td className="px-6 py-4">{faq.cat_id?.faq_cat_name}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => setEditFaq(faq)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteFaq(faq._id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={deletingFaqId === faq._id}
                    >
                      {deletingFaqId === faq._id ? (
                        <Loader2 className="animate-spin inline-block" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {editFaq !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editFaq._id ? "Edit FAQ" : "Add New FAQ"}
            </h2>
            <form onSubmit={editFaq._id ? handleEditFaq : handleAddFaq}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={editFaq._id ? editFaq.cat_id : newFaq.cat_id}
                    onChange={(e) =>
                      editFaq._id
                        ? setEditFaq((prev) => ({
                            ...prev,
                            cat_id: e.target.value,
                          }))
                        : setNewFaq((prev) => ({
                            ...prev,
                            cat_id: e.target.value,
                          }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.faq_cat_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Question
                  </label>
                  <textarea
                    value={editFaq._id ? editFaq.question : newFaq.question}
                    onChange={(e) =>
                      editFaq._id
                        ? setEditFaq((prev) => ({
                            ...prev,
                            question: e.target.value,
                          }))
                        : setNewFaq((prev) => ({
                            ...prev,
                            question: e.target.value,
                          }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Answer
                  </label>
                  <textarea
                    value={editFaq._id ? editFaq.answer : newFaq.answer}
                    onChange={(e) =>
                      editFaq._id
                        ? setEditFaq((prev) => ({
                            ...prev,
                            answer: e.target.value,
                          }))
                        : setNewFaq((prev) => ({
                            ...prev,
                            answer: e.target.value,
                          }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    rows="5"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditFaq(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : editFaq?._id
                    ? "Update FAQ"
                    : "Add FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
