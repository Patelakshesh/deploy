import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import * as Yup from "yup"
import {USER_API_END_POINT} from '../utils/api'


export default function RegisterPage() {
  const navigate = useNavigate();

   const validationSchema = Yup.object({
    fullname: Yup.string().matches(/^[A-Za-z\s]+$/, "Only letters are allowed").min(3, "Fullname must be at least 3 characters").required("Fullname is Required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-zA-Z]/, "Must contain at least one letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Password is required"),
  role: Yup.string().required("Please select a role"),
  })
  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      password: '',
      role: '',
    },
    validationSchema,
    onSubmit: async (values, {setSubmitting}) => {
      try {
        const res = await axios.post(`${USER_API_END_POINT}/register`, values, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        if (res.data.success) {
          alert(res.data.message);
          navigate("/login");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong");
      }
      setSubmitting(false);
    },
  })
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  fullname
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formik.values.fullname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter Your Name"
                />
                {formik.touched.fullname && formik.errors.fullname && (
                  <p className="text-red-500 text-sm">{formik.errors.fullname}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter Your Email"
                  
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm">{formik.errors.password}</p>
                )}
              </div>
              <div className = "flex">
              <div className="flex items-center ps-4 rounded-sm">
                <input
                  id="bordered-radio-1"
                  type="radio"
                  name="role"
                  value="user"
                  checked={formik.values.role === "user"}
                    onChange={formik.handleChange}
                  className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="bordered-radio-1"
                  className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                >
                  user
                </label>
              </div>

              <div className="flex items-center ps-4 rounded-sm">
                <input
                  id="bordered-radio-2"
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formik.values.role === "admin"}
                    onChange={formik.handleChange}
                  className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="bordered-radio-2"
                  className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                >
                  admin
                </label>
              </div>
              </div>
              {formik.touched.role && formik.errors.role && (
                <p className="text-red-500 text-sm">{formik.errors.role}</p>
              )}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                {formik.isSubmitting ? "Creating..." : "Create an account"}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                 to={'/login'}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
