let brush;

class Star {
    constructor(x,y,radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    draw() {
        brush.beginPath();
        brush.fillStyle = `rgba(232, 232, 232, 0.8)`;
        brush.shadowBlur = 10;
        brush.shadowColor = `rgba(232, 232, 232, 1)`;
        brush.arc(this.x,this.y,this.radius,0,Math.PI*2);
        brush.fill();
    }
}


const options = {
    effect: "time_of_day",
    priority_index: 0
}

let stars = [];

function initiate(new_brush) {
    brush = new_brush;
    stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push(new Star(Math.random()*window.innerWidth,Math.random()*window.innerHeight,Math.random()*3));
    }
}

function play(weather) {
    let id = weather.time_of_day;
    if (id == 1) {
        brush.beginPath();
        const gradient = brush.createLinearGradient(window.innerWidth/2,0,window.innerWidth/2,window.innerHeight);
        gradient.addColorStop(0, "rgb(35, 39, 41)");
        gradient.addColorStop(0.77, "rgb(51, 70, 89)");
        gradient.addColorStop(1, "rgb(49, 73, 97)");
        brush.fillStyle = gradient;
        brush.fillRect(0,0,window.innerWidth,window.innerHeight);
        brush.fill();
        brush.fillStyle = "";
    
        stars.forEach((s) => s.draw());
    } else if (id == 2) {
        brush.beginPath();
        const gradient = brush.createLinearGradient(window.innerWidth/2,0,window.innerWidth/2,window.innerHeight);
        gradient.addColorStop(0, "rgb(64, 99, 135)");
        gradient.addColorStop(0.33, "rgb(81, 135, 173)");
        gradient.addColorStop(1, "rgb(134, 201, 247)");
        brush.fillStyle = gradient;
        brush.fillRect(0,0,window.innerWidth,window.innerHeight);
        brush.fill();
        const gradient2 = brush.createLinearGradient(window.innerWidth/2,window.innerHeight,window.innerWidth/2,window.innerHeight-350);
        gradient2.addColorStop(0, "rgba(237, 192, 66,0.9)");
        gradient2.addColorStop(0.66, "rgba(255, 184, 84,0.33)");
        gradient2.addColorStop(1, "rgba(255, 200, 122,0)");
        brush.fillStyle = gradient2;
        brush.fillRect(0,window.innerHeight-350,window.innerWidth,window.innerHeight-350);
        brush.fill();
    } else if (id == 3) {
        brush.beginPath();
        const gradient = brush.createLinearGradient(window.innerWidth/2,0,window.innerWidth/2,window.innerHeight);
        gradient.addColorStop(0, "rgb(58, 80, 102)");
        gradient.addColorStop(0.33, "rgb(70, 111, 140)");
        gradient.addColorStop(1, "rgb(80, 144, 191)");
        brush.fillStyle = gradient;
        brush.fillRect(0,0,window.innerWidth,window.innerHeight);
        brush.fill();
        const gradient2 = brush.createLinearGradient(window.innerWidth/2,window.innerHeight,window.innerWidth/2,window.innerHeight-400);
        gradient2.addColorStop(0, "rgba(237, 192, 66,0.9)");
        gradient2.addColorStop(0.66, "rgba(255, 184, 84,0.33)");
        gradient2.addColorStop(1, "rgba(255, 200, 122,0)");
        brush.fillStyle = gradient2;
        brush.fillRect(0,window.innerHeight-400,window.innerWidth,window.innerHeight-400);
        brush.fill();
    } else {
        brush.beginPath();
        const gradient = brush.createLinearGradient(window.innerWidth/2,0,window.innerWidth/2,window.innerHeight);
        gradient.addColorStop(0, "rgb(76, 114, 181)");
        gradient.addColorStop(0.8, "rgb(91,201,255)");
        gradient.addColorStop(1, "rgb(155,232,255)");
        brush.fillStyle = gradient;
        brush.fillRect(0,0,window.innerWidth,window.innerHeight);
        brush.fill();
        brush.fillStyle = "";
    }
}

export default {
    options,
    play,
    initiate
}