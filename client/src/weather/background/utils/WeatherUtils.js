const _ = require("lodash");

export function calculateTimeOfDay(sunrise,sunset,date) {
    let sunrise_date = _.clone(date);
    sunrise_date.setHours(sunrise.getHours(),sunrise.getMinutes());
    let sunset_date = _.clone(date);
    sunset_date.setHours(sunset.getHours(),sunset.getMinutes());
    if (Math.abs(sunrise_date.getTime() - date.getTime()) <= 1800000 ) return 2;
    if (Math.abs(sunset_date.getTime() - date.getTime()) <= 1800000 ) return 3;
    if (date.getTime() < sunrise_date.getTime() || date.getTime() > sunset_date.getTime()) return 1;
    return 0;
}