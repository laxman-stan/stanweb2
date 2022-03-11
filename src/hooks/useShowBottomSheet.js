import { useContext } from "react";
import { BottomSheetContext } from "../App";

export default function useShowBottomSheet(){
    return useContext(BottomSheetContext);
}