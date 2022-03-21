import { useOnce } from "@react-spring/shared"
import { useNavigate } from "react-router-dom"
export default function NoMath(){

    const navigate = useNavigate()

    useOnce(()=>{
        console.log('no match')
        navigate("/", {replace: true})
    })
    return <div/>
}