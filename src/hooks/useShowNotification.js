import { useContext } from "react"
import { NotificationContext } from "../App"

export default function useShowNotification(){
   return useContext(NotificationContext)
}