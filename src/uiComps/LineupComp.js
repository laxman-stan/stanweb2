import { CloseBtn, Bar } from "."

export default function Lineup(props) {
    const {teamA, teamB} = props

    return <div onClick={e=>e.stopPropagation()} style={{ padding: 'var(--baseVal3) 0 0 0', marginTop: 'auto', marginBottom:'auto' }} className="whiteCard rp f fc">
        <h3 style={styles.h3}>Team Linuup</h3>
        <Bar
            height={1}
            otherStyles={{
                marginTop: '.8em', opacity: .2
            }}
        />


        {/* top tiles */}

        <div className="f sb">
            <div style={{...styles.column, paddingTop: 0, paddingBottom: 0}} className="f fc">
                <h4 style={styles.topHead}>{teamA.name}</h4>
            </div>

            <Bar
                width={1}
                height="100%"
                otherStyles={{
                    opacity: .2
                }}
            />

            <div style={{...styles.column, paddingTop: 0, paddingBottom: 0}} className="f fc">
                <h4 style={styles.topHead}>{teamB.name}</h4>
            </div>
        </div>


        <Bar
            height={1}
            otherStyles={{
                opacity: .2
            }}
        />

        <div className="f sb">


            <div style={styles.column} className="f fc">
                {teamA.players.map((item, index) => <p style={{
                    width: '100%', textOverflow: 'ellipsis', overflow: "hidden"
                }} key={index}>{item}</p>)}
            </div>

            <Bar
                width={1}
                height="100%"
                otherStyles={{
                    opacity: .2
                }}
            />

            <div style={{ ...styles.column }} className="f fc">
                {teamB.players.map((item, index) => <p
               style={{
                    width: '100%', textOverflow: 'ellipsis', overflow: "hidden"
                }}
                 key={index}>{item}</p>)}
            </div>

        </div>


        <CloseBtn
        onClick={props.close}
        styles={{right: 'var(--baseVal3)'}}
        />
    </div>
}

const styles = {

    h3: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    topHead: {
        margin: 'var(--baseVal3) 0'
    },
    column: {
        width: 'calc( 50% - .5px )',
        paddingLeft: 'var(--baseVal4)',
        gap: 'var(--baseVal)',
        padding: 'var(--baseVal4) var(--baseVal6)'
    }
}