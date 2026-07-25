function formatNumber(num){

    if(num < 1000)
        return num.toString();

    const units = ["K","M","B","T","Q"];

    let unit = -1;

    while(num >= 1000 && unit < units.length-1){
        num /= 1000;
        unit++;
    }

    let decimals;

    if(num >= 100)
        decimals = 0;
    else if(num >= 10)
        decimals = 1;
    else
        decimals = 2;

    return Number(num.toFixed(decimals)) + units[unit];

}
function lineIntersectsCircle(x1,y1,x2,y2,cx,cy,r){

    const dx = x2 - x1;
    const dy = y2 - y1;

    const lengthSq = dx*dx + dy*dy;

    let t =
        ((cx-x1)*dx + (cy-y1)*dy) /
        lengthSq;

    t = Math.max(0, Math.min(1, t));

    const px = x1 + dx*t;
    const py = y1 + dy*t;

    return Math.hypot(cx-px, cy-py) < r;

}