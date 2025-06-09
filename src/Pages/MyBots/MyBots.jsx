import React from "react";
import MyBotsPC from "./MyBotsPC";
import MyBotsMobile from "./MyBotsMobile";
import AddBot from "./AddBot";
import "./mybots.css";

const MyBots = () => {
  return (
    <div className="my-bots">
      <h3 className="my-bots__title">Мои боты</h3>
      <AddBot />
        <div className="my-bots__list">
        <MyBotsPC />
        <MyBotsMobile />
        </div>
    </div>
  );
};

export default MyBots;
