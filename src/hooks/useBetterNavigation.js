import { useNavigate, useLocation } from "react-router-dom";

export default function useBetterNavigation(){

    let navigate = useNavigate();
    let currentLocation = useLocation().pathname;
    
    return (screenName)=> screenName!==currentLocation? navigate(screenName) : ()=>{}

}