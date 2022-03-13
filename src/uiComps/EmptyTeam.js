
import { Player } from "../assets"
import BouncyComp from "./BouncyComp"
import { useNavigate } from "react-router-dom";

export default function({len}){
    const navigate = useNavigate();
    return <div style={{alignSelf: 'center', bottom: 0}} className={`f ac sb fc ${len? 'ap' : 'fh'}`}>
    {
        len? 
        <p style={{color: 'var(--mainHighlight50)', marginTop: 'auto', marginBottom: 'var(--baseVal3)'}}>You need 5 player to create a team.</p>
        : <>
        <img
        style={{
            width: '30%',
            marginBottom: '.5em',
            marginTop: 'auto'
        }}
     src={Player}/>
    <p style={{color: 'var(--mainHighlight50)'}}>You haven't bought andy player yet</p></>
    }
    
    <BouncyComp
    onClick={()=>navigate('/main/trade')}
    bounceLevel={.9}
    styles={{ marginBottom: '.5em', marginTop: 'auto', marginLeft: 0, marginRight: 0, width: 'calc(100vw - var(--baseVal6))', flex: 'none' }}
    customClasses='cta'
    text='Buy Players'
    />
    </div>
}

