import {useRef, cloneElement, Children } from "react";
function Slider({children}) {
    const slider = useRef();
    const moveSlider = (forward) => {
        const w = slider.current.getBoundingClientRect();
        if (parseInt(slider.current.style.left.slice(0,-2)) <= -3300 && forward) return;
        slider.current.style.left = Math.min((slider.current.style.left.length == 0?0:parseInt(slider.current.style.left.slice(0, -2)))+(forward?-210:210),0) + "px"; 
    }
    return <div className="slider_wrap">
        <div className="slider_box">
            <div className="slider" ref={slider}>
                {children}
            </div>
        </div>
        <div className="slider_button slider_back_button" onClick={() => moveSlider(false)}>
            <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div className="slider_button slider_next_button" onClick={() => moveSlider(true)}>
            <i className="fa-solid fa-chevron-right"></i>
        </div>
    </div>
}
export default Slider;