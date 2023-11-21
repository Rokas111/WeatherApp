import {useState,createContext,useEffect} from "react";
import {Navigate} from "react-router-dom";
import Loading from "./Loading.js";
import Cookie from "js-cookie";

export const AuthContext = createContext();

export function Auth({fail_redirect,success_redirect,children}) {
    const [auth,setAuth] = useState(); 
    useEffect(() => {
        fetch(`https://weatherappbackend-q6ju.onrender.com/api/user`, {
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${Cookie.get("jwt_token")}`,
                "Content-Type": "application/json"
            })
        }).then((res) => {
            if (res.status === 401) {
                setAuth({fail: "auth_fail"});
                return;
            }
            res.json().then((data) => setAuth({user: data})).catch((err) => {console.log(err);});;
        }).catch((err) => {});
    },[]);
    return auth ? ((auth.fail == "auth_fail") ? (fail_redirect ? (<Navigate to={fail_redirect} />) : <AuthContext.Provider>{children}</AuthContext.Provider>) : (success_redirect ? (<Navigate to={success_redirect} />) : <AuthContext.Provider value={auth.user}>{children}</AuthContext.Provider>)) : (<Loading />);        
};