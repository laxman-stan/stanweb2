import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function useCheckIsLoggedIn(setState){
    const navigate = useNavigate();

    useEffect(()=>{
        if(sessionStorage.authToken)
            setState(true);
        else
            navigate('/cricexchange', {replace: true})
    }, [])
}