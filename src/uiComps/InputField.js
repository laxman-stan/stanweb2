import { useState } from "react"
import { a, useSpring } from '@react-spring/web'
import { useEffect, useRef } from "react"
import { colors} from "../constants/colors"


export default function InputField({
    placeholder="type here...",
    ourterContStyle, 
    value,
    onChange,
    type,
    preComp
}) {
const PLACE_HOLDER_TEXT = placeholder
const WID = '100%'

    const inputRef = useRef();
    const animInputRef = useRef();
    const [isFocused, setIsFocused] = useState(false);


    const scrollAnimInput = (left) => {
        animInputRef.current.scrollTo({ left , behavior: 'smooth'})
    }

    useEffect(() => {
        inputRef.current.addEventListener('scroll', () => {
            scrollAnimInput(inputRef.current.scrollLeft);
        })

    }, [])

    return (
        <div style={{...ourterContStyle, borderColor: isFocused? 'white' : 'transparent'}} className="f ac inputOuterCont bn">
        {preComp && preComp}
        <div className="f rp">

            <div className="f ap animInputCont" style={{ top: 0, width: WID }}>
                <div ref={animInputRef} style={{ overflowX: 'scroll' }} className="f noScrollBar">
                    {value?.split('').map((value, index) => <AnimText key={index} item={value} />)}
                </div>
            </div>

            <input
                type={type}
                ref={inputRef}
                onFocus={()=>setIsFocused(true)}
                onBlur={()=>setIsFocused(false)}
                className="normalText customInput"
                value={value}
                maxLength="10"
                style={{ zIndex: 3 , width: WID}}
                onChange={onChange}
                placeholder={PLACE_HOLDER_TEXT} />
                
        </div>
        </div>
    )
}

const AnimText = ({ item }) => {

    const animStyle =  useSpring({
        config: { mass: 1, tension: 180, friction: 12 },
        from: { opacity: 0, transform: 'scale(0)', y: -4 }, to: { opacity: 1, transform: 'scale(1)', y: 0 },
    }) 

    return (
        <a.pre className="normalText" style={{...animStyle}}>{item}</a.pre>
    )
}
