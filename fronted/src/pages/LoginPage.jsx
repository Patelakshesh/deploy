import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup'
import { USER_API_END_POINT } from "../utils/api";
import { useFormik } from "formik";

export default function LoginPage() {
  const navigate = useNavigate();
  const validationSchema = Yup.object({
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
          email: '',
          password: '',
          role: '',
        },
        validationSchema,
        onSubmit: async (values, {setSubmitting}) => {
          try {
            const res = await axios.post(`${USER_API_END_POINT}/login`,  values, {
              headers: {
                "Content-Type": "application/json"
              },
              withCredentials: true,
            })
            if(res.data.success){
              localStorage.setItem("token", res.data.token); 
              navigate('/')
              alert(res.data.message);
            }
          }  catch (error) {
            alert(error.response?.data?.message || "Verify you email");
          }
          setSubmitting(false);
        }

      })
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6"onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm">{formik.errors.password}</p>
                )}
              </div>
            </div>
            <div className="flex">
              <div className="flex items-center ps-4 rounded-sm">
                <input
                  id="bordered-radio-1"
                  type="radio"
                  name="role"
                  value="user"
                  checked={formik.values.role === "user"}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 focus:ring-2"
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
                  className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="bordered-radio-2"
                  className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                >
                  admin
                </label>
              </div>
            </div>
            <div>
            {formik.touched.role && formik.errors.role && (
                <p className="text-red-500 text-sm">{formik.errors.role}</p>
              )}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {formik.isSubmitting ? "Login..." : "Login"}
              </button>
            </div>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
               to={'/register'}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
