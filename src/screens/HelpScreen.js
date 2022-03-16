import {a, config, Controller, useSpring} from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';


const data={
    // link: "https://youtu.be/tmhmdai14oE?t=49",
    qna: [
        {
            q: "Lorem, ipsum dolor sit amet consectetur adipisicing?",
            a: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur consequuntur quaerat id quas molestias facilis eum. Recusandae odit quia, dolorum placeat, iusto provident et doloribus fugiat quo sint numquam quam."
        },
        {
            q: "Lorem ipsum dolor sit amet?",
            a: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam aspernatur earum minus quas saepe velit modi, minima optio eligendi."
        },
        {
            q: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi eos aliquid incidunt libero?", 
            a: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab repellendus dolores nisi inventore illum delectus veritatis doloribus autem iste quae, placeat eaque vitae eius blanditiis incidunt labore, tempore mollitia fugit cumque quasi, architecto natus"
        }
    ]
}

export default function Help(){

    const [dimension, set] = useState(null);
    useEffect(()=>{
        set(window.innerWidth - 24);
    }, [])

    return <div style={{overflowY: 'scroll'}} className="f fh fc qnaCont fw">
    {dimension? <iframe width={dimension} style={{marginLeft: 12, borderRadius: 8, boxShadow: '0px 0px 10px var(--grey2)'}} src="https://www.youtube.com/embed/tmhmdai14oE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> : null}
           {
               [...data.qna, ...data.qna, ...data.qna, ...data.qna].map((i, j)=><Accordion key={j} q={i.q} a={i.a}/>)
           }
    </div>
}

const Accordion=({q, a})=>{

    const [isOpen , set] = useState(false);
    const ans = useRef();
    const cont = useRef();
    const height = useRef(0);

    useEffect(()=>{
        height.current = ans.current.offsetHeight;
        cont.current.style.overflow= 'hidden'
        // ans.current.style.display = 'none';
        // ans.current.style.opacity = 0;
    }, [])

    const clickFun=()=>{
        set(!isOpen)
        cont.current.style.height = isOpen ? 0 : height.current + 'px';
        ans.current.style.opacity = isOpen ? 0 : 1;
    }

    return <div onClick={clickFun} className="whiteCard rosterCard fc f rp">
        <AnimIcon isOpen={isOpen} />
        <h4 className='q'>{q}</h4>
        <div ref={cont} className='rosterCard' style={{overflow: 'visible', height: 0}}>
        <p ref={ans} style={{opacity: 0, paddingTop: 'var(--baseVal)'}} className='a rosterCard'>{a}</p>
        </div>
    </div>
}

const AnimIcon=({isOpen})=>{
    const con = {...config.wobbly, clamp: false}

    const numberOfRoatations = useRef(0);
    const [div1, set1] = useSpring(()=>({
        rotate: 270, con
        // config: con
    }))

    const [div2, set2] = useSpring(()=>({
        rotate: 180, con
    }))

    useEffect(()=>{
        numberOfRoatations.current++
        set1.start({
            rotate: numberOfRoatations.current*270
        })
        set2.start({
            rotate: numberOfRoatations.current*180
        })
    }, [isOpen])

    return <div className='ap qnaBarCont'>
        <a.div className={"qnaBar ap"} style={div1}/>
        <a.div className={"qnaBar ap"} style={div2}/>
    </div>
}

/**
 * 
 */
