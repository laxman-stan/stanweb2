import { useNavigate, useLocation } from "react-router-dom";

export default function useBetterNavigation(screenName){

    let currentLocation = useLocation().pathname;
    if(screenName!==currentLocation){
        useNavigate(screenName)
    }

}