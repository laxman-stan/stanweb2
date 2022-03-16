

export default function TableComp({data, myRank}) {

    const tablelDetails = {
        heads: ['Rank', 'Name', 'Uprun gain'],
        widths: ['20%', '50%', '30%'],
    }
    return  <table style={{ borderCollapse: 'collapse', }} className="">
            <thead>
                <tr>
                    {tablelDetails.heads.map((i, j) =><th style={{width: tablelDetails.widths[j]}} key={j} >{i}</th>)}
                </tr></thead>
            {data.map((i, j) =><tbody key={j}><tr >
                <td style={{width: tablelDetails.widths[0] , color: myRank===j+1 ? '#41246E' : 'black', fontWeight:myRank===j+1 ? 'bold' : 'normal'}}>{j + 1}</td>
                <td style={{width: tablelDetails.widths[1] , color: myRank===j+1 ? '#41246E' : 'black', fontWeight:myRank===j+1 ? 'bold' : 'normal'}}>{i.name}</td>
                <td style={{width: tablelDetails.widths[2] , color: myRank===j+1 ? '#41246E' : 'black', fontWeight:myRank===j+1 ? 'bold' : 'normal'}}>{i.uprun_gains}</td>
                {/* {i.map((k, l) => <td style={{width: tablelDetails.widths[l]}} key={l}>{k}</td>)} */}
            </tr></tbody>)}
        </table>

}