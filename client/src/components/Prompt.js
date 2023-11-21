import {createContext, useState } from "react";

export const PromptContext = createContext();

export function Prompt({children}) {
    const [showPrompt,setShowPrompt] = useState(false);
    const [showInnerJSX,setInnerJSX] = useState({});

    return <PromptContext.Provider value={{setShowPrompt,setInnerJSX,showPrompt}}> 
        {children}
        {showPrompt && (
            <div className="prompt_background">
                {showInnerJSX}
            </div>
        )} 
        </PromptContext.Provider>
}