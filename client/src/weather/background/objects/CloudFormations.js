import {calculateTan} from "../utils/MathGraphics.js";
import perlin from "../utils/PerlinNoise.js"

let brush;

function drawCloudLine(starting_x,starting_y,end_x,end_y,intensity,curviness,roughness) {
    const tan = calculateTan(starting_x,starting_y,end_x,end_y);
    const curviness_start = [(end_x-starting_x)/2+starting_x,tan*((end_x-starting_x)/2)+starting_y];
    const curviness_tan = calculateTan(curviness_start[0],curviness_start[1],end_x,starting_y);
    const curviness_control_point = [curviness_start[0]+(starting_x-curviness_start[0])*curviness*(tan < 0 ? 1 : -1),curviness_start[1]+(starting_x-curviness_start[0])*curviness*intensity*(tan < 0 ? 1 : -1)*curviness_tan];
    let roughness_control_point = [end_x,end_y];
    if (roughness < 0) {
        const roughness_tan = calculateTan(end_x,end_y,curviness_control_point[0],curviness_control_point[1]);
        roughness_control_point = [end_x-(end_x-curviness_control_point[0])*Math.abs(roughness)*(tan < 0 ? 1 : -1),end_y+(end_y-curviness_control_point[1])*Math.abs(roughness)*(tan < 0 ? 1 : -1)]
    } else if (roughness > 0) {
        roughness_control_point = [end_x-(end_x-starting_x)*roughness,end_y+(end_x-starting_x)*roughness*tan*-1]
    }
    brush.bezierCurveTo(curviness_control_point[0],curviness_control_point[1],roughness_control_point[0],roughness_control_point[1],end_x,end_y);
}

export function setBrush(new_brush) {
    brush = new_brush;
}

export class Mist {
    constructor(x,y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw() {
        brush.beginPath();
        brush.filter = "blur(5px)";
        brush.fillStyle = `rgba(175, 175, 175, 0.50)`;
        brush.fillRect(this.x,this.y,this.width,this.height);
        brush.fill();
        return this;
    }
}

export class Fog {
    render() {
        brush.beginPath();
        brush.fillStyle = `rgba(200, 200, 200, 0.76)`;
        brush.fillRect(0,0,window.innerWidth,window.innerHeight);
        brush.fill();
        return this;
    }
}

export class Cloud {
    constructor(x,y,width,min_x,max_x,min_y,max_y,y_rise,negative_y_rise,negative_min_y,negative_max_y,y_generator) {
        this.x = x;
        this.y = y;
        this.old_x = x;
        this.old_y = y;
        this.width = width;
        this.min_x = min_x;
        this.max_x = max_x;
        this.min_y = min_y;
        this.max_y = max_y;
        this.y_rise = y_rise;
        this.negative_y_rise = negative_y_rise;
        this.negative_min_y = negative_min_y;
        this.negative_max_y = negative_max_y;
        this.frame = Math.random()*Math.PI;
        this.transparency = 0.4 + Math.random()*0.3;
        this.y_noise = y_generator?y_generator.generate():perlin(1,1,2,0.5,8).generate();;//frequency,amplitude, lacunarity, persistance,octaveCount
        this.x_noise = perlin(6,1,2,0.5,4).generate();
    }
    draw() {
        brush.beginPath();
        brush.moveTo(this.x,this.y);
        brush.fillStyle = `rgba(175, 175, 175, ${this.transparency})`;
        brush.shadowBlur = 0;
        brush.filter = "blur(0px)";
        let backward = false, falling = false, backward_start_x;
        let index =  0;
        while (!backward || (backward && this.x > this.old_x)) {
            if (this.x-this.max_x <= this.old_x && backward) {
                drawCloudLine(this.x,this.y,this.old_x,this.old_y,1,1,0);
                this.x = this.old_x;
                this.y = this.old_y;
                break;
            }
            const to_x = this.x + ((this.max_x-this.min_x)*this.x_noise.noiseAt(index)+this.min_x)*(backward?-1:1);
            if (to_x >= this.width+this.old_x) {
                let backward_old = backward;
                falling = this.y < this.old_y;
                backward = this.y >= this.old_y;
                if (backward && !backward_start_x && backward_old == backward) {
                    backward_start_x = to_x
                }
            } else if (backward && backward_start_x && to_x <= backward_start_x-this.width) {
                falling = true;
            }
            let rise = (backward?this.negative_y_rise:this.y_rise) - (backward?this.negative_y_rise:this.y_rise)*this.y_noise.noiseAt(index)*2;

            if (falling || (!backward && this.y <= this.old_y-this.max_y) || (backward && this.y >= this.old_y+this.negative_max_y)) {  
                rise = rise > 0 ? (rise*-1) : rise;
            }

            let to_y = backward ? this.y + (rise * (backward?1:-1)) : Math.min(this.old_y,this.y + (rise * (backward?1:-1)));

            if ((!backward && to_y > this.old_y-this.min_y && !falling) || (backward && to_y < this.old_y+this.negative_min_y)) {
                rise = Math.abs(rise);
                to_y = backward ? this.y + (rise * (backward?1:-1)) : Math.min(this.old_y,this.y + (rise * (backward?1:-1)));
            }
            drawCloudLine(this.x,this.y,to_x,to_y,1,1,0);
            index += 1;
            this.x = to_x;
            this.y = to_y
        }
        //brush.moveTo(this.x,this.y)
        //brush.stroke();
        //brush.lineTo(this.x+this.width,this.y);
        brush.fill();
        return this;
    }
    update() {
        this.frame = this.frame + Math.PI/1000;
        this.old_x += Math.sin(this.frame) / 2;
        //this.old_y += Math.cos(this.frame/20) * 4;
        this.x = this.old_x;
        this.draw();
    }
}