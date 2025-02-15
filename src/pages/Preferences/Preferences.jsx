import Navbar from "../../components/Navbar/Navbar";
import PreferencesAside from "../../components/PreferencesAside/PreferencesAside";
import "./Preferences.scss";

export function Preferences() {
  return (
    <div className="preferencesPage">
      <Navbar />
      <div className="preferencesMain">
      <PreferencesAside />

      </div>
    </div>
  ); // that is for changing user data
}
