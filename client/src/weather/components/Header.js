import {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../components/Auth";
import {PromptContext} from "../../components/Prompt";
import Loader from "../../components/Loader";
import Cookie from "js-cookie";

function Header() {
    const [navOpen, openNav] = useState(false); 
    const prompt_context = useContext(PromptContext);
    const navigate = useNavigate();

    const logout = () => {
        Cookie.remove("jwt_token");
        navigate(0);
    }

    const deleteUser = async () => {
        const res = await fetch("http://localhost:3080/api/user", {
            method: "delete",
            headers: new Headers({
                "Content-Type": "application/json",
                Authorization: `bearer ${Cookie.get("jwt_token")}`
            })
        });
        if (res.status == 200) logout();
    }

    const showDeletePrompt = () => {
        openNav(false);
        if (prompt_context.showPrompt) {
            prompt_context.setShowPrompt(false);
            return;
        }
        prompt_context.setInnerJSX(<div className="delete_prompt_wrap">
            <p className="delete_prompt_text">Are you sure you want to delete your account?</p>
            <div className="delete_prompt_buttons">
                <button onClick={() => prompt_context.setShowPrompt(false)}>Close</button>
                <Loader innerJSX={(isLoading,loading_icon,load) => {
                    return <button onClick={() => load(deleteUser)}>Delete Account {isLoading ? loading_icon : ("")}</button>
                }}/>
            </div>
        </div>)
        prompt_context.setShowPrompt(true);
    }

    return <header>
            <div className="profile_wrap">
                <div className="profile_box" onClick={() => openNav(!navOpen)}>
                    <div className="email_wrap">
                        <p className="email">{useContext(AuthContext).email}</p>
                    </div>
                    <div className="avatar_wrap">
                        <img src={`avatars/avatar${useContext(AuthContext).avatar+1}.png`} alt="Avatar"/>
                    </div>
                </div>
                {navOpen && (
                    <nav>
                        <ul>
                            <li onClick={showDeletePrompt}>
                                <div>
                                    <i className="fa-regular fa-trash-can"></i> <p>Delete Account</p>
                                </div>
                            </li>
                            <li onClick={logout}>
                                <div>
                                    <i className="fa-solid fa-right-from-bracket"></i> <p>Log out</p>
                                </div>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </header>
}
export default Header;