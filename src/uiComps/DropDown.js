import { useEffect, useState, useRef } from "react"
const WID=180
export default function Dropdown({
    maxWid,
    items=['a'],
    activeIndex=0,
    setIndex
}){

    const [isOpen, setIsOpen] = useState(false);
    const itemRef = useRef();

    const styles={
        topCont:{
            width: maxWid ?? WID,
            border: '2px solid',
            padding: 'var(--baseVal) var(--baseVal3)',
            paddingLeft: 'var(--baseVal3)',
            borderColor:isOpen ? 'var(--mainHighlight)' : 'var(--mainHighlight30)',
            borderRadius: 8,
            fontWeight: 'bold',
            background: 'white',
            height: 40,
            transition: 'all .2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        itemCont: {
            width: maxWid ?? WID,
            hieght: 20,
            background: 'white',
            zIndex: 100,
            top: 44,
            boxShadow: '4px 4px 8px #0003',
            borderRadius: 8,
            paddingTop: 4,
            paddingBottom: 5,
            overflow: 'hidden',
            opacity: isOpen? 1 : 0,
            height: isOpen ? items.length *30  + 9 : 0,
            transition:' all .4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        item:{
            width: '100%',
            paddingLeft: 'var(--baseVal3)',
            height: 30,
            flex: 'none',
            opacity: isOpen? 1 : 0,
            transition: 'opacity .8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }
    
    }

    const clickfun=i=>{
        setIndex(i);
        setIsOpen(false);
    }

    const dn=i=>{
        document.querySelectorAll('.ddList')[i].style.background='var(--mainHighlight20)'
    }
    const up=i=>{
        document.querySelectorAll('.ddList')[i].style.background='transparent'
    }

    const handleClick=(e)=>{
        if (itemRef.current && !itemRef.current.contains(e.target)) {
            setIsOpen(false);
          }
    }

    useEffect(()=>{
        if(isOpen)
        document.addEventListener('click', handleClick);
        return () => {
          document.removeEventListener('click', handleClick);
        };
    }, [isOpen])

    const dot={
        width: 'var(--baseVal2)',
        height: 'var(--baseVal2)',
        background: 'var(--secondaryHighlight)',
        borderRadius: 40,
        transform: 'translateY(.5px)',
        marginRight: 'auto',
        marginLeft: 12,
    }

    return <div ref={itemRef} style={{ width: maxWid ?? WID, marginLeft: 'auto', marginRight: 12 }} className="f rp fc">
        <div style={styles.topCont}
        onClick={()=>setIsOpen(!isOpen)}
         className="f sb ac">
            {items[activeIndex].name}
            {items[activeIndex].isPlayingToday ? <div style={dot}/> : null}
            <Arrow isOpen={isOpen}/>

        </div>

        <div style={styles.itemCont} className="f ap ac fc">
            {items.map((item, i)=>{
                return <div
                key={i}
                onClick={()=>clickfun(i)}
                onMouseUp={()=>up(i)} 
                onMouseDown={()=>dn(i)}
                onMouseLeave={()=>up(i)} 
                onTouchStart={()=>dn(i)}
                onTouchEnd={()=>up(i)}
                onTouchCancel={()=>up(i)}
                style={styles.item} className="f ddList ac">
                {item.name} 
                <span style={{
                    width: 130,
                    fontSize: '.83em',
                    color: 'var(--mainHighlight30)',
                }}>{item.isPlayingToday? '\u00A0\u00A0(playing today)': ''}</span>
            </div>
            })}
        </div>


        </div>
}


const Arrow=({isOpen})=>{
    return <svg
    width={12}

    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 9 6"
    style={{
        transform: 'rotate('+ (isOpen? 0 : 180) +'deg)',
        transition:' all .4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }}
  >
    <path
      d="m1 5 3.5-4L8 5"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
}