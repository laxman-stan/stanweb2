import BouncyComp from "./BouncyComp";


export default function RoasterComp(){

    const data=[
        {
            key: 'Eco. rate', value: 54
        },
        {
            key: 'Most wkts', value: 5,
        },
        {
            key: 'Avg. wkts', value: 3,
        },
        {
            key: 'total wkts', value: 10,
        }
    ]


    return <div className="f fc roasterComp">
        <div style={{gap: '.5em'}} className="f sb ac">
            <img style={{width: 40, height: 40}} src={"https://source.unsplash.com/random/60×60"}/>

            <div>
                <h3 style={{fontSize: '1em'}}>Player Name</h3>
                <p style={{fontSize: '.8em'}}>Bowl</p>
            </div>

            <BouncyComp
            bounceLevel={.7}
            styles={{marginLeft: 'auto', width: '3.3em'}}
            text='Sell'
            useHighlightedBtnStyles
            />
        </div>
        <hr/>
        <div className="f sb">
            {data.map((i, j)=><h5>
                {i.key}<br/>
                <span>{i.value}</span>
            </h5>)}
        </div>
    </div>
}