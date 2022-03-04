import * as React from "react"
import {a} from '@react-spring/web'
import { useSvgColor } from "../hooks/useSvgColor"

const SvgComponent = ({isActive, text, clickFun}) =>{ 
  
  const {sColor} = useSvgColor(isActive)
  
  return(
    <div className="f g1 fc ac navIcon" onClick={clickFun}> <svg
    width={20}
    height={22}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <a.rect
      x={8}
      y={1}
      width={4}
      height={20}
      rx={2}
      stroke={sColor}
      strokeWidth={1.5}
    />
    <a.rect
      x={15}
      y={6}
      width={4}
      height={15}
      rx={2}
      stroke={sColor}

      strokeWidth={1.5}
    />
    <a.rect
      x={1}
      y={11}
      width={4}
      height={10}
      rx={2}
      stroke={sColor}

      strokeWidth={1.5}
    />
  </svg>
  <a.h6 style={{color: sColor}}>{text}</a.h6>
  </div>
)}

export default SvgComponent
