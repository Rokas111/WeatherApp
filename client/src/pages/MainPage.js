import {Prompt} from "../components/Prompt";
import {Auth} from "../components/Auth.js";
import WeatherPage from "../weather/components/WeatherPage";


function MainPage() {
    return (
        <Auth fail_redirect={"/login"}>
            <Prompt><WeatherPage /></Prompt>
        </Auth>
    )
}
export default MainPage;