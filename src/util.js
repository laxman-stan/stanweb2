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
    console.log('fachi', x, number, scaled)
    if (x[x.length - 1] === '0')
        x = x.split('.')[0]
    return x + suffix;
}
return number.toFixed(1);
}
}