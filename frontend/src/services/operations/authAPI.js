import toast from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice"
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";
import { setUser } from "../../slices/profileSlice";

export function sendOtp(email,navigate){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        const toastId =toast.loading("loading...")
        try {
            const response = await apiConnector("POST",endpoints.SENDOTP_API,{email})
            console.log("SENDOTP API RESPONSE............", response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            
            toast.success("OTP Sent Successfully")
            if(navigate){
                navigate("/verify-email")
            }
           
        } catch (error) {
            console.log("SENDOTP API ERROR............", error)
            toast.error(error.message);
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false));
    }
}



export function login( email, password, navigate,setIsSubmitting){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        const toastId = toast.loading("loading...")
        try {
            const response = await apiConnector("POST",endpoints.LOGIN_API,{email,password});
            console.log("Login response", response);
            if(!response.data.success){
               throw new Error(response.data.message);
            }
            toast.success("Login Successfully");
            const token = response?.data?.token;
            dispatch(setToken(token));
            dispatch(setUser(response?.data?.user));

            localStorage.setItem("token",JSON.stringify(token));
            localStorage.setItem("user",JSON.stringify(response?.data?.user));
            setIsSubmitting(false);
            navigate("/dashboard");
        } catch (error) {
            console.log("Login Error",error);
            toast.error(error.message);
            // toast.error(` ${error.response.data.message}`)
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
        setIsSubmitting(false);
    }
}

export function signUp(
    
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
  ){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST",endpoints.SIGNUP_API,{
                firstName,
                lastName,
                password,
                confirmPassword,
                email,
                otp,
            })

            if(!response.data.success){
                
                throw new Error(response.data.message);
            }
            toast.success("Signup Successfully");
            navigate("/login")
        } catch (error) {
            console.log("SIGN UP API ERROR...",error);
            toast.error(error.message);
            
        }
        dispatch(setLoading(false));
    }
}

export function logout(navigate){
    return async(dispatch)=>{
        dispatch(setToken(null));
        dispatch(setUser(null));
        localStorage.clear("token");
        localStorage.clear("user");
        toast.success("Logged Out");
        navigate("/")
    }
}

