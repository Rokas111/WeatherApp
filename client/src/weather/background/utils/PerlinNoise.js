const _ = require("lodash");
export default function generatePerlinNoise (frequency,amplitude, lacunarity, persistance,octaveCount ) {
    const MAX_VALUES = 500;
    let random_noise = [];
    let noise = [];
    function interpolate(a, b, x) {
        const index = (1-Math.cos(Math.PI*x)) * 0.5;
        return a*(1-index)+b*index;
    }
    function sample(frequency, index) {
        frequency = Math.floor(frequency);
        const a = (Math.floor(index / frequency) * frequency) % MAX_VALUES;
        const b = ((Math.floor(index / frequency)+1) * frequency) % MAX_VALUES;
        return interpolate(random_noise[a],random_noise[b], (index / frequency)-Math.floor(index / frequency));
    };
    function generate() {
        noise = _.range(0,MAX_VALUES).map((n) => 0);
        random_noise = _.range(0,MAX_VALUES).map(() => Math.random());
        let max_value = 0;
        for (let i = 0; i < octaveCount; i++) {
            noise = noise.map((n,j) => {
                const value = n + amplitude*Math.pow(persistance,i)*sample(MAX_VALUES*(1/(frequency*Math.pow(lacunarity,i))),j);
                max_value = Math.max(value,max_value);
                return value;
            })
        }
        if (max_value > 1) noise = noise.map((n) => n / max_value)
        return this;
    }
    function getNoise() {
        return noise;
    }
    function noiseAt(x) {
        return interpolate(noise[Math.floor(x) % MAX_VALUES ],noise[(Math.floor(x)+1) % MAX_VALUES],x - Math.floor(x));
    }
    return {
        generate,
        getNoise,
        noiseAt
    }
}