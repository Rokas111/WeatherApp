import {useState} from "react";

const LOADING_ICON = <i className="fas fa-circle-notch fa-spin loading_icon"></i>;

function Loader({innerJSX}) {
    const [isLoading,setLoading] = useState(false);

    const load = (loadFunction,e) => {
        if (isLoading) return;
        setLoading(true);
        loadFunction(e).then(() => {
            setLoading(false)
        }).catch((err) => {
            setLoading(false);
        })
    }

    return innerJSX(isLoading,LOADING_ICON,load);
}

export default Loader;