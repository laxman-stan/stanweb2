
import { Player } from "../assets"
import BouncyComp from "./BouncyComp"
export default function(){

    return <div className="f ac sb fc fh">
    <img
        style={{
            width: '30%',
            marginBottom: '.5em',
            marginTop: 'auto'
        }}
     src={Player}/>
    <p style={{color: 'var(--mainHighlight50)'}}>You haven't bought andy player yet</p>
    <BouncyComp
    bounceLevel={.9}
    styles={{ marginBottom: '.5em', marginTop: 'auto', marginLeft: 0, marginRight: 0, width: 'calc(100vw - var(--baseVal6))', flex: 'none' }}
    customClasses='cta'
    text='Buy Players'
    />
    </div>
}

