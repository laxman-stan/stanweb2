import { useContext } from "react";
import { UserDataContext } from "../App";
export default function useUserData(){

    return useContext(UserDataContext)
    
}