
export function calculateTan(x,y,to_x,to_y) {
    return (to_x-x) == 0 ? 0 : (to_y-y)/(to_x-x);
}