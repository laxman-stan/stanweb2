import { useEffect, useRef } from "react";
import { contactSection, finalPgSections } from "../data/Strings"
import fb from '../icons/fb.svg'
import ig from '../icons/ig.svg'
import yt from '../icons/yt.svg'
import tw from '../icons/tw.svg'

import li from '../icons/linkedIn.svg'
import useOnScreen from "../hooks/useOnScreen";

export default function ContactComp({ setHgt, navMove }) {
    const { contactData, social } = contactSection;
    const isHtSet = useRef(false);
    const itemRef = useRef();

    useEffect(() => {
        if (!isHtSet.current) {
            isHtSet.current = true;
            setHgt(itemRef.current.offsetHeight / window.innerHeight)
        }
    }, [])



    return<> <div ref={itemRef} className="f fc contactCont">

{/* <div style={{ flexWrap: 'wrap' }} className="f contactSectionUpper">
            {finalPgSections.map((item, index) => <div key={index} className="f fc">
                <h4>{item.title}</h4>
                {item.content.map((item, index) => <div key={index}>
                    <a href={item.link}>{item.title}</a>
                </div>)}
            </div>)}
        </div> */}

        <div 
        // style={{marginTop: '2em'}}
         className="f ac contactBottomCont">

            <h2>Contact Us</h2>
            <div className="f infoCont">
                <div className="f fc">
                    <p className="socialP">Our contacts</p>
                    <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
                    <a href={`tel:${contactData.phone.replace(/ /g, "")}`}>{contactData.phone}</a>
                </div>

                <div className="f fc">
                    <p className="socialP">Social</p>
                    <div style={{ gap: '1em', flexWrap: 'wrap', minWidth: '5em' }} className="f">
                        <img style={{ transform: `scale(.95)` }} className="socialMediaImg" src={ig} onClick={() => window.open(social[0].url)} />
                        <img style={{ marginTop: 0, transform: `scale(1.15)`}} className="socialMediaImg" src={tw} onClick={() => window.open(social[1].url)} />
                        <img style={{transform: `scale(1.2)`, marginTop: 1}} className="socialMediaImg" src={yt} onClick={() => window.open(social[2].url)} />
                        <img style={{transform: `scale(1)`}} className="socialMediaImg" src={fb} onClick={() => window.open(social[3].url)} />
                    </div>
                </div>
            </div>
            </div>
    </div>
<div style={{
    width: '100%',
    height: '100px',
    background: 'white'
}}/>
    </>
}

