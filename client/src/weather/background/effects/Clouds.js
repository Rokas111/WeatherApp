import {Cloud,setBrush} from "../objects/CloudFormations.js"

let brush;

const options = {
    effect: "time_of_day",
    priority_index: 0
}

function initiate(new_brush) {
    brush = new_brush;
    setBrush(brush);
}

function play(weather) {
}

export default {
    options,
    play,
    initiate
}