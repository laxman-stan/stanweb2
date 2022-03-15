import BouncyComp from "./BouncyComp";
import { Close } from "../assets";

export default function CloseIcon({styles, onClick}){


    return <BouncyComp
    onClick={onClick}
    styles={{
        position: 'absolute',
        ...styles
    }}
    customChild={<img
    style={{
        width: 'var(--baseVal6)',
    }}
    src={Close}
    />}
    />
}
