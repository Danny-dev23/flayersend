import React from "react";
import "./mainAbout.css";
import BgAbout from "../../../assents/images/main-images__one.png";


const MainAbout = () => {
  return (
    <div className="main-about">
      <h1 className="main-about__title">
        <span className="main-about__highlight">Flyer Send</span>– мощный инструмент для<br/> автоматизации трафика<br/> в
        Telegram{" "}
      </h1>
      <button className="main-about__button">Начать сейчас</button>
      <img className="main-about__image" src={BgAbout} alt="Background" />
    </div>
  );
};

export default MainAbout;
