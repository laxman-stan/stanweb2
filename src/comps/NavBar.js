import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useContext } from "react";
import { navStrings } from "../data/Strings";
import { a, useSpring, config } from 'react-spring';

import { ShowLogo } from "../App";
const BRGR_MRGN = 40;
const BRGR_BTN_WID = 25;

const Navbar = forwardRef(({ showPopUp, scrollTo }, ref) => {

    const { middleTitles, buttonText } = navStrings;
    const linkWids = useRef(new Array(middleTitles.length));
    let initialX = useRef(0);
    const navRef = useRef();

    const logoFun = useContext(ShowLogo);
    const showLogo=logoFun.value

    // useEffect(()=>{
    //     navRef.current.style.justifyContent=showLogo? 'center' : 'flex-start'
    // }, [showLogo])

    const [d, setD] = useState(0);
    useEffect(() => {
        let { innerHeight: h, innerWidth: w } = window
        setD(Math.sqrt(h * h + w * w))
    }, [])

    const [animatedStyle, setAnimatedStyle] = useSpring(() => ({
        width: 5,
        x: 0
    }))

    const addWid = (wid, index, x) => {

        if (!index) {
            linkWids.current[index] = { wid, x: 0 }
            initialX = x
            setAnimatedStyle.start({
                width: linkWids.current[0].wid,
            })
        }
        else {
            linkWids.current[index] = { wid, x: x - initialX }
        }
    }

    const onClick = (index) => {

        setAnimatedStyle.start({
            width: linkWids.current[index].wid,
            x: linkWids.current[index].x,
        })

        scrollTo(index)

    }

    const [burgerOpened, setBurgerOpened] = useState(false);
    const burgerStyle = useSpring({

        top: burgerOpened ? BRGR_MRGN - d : BRGR_MRGN,
        right: burgerOpened ? BRGR_MRGN - d : BRGR_MRGN,
        width: burgerOpened ? 2 * d : 0,
        height: burgerOpened ? 2 * d : 0,
        opacity: burgerOpened ? 1 : 0
    })

    const burgerRef = useRef();

    const closingFun = () => {
        burgerRef.current.click();
        setBurgerOpened(false);
    }

    useImperativeHandle(ref, () => ({
        onClick
    }))

    return (
        <div ref={navRef} className="f jc fixPos jc navBar2">

            <div  className="navCont relPos menuOnBigScreen">

                {middleTitles.map((item, index) =>
                    <RenderLink onClick={() => onClick(index)} addWid={addWid} item={item} key={index} index={index} />
                )}
                <a.div style={{ ...animatedStyle, left: 0 }} className="thinLine absPos" />

            </div>

            <button onClick={showPopUp} className="creditoPrimeBtnSml topBarBtn absPos" >
                {buttonText}
            </button>

            <div className="menuOnSmallScreen">
                <a.div style={{ ...burgerStyle, zIndex: 3 }} className={`overlayMenu flex fixPos `} />

                {
                    burgerOpened && <div className="f fc fixPos ac jc navLinkCont fullPg">
                        {middleTitles.map((item, index) => <RenderLink item={item} key={index} index={index} onClick={() => {
                            onClick(index)
                            closingFun()
                        }} forMobile />)}
                    </div>
                }
                <div className="fixPos" style={{ backgroundColor: '#fff0', width: BRGR_BTN_WID, height: BRGR_BTN_WID, top: BRGR_MRGN - BRGR_BTN_WID / 2, right: BRGR_MRGN - BRGR_BTN_WID / 2, zIndex: 4 }}>
                    <BurgerMenu ref={burgerRef} clickFun={() => {
                        setBurgerOpened(!burgerOpened)
                    }} />
                </div>
            </div>
        </div>

    )
})

export default Navbar;

const RenderLink = ({ item, index, addWid, onClick, forMobile }) => {
    const itemRef = useRef();
    const animStyle = useSpring({
        from: { opacity: 0, y: -20 },
        to: { opacity: 1, y: 0 },
        delay: index * 100,
    })

    useEffect(() => {

        let { width, x } = itemRef.current.getBoundingClientRect()
        !forMobile && addWid(width, index, x);
    }, [])

    return (
        <a.a onClick={onClick} ref={itemRef} className="navLink" style={{ ...animStyle, zIndex: 3, fontSize: '1em', marginTop: '.6em' }}>{item.name}</a.a>
    )
}

const BurgerMenu = forwardRef(({ clickFun }, ref) => {
    const wid = 25;
    const offset = 5;
    const lineHeight = 3;
    const isRotated = useRef(false);

    const lineStyle = {
        position: 'absolute',
        width: wid,
        height: lineHeight,
        backgroundColor: 'white',
        borderRadius: 3,
    }
    const [line1, setLine1] = useSpring(() => ({
        to: {
            y: offset,
            transform: `rotate(0deg)`
        },
        config: config.gentle
    }))

    const [line2, setLine2] = useSpring(() => ({
        to: {
            y: wid - offset - lineHeight,
            transform: `rotate(0deg)`
        },
        config: config.wobbly
    }))

    const click = () => {

        setLine1.start({
            y: isRotated.current ? offset : (wid - lineHeight) / 2,
            transform: `rotate(${isRotated.current ? 0 : -405}deg)`
        })
        setLine2.start({
            y: isRotated.current ? wid - offset - lineHeight : (wid - lineHeight) / 2,
            transform: `rotate(${isRotated.current ? 0 : -135}deg)`
        })

        isRotated.current = !isRotated.current
        clickFun();
    }

    useImperativeHandle(ref, () => ({ click }))

    return <div style={{ width: wid, height: wid, top: -5 }} onClick={click} className="relPos">
        <a.div className='centerOrigin' style={{ ...lineStyle, ...line1 }} />
        <a.div className='centerOrigin' style={{ ...lineStyle, ...line2 }} />
    </div>
})
