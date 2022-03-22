
import { Player } from "../assets"
import BouncyComp from "./BouncyComp"
import { useNavigate } from "react-router-dom";

export default function EmptyTeam({len, createTeam, hideBtn=false}){
    
    const navigate = useNavigate();
    return <div style={{
        alignSelf: 'center', bottom: 0,
        background: 'var(--mainBg)',
        marginTop: len? 'auto' : 0
        }} className={`f ac sb fc ${len? 'null' : 'fh'}`}>

{/* <div
    style={{
        backgroundColor: 'black', height: '8em', bottom: '-24px'
    }}
    className="ap fw"
    /> */}
    {
        len? 
        <p style={{color: 'var(--mainHighlight50)', marginTop: 'auto', marginBottom: 'var(--baseVal3)'}}>{len>4 && createTeam ? "You haven't created your team for today." : "You need 5 players to create a team."}</p>
        : <>
        <img
        alt='no player'
        style={{
            width: '30%',
            marginBottom: '.5em',
            marginTop: 'auto',
        }}
     src={Player}/>
    <p style={{color: 'var(--mainHighlight50)', marginBottom: hideBtn? 'auto' : 0}}>You haven't bought any players yet.</p></>
    }
    
{ hideBtn ? null :  <BouncyComp
    onClick={()=>navigate(len>4 && createTeam ? '/main/create-team' : '/main/trade', {state: 'toBuy'})}
    bounceLevel={.9}
    styles={{ marginBottom: '.5em', marginTop: 'auto', marginLeft: 0, marginRight: 0, width: 'calc( (100 * var(--vw) ) - var(--baseVal6))', flex: 'none' }}
    customClasses='cta'
    text={len>4 && createTeam? 'Create Team' : 'Buy Players'}
    />}

    </div>
}

