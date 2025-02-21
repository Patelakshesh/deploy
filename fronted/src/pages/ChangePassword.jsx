import React, { useState } from 'react'
import { USER_API_END_POINT } from "../utils/api";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function ChangePassword() {
    const [input, setInput] = useState({
        oldPassword: '',
        newPassword: '',
    });
    const navigate = useNavigate()

    const handleChange = (e) => {
        setInput({...input, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${USER_API_END_POINT}/changepassword`, input, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem('token')
                },
                withCredentials: true,
            })
            alert(res.data.message);
            navigate('/')
        } catch (error) {
            console.log(error)
            alert(error.response.data.message);
        }
    }
  return (
    <div className="container mx-auto max-w-md mt-10">
      <h2 className="text-xl font-bold text-center mb-5">Change Password</h2>
      <form  className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={input.oldPassword}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={input.newPassword}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Update Password
        </button>
      </form>
    </div>
  )
}
