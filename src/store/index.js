import { createStore } from "redux";
import reducers from "./Reducers/rootReducer";

const store = createStore(reducers);

export default store;
