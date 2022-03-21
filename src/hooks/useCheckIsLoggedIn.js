import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function useCheckIsLoggedIn(setState){
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem("authToken")){
            if(localStorage.getItem("savingTime") - Date.now() > 86400000){
                localStorage.removeItem("authToken")
                navigate('/', {replace: true})
            }
            else
            setState(true);
        }else
            navigate('/', {replace: true})
    }, [])
}