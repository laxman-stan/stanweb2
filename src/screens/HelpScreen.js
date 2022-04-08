import {a, config, Controller, useSpring} from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
// import QR from '../assets/linkQR'

const howToPlayDi = "<p>Once you login and reach the homescreen, you find three main sections on the bottom – Play, Trade, Leaderboard. Along with this, there are two supporting tabs on the top - UPruns Wallet and Help (?)</p><h4 class='h4s'>Play</h4><ul class='pb5'><li>The Play Section allows you to track IPL matches, create your daily teams and review their performance everyday.</li><li>‘Today’s Match’ shows you the matches being played today and your selected team for today’s match. Before you can ‘Create Your Team’, you first need to ‘Create your Portfolio’.</li><li>To start, tap on ‘Create Player Portfolio’ and buy your favourite players. ‘Player Portfolio’ shows you a list of all the players you’ve bought and retained till date.</li><li>Once you buy and add a minimum of 5 players to your portfolio, you can start Creating Your Team.</li><li>You can add a maximum of 5 players everyday from your Portfolio to your Team. Once the matches commence, the selected 5 get locked as your team for the day and start earning you UPruns.</li></ul><h4 class='h4s'>Trade</h4><ul class='pb5'><li>‘Trade’ section allows you to buy new players and add them to your portfolio or sell the ones that are already a part of your Portfolio – These trades help you earn more UPruns.</li><li>You can only Trade (Buy/Sell) players who are not locked in the day’s playing team. Once the day’s matches end, these players get unlocked again for trading.</li></ul>  <h4 class='h4s'>LEADERBOARD</h4><ul class='pb5'><li>This section shows you where you are in the UPruns tally compared to other users. Motivation can be helpful, right?</li></ul><h4 class='h4s'>UPruns WALLET</h4><ul class='pb5'><li>Click on the UPruns icon on the top to view your Starting UPruns, Earned UPruns and transaction history of buying/selling players on the Upstox Cric Exchange.</li></ul><p style='margin-top: var(--baseVal)'>Easy enough, right? So, go on and start playing!</p>"
const howToEarnUp = "<p class='h4s'>here are two modes to earn UPruns:<ul class='pb5'><li>Performance of the players is key. You earn UPruns based on how the players you have selected and locked for a particular match performs on that particular day.</li><li>Like an actual stock exchange, the prices of the players constantly change in this game based on the player’s performance in real life. You can analyse the prices and performance to decide when to Buy/Sell players.</li></ul></p>"
const twoMatchSameDay="<P class='h4s'>You can pick a team of five players in any combination from the 4 playing teams of the day. For instance, in a scenario where A vs B and C vs D are the two matches planned for today, you could -<ul class='pb5'><li>You could pick all 5 players from A or B or C or D (only one team</li><li>You could pick 2 players from team A and 3 players from team B OR pick 1 player from Team A and 4 players from Team B (picking players from one match only)</li><li>You could pick a mix including players across all of these teams, like 2 players from A and 1 player each from B,C and D or 1 player from A, 2 players each from B and C etc</li></ul>Any combination works - but, your selected five for today’s ‘My Team’ can only be from the playing teams on that respective day.<b>\n\nNote - Once you pick 5 players from your portfolio to compete in Today’s Match, you cannot Buy/Sell them till the day’s matches end.</b></p>"
const uprunCalculation="<ul class='pb5'><li><b>Computing UPruns earned from matches: </b>Your Team selection (5 players) gets locked for play and then the day's matches commence. Upon the completion of matches, the difference of each players' Ending Cric Index - Starting Cric Index is taken. The average of these differences is computed and multiplied by a constant of 50. This determines the total UPruns earned by the team on a match day.</li><li><b>Calculating UPruns required for Buying/Selling Players: </b>Players' current Cric index ratings are multiplied by a constant of 10. *For players getting a Cric Index rating between 0 - 2, the required UPruns for Buy/Sell would be restricted at 20 as minimum.</li><li><b>Earned UPruns: </b>Only UPruns earned by your teams’ playing matches are considered as earned UPruns. These earned UPruns are shown separately in your wallet and are valid for reward claims.</li><li>If your team on any day, after computation of earned UPruns (as per point A above) shows a negative UPruns total due to overall average cric index of  players falling, then your earned UPruns in the match appears as 0 instead of negative scoring.</li><ul>"
// const guide = "<p >Open the link <a href='https://cricexchange.upstox.com/' class='vLink'>https://cricexchange.upstox.com/</a> on your mobile or scan the QR code below on your mobile to get started with Upstox Cric Exchange.</p><?xml version='1.0' encoding='utf-8' standalone='yes'?> <svg style='margin-top: var(--baseVal)' width='50%' viewBox='-1 -1 27 27' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges' id='qr code'><rect id='qr background' fill-opacity='1' fill='rgb(255, 255, 255)' x='-1' y='-1' width='27' height='27'></rect><path fill-opacity='1' fill='rgb(0, 0, 0)' id='qr dark pixels' fill-rule='evenodd' d='M 8 0 L 9 0 L 9 1 L 8 1 z M 11 0 L 12 0 L 12 1 L 13 1 L 13 0 L 14 0 L 14 3 L 16 3 L 16 4 L 17 4 L 17 7 L 16 7 L 16 5 L 15 5 L 15 7 L 14 7 L 14 4 L 13 4 L 13 5 L 12 5 L 12 3 L 13 3 L 13 2 L 12 2 L 12 3 L 11 3 L 11 2 L 9 2 L 9 1 L 11 1 z M 16 0 L 17 0 L 17 3 L 16 3 z M 8 2 L 9 2 L 9 4 L 10 4 L 10 5 L 8 5 z M 10 3 L 11 3 L 11 4 L 10 4 z M 8 6 L 9 6 L 9 7 L 8 7 z M 10 6 L 11 6 L 11 8 L 12 8 L 12 9 L 13 9 L 13 10 L 12 10 L 12 11 L 9 11 L 9 12 L 8 12 L 8 15 L 10 15 L 10 14 L 11 14 L 11 15 L 12 15 L 12 16 L 11 16 L 11 17 L 9 17 L 9 16 L 7 16 L 7 15 L 6 15 L 6 14 L 7 14 L 7 13 L 6 13 L 6 12 L 7 12 L 7 11 L 6 11 L 6 10 L 8 10 L 8 8 L 10 8 zM 9 9 L 11 9 L 11 10 L 9 10 z M 12 6 L 13 6 L 13 8 L 12 8 z M 0 8 L 4 8 L 4 10 L 5 10 L 5 11 L 6 11 L 6 12 L 5 12 L 5 13 L 4 13 L 4 14 L 5 14 L 5 16 L 7 16 L 7 17 L 4 17 L 4 15 L 3 15 L 3 16 L 2 16 L 2 15 L 1 15 L 1 14 L 2 14 L 2 13 L 3 13 L 3 12 L 4 12 L 4 11 L 3 11 L 3 10 L 2 10 L 2 11 L 1 11 L 1 13 L 0 13 L 0 10 L 1 10 L 1 9 L 0 9 z M 6 8 L 7 8 L 7 9 L 6 9 z M 14 8 L 18 8 L 18 11 L 17 11 L 17 12 L 16 12 L 16 13 L 17 13 L 17 12 L 18 12 L 18 11 L 19 11 L 19 9 L 20 9 L 20 12 L 19 12 L 19 13 L 20 13 L 20 12 L 21 12 L 21 16 L 17 16 L 17 15 L 18 15 L 18 14 L 17 14 L 17 15 L 16 15 L 16 14 L 15 14 L 15 15 L 14 15 L 14 14 L 13 14 L 13 15 L 12 15 L 12 13 L 13 13 L 13 11 L 16 11 L 16 9 L 14 9 zM 14 12 L 15 12 L 15 13 L 14 13 z M 19 14 L 20 14 L 20 15 L 19 15 z M 20 8 L 23 8 L 23 9 L 20 9 z M 24 8 L 25 8 L 25 9 L 24 9 z M 23 9 L 24 9 L 24 10 L 23 10 z M 2 11 L 3 11 L 3 12 L 2 12 z M 21 11 L 23 11 L 23 12 L 25 12 L 25 14 L 24 14 L 24 13 L 22 13 L 22 12 L 21 12 z M 9 12 L 10 12 L 10 13 L 9 13 z M 11 12 L 12 12 L 12 13 L 11 13 z M 22 14 L 24 14 L 24 15 L 22 15 z M 0 15 L 1 15 L 1 16 L 0 16 z M 15 15 L 16 15 L 16 18 L 15 18 L 15 19 L 14 19 L 14 18 L 13 18 L 13 21 L 12 21 L 12 20 L 10 20 L 10 19 L 12 19 L 12 18 L 11 18 L 11 17 L 13 17 L 13 16 L 14 16 L 14 17 L 15 17 z M 24 15 L 25 15 L 25 19 L 24 19 L 24 20 L 23 20 L 23 19 L 22 19 L 22 17 L 21 17 L 21 16 L 24 16 zM 23 17 L 24 17 L 24 18 L 23 18 z M 8 17 L 9 17 L 9 18 L 8 18 z M 15 19 L 16 19 L 16 20 L 15 20 z M 14 20 L 15 20 L 15 22 L 16 22 L 16 23 L 14 23 z M 21 20 L 22 20 L 22 21 L 23 21 L 23 22 L 24 22 L 24 23 L 23 23 L 23 24 L 25 24 L 25 25 L 19 25 L 19 24 L 20 24 L 20 21 L 21 21 zM 21 22 L 22 22 L 22 24 L 21 24 z M 8 21 L 10 21 L 10 23 L 11 23 L 11 21 L 12 21 L 12 22 L 13 22 L 13 23 L 12 23 L 12 24 L 11 24 L 11 25 L 8 25 z M 17 21 L 19 21 L 19 23 L 17 23 z M 13 23 L 14 23 L 14 24 L 15 24 L 15 25 L 13 25 z M 17 24 L 18 24 L 18 25 L 17 25 z'></path><path id='qr squares' d='M0,0h7h0v0v7v0h0h-7h0v0v-7v0h0zM1,1h5h0v0v5v0h0h-5h0v0v-5v0h0zM2,2h3h0v0v3v0h0h-3h0v0v-3v0h0z M18,0h7h0v0v7v0h0h-7h0v0v-7v0h0zM19,1h5h0v0v5v0h0h-5h0v0v-5v0h0zM20,2h3h0v0v3v0h0h-3h0v0v-3v0h0z M0,18h7h0v0v7v0h0h-7h0v0v-7v0h0zM1,19h5h0v0v5v0h0h-5h0v0v-5v0h0zM2,20h3h0v0v3v0h0h-3h0v0v-3v0h0zM16,16h5h0v0v5v0h0h-5h0v0v-5v0h0zM17,17h3h0v0v3v0h0h-3h0v0v-3v0h0zM18,18h1h0v0v1v0h0h-1h0v0v-1v0h0z' fill-rule='evenodd' fill-opacity='1' fill='rgb(0, 0, 0)'></path></svg>"

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
        },
        {
            q: "What is CricIndex?",
            a: "CricIndex is a real-time measurement index established by Upstox (RKSV Securities Pvt. Ltd.) specially for the Upstox Cric Exchange game."
        },
        {
            q: "How is the Upstox CricIndex calculated?",
            a: "The cricindex constantly evaluates cricketers’ real-time performance during the IPL matches and on the basis of their performance, rates their score out of 10. Based on these scores, the index governs the ‘Ups’ and ‘Downs’ in the players’ prices, similar to the workings of the stock market."
        },
        {
            q: "How is a player’s price calculated?",
            a: "The cricindex is used to rate a player's performance, based on which the price is measured. The prices keep fluctuating."
        },
        {
            q: "How can I collect maximum UPruns?",
            a: "To get the best out of this game, it is important to keep tabs on the players’ performance in the real-time IPL matches. When your selected player performs well in a match, the player’s rating increases.  So, place your bets accordingly by buying and selecting the players that you find will perform and gain the best ranks. Their rank will convert into higher prices, earning you maximum UPruns. Make sure to buy and keep only the best performers in your portfolio. Another way to earn more UPruns is by selling players’ when you don’t want them to play for you and when their prices are high.  Remember, you can only select 5 players before every match and these players should be a part of your portfolio. Also, once locked, you cannot change, buy, or sell, the selected 5 from your portfolio."
        },
        {
            q: "Can I purchase a player while they are playing an ongoing match?",
            a: "Yes. Since the player you want to purchase is not already a part of your portfolio, you can buy such players at any time. However, you cannot select this new player during the on-going match. You can make the selection for the next match."
        },
        {
            q: "How can I reach milestones/levels?",
            a: "Like in every other game, better results can up your level. As you get better at selecting players, and the better your selected players perform, the more you level up. With every new level, you earn new rewards."
        },
        {
            q: "How can I claim rewards?",
            a: "Every time you level up, a new reward gets unlocked. If you want to claim a reward, you need the required earned UPruns. You can claim a reward in exchange for earned UPruns. You can head to the ‘My Wallet’ section. Below, you will be able to see the available rewards. You can select the particular reward and click on the ‘Claim’ button. Once the reward is claimed, you will receive a communication within the next 7 working days with the process to claim the reward."
        },
        {
            q: "How does Leaderboard work?",
            a: "Leaderboard shows you your UpRuns tally in comparison to other players on Upstox Cric Exchange."
        },
        {
            q: "How are UPruns calculated?",
            di: {__html: uprunCalculation}
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
