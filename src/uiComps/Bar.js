import { colors } from "../constants/colors"
import {a} from '@react-spring/web'
export default function Bar({
    width="100%",
    height=2,
    x=0,
    color=colors.mainHighlight,
    otherStyles
}){

    return <a.div
    style={{
        width,
        height,
        x: x,
        backgroundColor: color,
        ...otherStyles,
    }}
    />
}