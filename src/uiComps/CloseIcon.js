import BouncyComp from "./BouncyComp";
import { Close } from "../assets";

export default function CloseIcon({styles}){


    return <BouncyComp
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
