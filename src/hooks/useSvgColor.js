import { useSpring } from "@react-spring/web";

export const useSvgColor=(isActive)=>{


    const color = useSpring({
        sColor: isActive? "#4b99ff" : "#000000",
        stroke: isActive? 2 : 1.5,
        fontWeight: isActive? 'bold' : 'normal'
    })

    return color
}