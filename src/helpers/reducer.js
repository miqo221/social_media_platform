export const ACTIONS = {
  SET_EMAIL: "set_email",
  SET_PASSWORD: "set_password",
  SET_ERROR: "set_error",
  SET_LOADING: "set_loading",
  SET_TOKEN: "set_token",
  SET_USER: "set_user",
};

export function loginReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_EMAIL:
      return { ...state, email: action.payload };
    case ACTIONS.SET_PASSWORD:
      return { ...state, password: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
      case ACTIONS.SET_USER:
        return { ...state, user: action.payload };
    default:
      return state;
  }
}

export function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TOKEN:
      return { ...state, token: action.payload };
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export function dashboardReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
}
