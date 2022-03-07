import UpperNav from "../uiComps/UpperNav"
import BottomNav from "../uiComps/BottomNav"
import TabNavigator from "../uiComps/TabNavigator"
import RoasterComp from "../uiComps/RoasterComp"

export default function MainScreen() {


    return <div className="app f fc fh">
        <UpperNav/>
            <TabNavigator
            numberOfTabs={2}
            tabNames={["Today's Match", "My Roaster"]}
            renderTab={(i)=><RenderTabs index={i}/>}
            />
        <BottomNav/>
    </div>
}

const RenderTabs = ({index})=>{
    if(index===0)
        return <div/>
    if(index===1)
        return <MyRoaster/>
}

const MyRoaster=()=>{

    let x = [1, 2, 3 ,4, 5, 6, 7, 8, 9, 10, 11]
    return <div className="f fc fh">
        {x.map(i=><RoasterComp key={i}/>)}
        </div>
}