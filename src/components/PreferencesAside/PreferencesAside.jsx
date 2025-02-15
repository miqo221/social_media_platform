import React from "react";
import { settingsList } from "../../constants/preferencesConstants";
import Button from "../../components/Button/Button";
import searchIcon from "../../assets/images/icons/search.png";
import "./PreferencesAside.scss";

const PreferencesAside = () => {
  return (
    <div className="aside">
      <form>
        <div className="searchInput">
        <img src={searchIcon} alt="Search Icon" />
        <input type="text" placeholder="Search settings" />
        </div>
      </form>
      <div className="asideBtns">
        {settingsList.map((item, i) => {
          return (
            <div className="btnDiv" key={i}>
              <img src={item.icon} alt="Setting Icon" />
              <Button content={item.name} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreferencesAside;
