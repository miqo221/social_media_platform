export const ACTIONS = {
  SET_EMAIL: "set_email",
  SET_PASSWORD: "set_password",
  SET_ERROR: "set_error",
  SET_LOADING: "set_loading",
  SET_USER: "set_user",
  SET_SUCCESS: "set_success",
  SET_REMEMBER: "set_remember",
  SET_IP: "set_IP",
  SET_SHOW_PASS: "set_show_pass",
  SET_GOOGLE_SIGN_IN: "set_google_sign_in",
};

export function loginReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_EMAIL:
      return { ...state, email: action.payload };
    case ACTIONS.SET_PASSWORD:
      return { ...state, password: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_SUCCESS:
      return { ...state, success: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    case ACTIONS.SET_GOOGLE_SIGN_IN:
      return { ...state, googleSignIn: action.payload };
    case ACTIONS.SET_REMEMBER:
      return { ...state, checked: action.payload };
    case ACTIONS.SET_IP:
      return { ...state, IP: action.payload };
    case ACTIONS.SET_SHOW_PASS:
      return { ...state, showPass: action.payload };
    default:
      return state;
  }
}
