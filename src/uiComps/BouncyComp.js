import {a, useSpring} from '@react-spring/web'

export default function BouncyComp({
    styles,
    customChild,
    bounceLevel=.8,
    text,
    onClick,
    useDefaultBtnStyles=false,
    outlined=false,
    useHighlightedBtnStyles=false,
    customClasses=null,
    showLoading
}){

    const [bounce, setBounce] = useSpring(()=>({scale: 1}))
    const down=()=>setBounce.start({scale: bounceLevel})
    const up=()=>setBounce.start({scale: 1})


    return <a.div
    onMouseUp={up} 
    onMouseDown={down}
    onMouseLeave={up} 
    onTouchStart={down}
    onTouchEnd={up}
    onTouchCancel={up}
    className={`rp
    ${outlined&& "outlinedBtn "}
    ${useHighlightedBtnStyles&& "highlightedBtn "}
    ${customClasses}
    noSelect`}
    style={{...styles, ...bounce}} onClick={onClick}>
        {text&& text}
        {customChild && customChild}

    {showLoading ? <div className="loader-line"></div> : null}
    </a.div>
}