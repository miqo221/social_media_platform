import {useEffect, useReducer, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {ClipLoader} from "react-spinners";
import {ACTIONS, loginReducer} from "../../helpers/reducer";
import {ROUTES} from "../../routes";
import {API_URL} from "../../config/apisrc.js";
import {ERROR_MSG} from "../../config/messages.js";
import Button from "../../components/Button/Button";
import Animation from "../../components/Animation/Animation";
import logo from "../../assets/logo/icon.png";
import anim from "../../assets/png/home_anim.png";

import "./Login.scss";

const initialState = {
    email: "",
    password: "",
    success: null,
    error: null,
    loading: false,
    checked: false,
    IP: null,
};

export function Login() {
    const [state, dispatch] = useReducer(loginReducer, initialState);
    const navigate = useNavigate();
    const savedUser = JSON.parse(localStorage.getItem("rememberMe"));
    const [type, setType] = useState("password");

    //! if the user is saved on localstorage the email input field will be filled automatic
    useEffect(() => {
        if (savedUser) {
            dispatch({type: ACTIONS.SET_EMAIL, payload: savedUser.email});
            dispatch({type: ACTIONS.SET_REMEMBER, payload: savedUser.checked});
        }
    }, []);

    useEffect(() => {
        axios
            .get(API_URL.IP_API_URL)
            .then((response) =>
                dispatch({
                    type: ACTIONS.SET_IP,
                    payload: response.data.ip,
                })
            )
            .catch((error) => {
                dispatch({type: ACTIONS.SET_ERROR, payload: ERROR_MSG.IP_ERROR_MSG});
            });
    }, []);

    //! Handle remember me functionality
    const handleRememberMe = (checked, email, state) => {
        if (checked) {
            localStorage.setItem("rememberMe", JSON.stringify(state));
        } else {
            const savedUser = JSON.parse(localStorage.getItem("rememberMe"));
            if (savedUser && email === savedUser.email) {
                localStorage.removeItem("rememberMe");
            }
        }
    };

    const verifyUser = async (email, password) => {
        const {data: users} = await axios.get(API_URL.USERS_URL);
        return users.find((u) => u.email === email && u.password === password);
    };

    const saveLoggedInUser = async (user, IP) => {
        const {data: loggedInUsers} = await axios.get(API_URL.LOGGED_IN_USER_URL);
        const existingUser = loggedInUsers.find((u) => u.email === user.email);

        if (existingUser) {
            if (existingUser.IP !== IP) {
                await axios.put(
                    `${API_URL.LOGGED_IN_USER_URL}/${existingUser.id}`,
                    {...user, IP}
                );
            }
        } else {
            await axios.post(API_URL.LOGGED_IN_USER_URL, {...user, IP});
        }
    };

    //! Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({type: ACTIONS.SET_LOADING, payload: true});

        try {
            const user = await verifyUser(state.email, state.password);
            if (!user) {
                dispatch({
                    type: ACTIONS.SET_ERROR,
                    payload: ERROR_MSG.L_P_ERROR,
                });
                return;
            }

            const {password, ...signedUser} = user;
            await saveLoggedInUser(signedUser, state.IP);

            handleRememberMe(state.checked, state.email, state);

            navigate(`/dashboard/${user.id}`);
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: ERROR_MSG.FAILED_LOGIN,
            });
        } finally {
            dispatch({type: ACTIONS.SET_LOADING, payload: false});
        }
    };

    const notify = () => {
        if (state.error) toast.error(state.error);
    };

    useEffect(() => {
        notify();
    }, [state.error]);

    const setChecked = () => {
        dispatch({type: ACTIONS.SET_REMEMBER, payload: !state.checked});
    };

    const showPassword = () => {
        setType(type === "password" ? "text" : "password");
    };

    return (
        <main className="home">
            <ToastContainer className="notification"/>
            <div className="container">
                <div className="reg-box">
                    <header>
                        <img src={logo} alt="Bchat" id="logo"/>
                        <h1>Bchat</h1>
                    </header>
                    <h2>WELCOME BACK</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <label>Email</label>
                            <input
                                type="email"
                                value={state.email}
                                onChange={(e) =>
                                    dispatch({
                                        type: ACTIONS.SET_EMAIL,
                                        payload: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="input-box">
                            <label>Password</label>
                            <div className="password-input">
                                <input
                                    type={type}
                                    value={state.password}
                                    onChange={(e) =>
                                        dispatch({
                                            type: ACTIONS.SET_PASSWORD,
                                            payload: e.target.value,
                                        })
                                    }
                                />
                                <i
                                    className={`bi bi-${
                                        type === "password" ? "eye" : "eye-slash"
                                    }`}
                                    onClick={showPassword}></i>
                            </div>
                            <div className="remember_me_row">
                                <div>
                                    <input
                                        type="checkbox"
                                        id="remember_me"
                                        checked={state.checked}
                                        onChange={setChecked}
                                    />
                                    <label htmlFor="remember_me"></label>
                                    <span>Remember me</span>
                                </div>
                                <Link to={ROUTES.REC_PASSWORD}>Forgot Password</Link>
                            </div>
                        </div>
                        <div className="btn-box">
                            <Button
                                button_type="submit"
                                content={
                                    state.loading ? <ClipLoader size={15} color="white"/> : "Sign In"
                                }
                                button_class="btn_sign_in"
                                button_disabled={state.loading}
                                button_function={notify}
                            />
                            <Link className="btn_sign_in" to={ROUTES.REGISTER}>
                                Sign up
                            </Link>
                        </div>
                        <p>Copyright @ 2024 Banish</p>
                    </form>
                </div>
                <Animation anim={anim}/>
            </div>
        </main>
    );
}
