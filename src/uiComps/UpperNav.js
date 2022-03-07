import { useContext } from "react"
import { NotificationContext } from "../App"
export default function UpperNav(){

    const showNoification = useContext(NotificationContext)


    return <div onClick={()=>showNoification('bhagle')} className="f se ac fw absPos nav bgg1 upperNav">

    </div>
}