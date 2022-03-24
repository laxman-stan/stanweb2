import {a, config, Controller, useSpring} from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';

const howToPlayDi = "<p>Once you login and reach the homescreen, you find three main sections on the bottom – Play, Trade, Leaderboard. Along with this, there are two supporting tabs on the top - UPruns Wallet and Help (?)</p><h4 class='h4s'>Play</h4><ul class='pb5'><li>The Play Section allows you to track IPL matches, create your daily teams and review their performance everyday.</li><li>‘Today’s Match’ shows you the matches being played today and your selected team for today’s match. Before you can ‘Create Your Team’, you first need to ‘Create your Portfolio’.</li><li>To start, tap on ‘Create Player Portfolio’ and buy your favourite players. ‘Player Portfolio’ shows you a list of all the players you’ve bought and retained till date.</li><li>Once you buy and add a minimum of 5 players to your portfolio, you can start Creating Your Team.</li><li>You can add a maximum of 5 players everyday from your Portfolio to your Team. Once the matches commence, the selected 5 get locked as your team for the day and start earning you UPruns.</li></ul><h4 class='h4s'>Trade</h4><ul class='pb5'><li>‘Trade’ section allows you to buy new players and add them to your portfolio or sell the ones that are already a part of your Portfolio – These trades help you earn more UPruns.</li><li>You can only Trade (Buy/Sell) players who are not locked in the day’s playing team. Once the day’s matches end, these players get unlocked again for trading.</li></ul>  <h4 class='h4s'>LEADERBOARD</h4><ul class='pb5'><li>This section shows you where you are in the UPruns tally compared to other users. Motivation can be helpful, right?</li></ul><h4 class='h4s'>UPruns WALLET</h4><ul class='pb5'><li>Click on the UPruns icon on the top to view your Starting UPruns, Earned UPruns and transaction history of buying/selling players on the Upstox Cric Exchange.</li></ul><p style='margin-top: var(--baseVal)'>Easy enough, right? So, go on and start playing!</p>"
const howToEarnUp = "<p class='h4s'>here are two modes to earn UPruns:<ul class='pb5'><li>Performance of the players is key. You earn UPruns based on how the players you have selected and locked for a particular match performs on that particular day.</li><li>Like an actual stock exchange, the prices of the players constantly change in this game based on the player’s performance in real life. You can analyse the prices and performance to decide when to Buy/Sell players.</li></ul></p>"
const twoMatchSameDay="<P class='h4s'>You can pick a team of five players in any combination from the 4 playing teams of the day. For instance, in a scenario where A vs B and C vs D are the two matches planned for today, you could -<ul class='pb5'><li>You could pick all 5 players from A or B or C or D (only one team</li><li>You could pick 2 players from team A and 3 players from team B OR pick 1 player from Team A and 4 players from Team B (picking players from one match only)</li><li>You could pick a mix including players across all of these teams, like 2 players from A and 1 player each from B,C and D or 1 player from A, 2 players each from B and C etc</li></ul>Any combination works - but, your selected five for today’s ‘My Team’ can only be from the playing teams on that respective day.<b>\n\nNote - Once you pick 5 players from your portfolio to compete in Today’s Match, you cannot Buy/Sell them till the day’s matches end.</b></p>"

