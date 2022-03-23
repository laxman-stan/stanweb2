export function isOnline() {
    return window.navigator.onLine;
}

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

export function nFormatter(number) {
if(number){
    let len = `${parseInt(Math.abs(number))}`.length;

    if(len>5){
    let tier = Math.log10(Math.abs(number)) / 3 | 0;

    if (tier === 0) return number;

    let suffix = SI_SYMBOL[tier];
    let scale = Math.pow(10, tier * 3);

    let scaled = number / scale;
    let x = scaled.toFixed(1).toString();
    if (x[x.length - 1] === '0')
        x = x.split('.')[0]
    return x + suffix;
}
else {

    let num = number.toFixed(1).toString();
    if(num[num.length-1]==='0')
        num = num.split(".")[0]
    return num;
}
}
}

const teamNames =  {
    CSK : "Chennai",
    MI : "Mumbai",
    DC : "Delhi",
    RCB : "Bangalore",
    KKR : "Kolkata",
    SRH : "Hyderabad",
    PBKS : "Punjab",
    RR : "Rajasthan",
    LSG : "Lucknow",
    GT : "Gujarat"
  }

export function teamNameCorrection(teamName){
    if(teamName in teamNames){
        return teamNames[teamName]
    }
    else return teamNames["CSK"]
}