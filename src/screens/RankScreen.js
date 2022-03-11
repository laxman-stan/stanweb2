import TabNavigator from "../uiComps/TabNavigator"
import TableComp from "../uiComps/TableComp"

export default function RankScreen(){


    return <TabNavigator
        numberOfTabs={3}
        tabNames={["Daily", "Weekly", "Overall"]}
        renderTab={i=><RenderTabs index={i}/>}
        />

}

const RenderTabs=({index})=>{
if(index===0)
    return <Daily/>
if(index===1)
    return <div/> //<Weekly/>
if(index===2)
    return <div/> // <Overall/>
}

const Daily=()=>{


    return <div className="rankCont fc hm hp f">
        <TableComp/>
    </div>
}