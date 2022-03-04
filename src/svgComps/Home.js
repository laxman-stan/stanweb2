import * as React from "react"
import {a, useSpring} from '@react-spring/web'
import { useSvgColor } from "../hooks/useSvgColor"

const SvgComponent = ({isActive, text, clickFun}) => {

  const {sColor,stroke, fontWeight} = useSvgColor(isActive);

  return<div className="f fc ac g1 navIcon" onClick={clickFun}><svg
    width={21}
    height={22}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <a.path
      d="M7.679 15.136h5.815"
      stroke={sColor}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <a.path
      clipRule="evenodd"
      d="M1 12.713c0-5.631.614-5.238 3.919-8.303C6.365 3.246 8.615 1 10.558 1c1.942 0 4.237 2.235 5.696 3.41 3.305 3.065 3.918 2.672 3.918 8.303C20.172 21 18.213 21 10.586 21 2.959 21 1 21 1 12.713Z"
      stroke={sColor}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  <a.h6 style={{color: sColor, fontWeight: fontWeight}}>{text}</a.h6>
  </div>
}

export default SvgComponent