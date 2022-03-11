

export default function TableComp() {

    const tablelDetails = {
        heads: ['Rank', 'Name', 'Upruns'],
        widths: ['20%', '50%', '30%'],
    }

    const tableData = [
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['3', 'Player Name', '50'],
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['3', 'Player Name', '50'],
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['3', 'Player Name', '50'],
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['3', 'Player Name', '50'],
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['3', 'Player Name', '50'],
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['3', 'Player Name', '50'],
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['3', 'Player Name', '50'],
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['3', 'Player Name', '50'],
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['3', 'Player Name', '50'],
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['3', 'Player Name', '50'],
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['3', 'Player Name', '50'],
        ['1', 'Player Name', '50'],
        ['2', 'Player Name', '50'],
        ['13', 'Player Name', '50'],
    ]

    return  <table style={{ borderCollapse: 'collapse' }} className="">
            <thead>
                <tr>
                    {tablelDetails.heads.map((i, j) =><th style={{width: tablelDetails.widths[j]}} key={j} >{i}</th>)}
                </tr></thead>
            {tableData.map((i, j) =><tbody key={j}><tr >
                {i.map((k, l) => <td style={{width: tablelDetails.widths[l]}} key={l}>{k}</td>)}
            </tr></tbody>)}
        </table>

}