const data={
    // link: "https://youtu.be/tmhmdai14oE?t=49",
    qna: [
        {
            q: "What is Upstox Cric Exchange?",
            a: "Upstox Cric Exchange is Upstox’s special offering for the IPL season. Through this game, Upstox aims to help you understand and learn the fundamentals of trading. This platform is a unique blend of cricket and trading, where you can select, buy, and sell cricket players according to your liking. Based on the players’ real-time performance and your activity, you can gain UPruns and level up to earn exciting rewards."
        },
        {
            q: "How to login?",
            a: "If you are already an Upstox user, you can use the same user login. If you are new to Upstox, sign up using your mobile number and enter the OTP."
        },
        {
            q: "How to play?", 
            di: {__html: howToPlayDi}
        },
        {
            q: " What are UPruns?",
            a: "UPruns is the virtual currency in this game used as mode of payments. Whether you want to buy a player, or redeem your rewards, UPruns is all you need. You will be given 1000 UPruns at the start of the game."
        },
        {
            q: "Is there real money involved?",
            a: " No. The only currency you need to play this game is the virtual currency, UPruns. However, the rewards are very real."
        },
        {
            q: "How to earn UPruns?",
            di: {__html: howToEarnUp}
        },
        {
            q: " What is ‘Player portfolio’ and how to create ‘Player portfolio’?",
            a: "When you buy any player, that player becomes a part of the list in your portfolio. ‘Player portfolio’ is a list of all the playable players you have bought till that point in the game at one location. This doesn’t include the ones you have sold. It’s like a portfolio in your trading platform that displays the stocks you own at that point of time. You will also be able to see the players’ current status and current UPruns valuation."
        },
        {
            q: "What is ‘My team’ and how to create ‘My team’?",
            a: "Every day, before every match, you can select upto five players from your portfolio and lock them in for that game. These 5 players make your team for that day.",
            b: "\n\nNote - You can create a team only after you have a minimum of 5 players in your portfolio."
        },
        {
            q: "Do I have to pick players from the same team?",
            a: "Not necessarily. You can choose any players from any teams playing on a respective match day. But, regardless of the day being a single/double header day, your Team of the day is limited to 5 selected players only. So, choose wisely!"
        },
        {
            q: "What if there are two sets of matches happening on the same day?",
            di: {__html: twoMatchSameDay},
            // a: "You can pick a team of five players in any combination from the 4 playing teams of the day. For instance, in a scenario where A vs B and C vs D are the two matches planned for today, you could -\n● You could pick all 5 players from A or B or C or D (only one team)\n● You could pick 2 players from team A and 3 players from team B OR pick 1 player from Team A and 4 players from Team B (picking players from one match only)\n● You could pick a mix including players across all of these teams, like 2 players from A and 1 player each from B,C and D or 1 player from A, 2 players each from B and C etc\n\nAny combination works - but, your selected five for today’s ‘My Team’ can only be from the playing teams on that respective day.",
            b: "\n\nNote - Once you pick 5 players from your portfolio to compete in Today’s Match, you cannot Buy/Sell them till the day’s matches end."
        },
        {
            q: "What is the difference between ‘Player Portfolio’ and ‘My team’?",
            a: " ‘Player portfolio’ is the complete pool of players you have bought. These are like your stocks, which stay with you until you Sell them off.\n‘My team’ includes the 5 players you select to compete in the matches for any respective day. My team can change everyday.",
            b: "\n\nNote -  You can create a team only after you have a minimum of 5 players in your portfolio."
        },
        {
            q: "How to buy and sell players? (How to place a trade)?",
            a: "First, tap on the ‘Trade’ section. You will come across two tabs on the top – ‘Buy’ and ‘Sell’. When you click on the ‘Buy’ option, you will come across a list of all the players playing real time in the IPL with their current in-game stats and the UPruns (players’ price) needed to buy/sell them. This fluctuates based on the players’ performance. Keep tabs on your favorite players to buy/sell them at the right time - Because, Timing is key!\nSame way, you can click on the ‘Sell’ option to sell a player who is already a part of your portfolio. Once you sell a player, they get removed from your portfolio and you might have to Buy them again if needed."
        },
        {
            q: "Where can I check my current UPruns rank?",
            a: "You can check your UPruns Tally in comparison to other users on Upstox Cric Exchange by going to the ‘Leaderboard’ section."
        },
        {
            q: "Where can I check my UPruns balance and trade(buy/sell) history?",
            a: 'At any instance of the game, you can click on the UPruns icon on the top to view your current UPruns and your transaction history of buying/selling players on the Upstox Cric Exchange.'
        }
    ]
}

export default function Help(){

    // const [dimension, set] = useState(null);
    // useEffect(()=>{
    //     set(document.querySelector('.app').offsetWidth - 24);
    // }, [])

    return <div style={{overflowY: 'scroll'}} className="f fh fc qnaCont fw">
    {/* {dimension? <iframe width={dimension} style={{marginLeft: 12, borderRadius: 8, boxShadow: '0px 0px 10px var(--grey2)'}} src="https://www.youtube.com/embed/tmhmdai14oE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> : null} */}
           {
               data.qna.map((i, j)=><Accordion di={i.di} key={j} q={i.q} a={i.a} b={i.b}/>)
           }
    </div>
}

const Accordion=({q, a, b, di})=>{

    const [isOpen , set] = useState(false);
    const ans = useRef();
    const cont = useRef();
    const height = useRef(0);

    useEffect(()=>{
        height.current = ans.current.offsetHeight;
        cont.current.style.overflow= 'hidden'
        // ans.current.style.display = 'none';
        // ans.current.style.opacity = 0;
    }, [])

    const clickFun=()=>{
        set(!isOpen)
        cont.current.style.height = isOpen ? 0 : height.current + 'px';
        ans.current.style.opacity = isOpen ? 0 : 1;
    }

    return <div onClick={clickFun} className="whiteCard rosterCard fc f rp">
        <AnimIcon isOpen={isOpen} />
        <h4 className='q'>{q}</h4>
        <div ref={cont} className='rosterCard' style={{overflow: 'visible', height: 0}}>
        {di? <p ref={ans} style={{opacity: 0, paddingTop: 'var(--baseVal)', whiteSpace: 'pre-line'}} className='a rosterCard di' dangerouslySetInnerHTML={di}/>
        : <p ref={ans} style={{opacity: 0, paddingTop: 'var(--baseVal)', whiteSpace: 'pre-line'}} className='a rosterCard'>{a}<span style={{fontWeight: "bold"}}>{b}</span></p>}
        </div>
    </div>
}

const AnimIcon=({isOpen})=>{
    const con = {...config.wobbly, clamp: false}

    const numberOfRoatations = useRef(0);
    const [div1, set1] = useSpring(()=>({
        rotate: 270, con
        // config: con
    }))

    const [div2, set2] = useSpring(()=>({
        rotate: 180, con
    }))

    useEffect(()=>{
        numberOfRoatations.current++
        set1.start({
            rotate: numberOfRoatations.current*270
        })
        set2.start({
            rotate: numberOfRoatations.current*180
        })
    }, [isOpen])

    return <div className='ap qnaBarCont'>
        <a.div className={"qnaBar ap"} style={div1}/>
        <a.div className={"qnaBar ap"} style={div2}/>
    </div>
}

/**
 * 
 */
