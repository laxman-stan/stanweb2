import BouncyComp from "./BouncyComp"
export default function HelpWidget(){

const showdot=true
    return <BouncyComp
    customChild={<div className="f ac rp jc">
     <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22.5a10.5 10.5 0 1 1 0-21 10.5 10.5 0 0 1 0 21Zm0 1.5a12 12 0 1 0 0-24 12 12 0 0 0 0 24Z"
      fill="#fff"
    />
    <path
      d="M7.882 8.679a.355.355 0 0 0 .362.37h1.237c.207 0 .372-.169.4-.374.134-.985.81-1.702 2.012-1.702 1.03 0 1.971.515 1.971 1.753 0 .952-.56 1.39-1.447 2.056-1.01.733-1.809 1.59-1.752 2.98l.005.326a.375.375 0 0 0 .374.369h1.217a.375.375 0 0 0 .375-.375v-.158c0-1.076.41-1.39 1.515-2.229.914-.694 1.866-1.465 1.866-3.084 0-2.266-1.914-3.361-4.01-3.361-1.9 0-3.982.885-4.125 3.429Zm2.336 8.644c0 .8.637 1.391 1.515 1.391.913 0 1.542-.591 1.542-1.39 0-.829-.63-1.41-1.543-1.41-.877 0-1.514.582-1.514 1.41Z"
      fill="#fff"
    />
  </svg>

  {showdot?<svg
    width={4}
    height={4}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{position: 'absolute', top: '-2px', right: '-2px'}}
  >
    <circle cx={2} cy={2} r={2} fill="red" />
  </svg>:null}
    </div>}
    />
}