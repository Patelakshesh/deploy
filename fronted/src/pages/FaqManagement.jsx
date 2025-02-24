import React, { useState } from "react";
import FaqCategories from "../components/FaqCategoryAdd";
import Faqs from "../components/Faqs";
import { USER_API_END_POINT } from "../utils/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function FaqManagement() {
  const [view, setView] = useState("categories"); 
  const navigate = useNavigate();
  const {t,i18n} = useTranslation();

  const handleLogout = async () => {
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, 
        { 
          withCredentials: true
         }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">{t("faq_title")}</h1>

        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setView("categories")}
            className={`px-4 py-2 rounded-lg ${
              view === "categories"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 shadow-md"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setView("faqs")}
            className={`px-4 py-2 rounded-lg ${
              view === "faqs"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 shadow-md"
            }`}
          >
            FAQs
          </button>
          <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
    >
      Logout
    </button>
    <button onClick={() => i18n.changeLanguage("fr")}>FR</button>
    <button onClick={() => i18n.changeLanguage("en")}>EN</button>
        </div>

        {/* Render the appropriate component */}
        {view === "categories" ? <FaqCategories /> : <Faqs />}
      </div>
    </div>
  );
}