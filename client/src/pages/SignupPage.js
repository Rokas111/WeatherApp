import {useState} from "react";
import {Auth} from "../components/Auth";
import {useNavigate,Link} from "react-router-dom";
import Loader from "../components/Loader";
import Cookie from "js-cookie";


function SignUpPage() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState({error: ""});
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await (await fetch(`https://weatherappbackend-q6ju.onrender.com/api/signup`, {
                method: "post",
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })).json();
            if (res.error) {
                setError({error: res.error.message, level: res.error.from == "password" ? 3 : (res.error.from == "email" ? 2 : 1)})
            } else if (res.jwt) {
                Cookie.set("jwt_token", res.jwt);
                navigate("/");
            } else {
                setError({error: "Something went wrong with our code",level: 1});
            }
        } catch (e) {
            setError({error: "Something went wrong with our code",level: 1});
        }        
    }
    return (
        <Auth success_redirect={"/"}>
            <Loader innerJSX={(isLoading,loading_icon,load) => {
                return <div className="form_wrap">
                    <form onSubmit={(e) => load((e) => submit(e),e)}>
                        <h1>Please Sign Up</h1>
                        <div className={`form_field ${(error && error.level == 1) ? "form_field_error" : ""}`}>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" placeholder="example@gmail.com" value={email} onInput={(e) => setEmail(e.target.value)}/>
                            {error && error.level == 1 && <p className="error">{error.error}</p>}
                        </div>
                        <div className={`form_field ${(error && error.level != 1) ? "form_field_error" : ""}`}>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" placeholder="super-secret-password" value={password} onInput={(e) => setPassword(e.target.value)}/>
                            {error && error.level != 1 && <p className="error">{error.error}</p>}
                        </div>
                        <button>Sign Up {isLoading ? loading_icon : ("")}</button>
                        <Link to="/login" className="link">I already have an account</Link> 
                    </form> 
                </div>
            }}/>  
        </Auth>
    )
}
export default SignUpPage;