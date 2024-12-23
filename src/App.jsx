import { Routes, Route } from "react-router-dom";
import {
  Login,
  Register,
  Dashboard,
  Preferences,
  Messages,
  Profile,
  NotFound,
  RecoverPassword,
} from "./pages";
import { ROUTES } from "./routes";

import "./App.scss";

function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME}>
          <Route index element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.PREFERENCES} element={<Preferences />} />
          <Route path={ROUTES.MESSAGES} element={<Messages />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.REC_PASSWORD} element={<RecoverPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
