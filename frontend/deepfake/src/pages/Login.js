import React, { useContext, useEffect, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import hostContext from "../context/HostContext";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const context = useContext(hostContext)
    const { host } = context
    const navigate = useNavigate()



    useEffect(() => {
        
       if(localStorage.getItem("Authtoken")){
        navigate('/')
       }
    }, []);
    const handleLogin = async () => {
         if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }
        const response = await fetch(`${host}api/auth/login`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
           
        })
         const jsonResponse = await response.json()
         if(jsonResponse.success){
            localStorage.setItem("Authtoken", jsonResponse.token)
            toast.success("Login Successfull")
            navigate('/')
         }
       

       
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600">
            <ToastContainer position="top-right" />
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Deepfake Detector Login
                </h2>

                {/* Email Field */}
                <div className="mb-4 relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 w-full py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                {/* Password Field */}
                <div className="mb-6 relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 w-full py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all"
                >
                    Login
                </button>

                {/* Optional Link */}
                <p className="text-sm text-center text-gray-600 mt-4">
                    Don’t have an account?{" "}
                    <a href="#" className="text-indigo-600 font-medium hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
