import React, { useEffect, useState } from "react";
import "./main.css";
import MainAbout from "./MainAbout/MainAbout";
import MainService from "./MainService/MainService";
import MainStart from "./MainStart/MainStart";
import MainBots from "./MainBots/MainBots";
import MainReview from "./MainReview/MainReview";
import MainQuestion from "./MainQuestion/MainQuestion";
import MainReady from "./MainReady/MainReady";
import axios from "axios";
import { data } from "react-router-dom";
import Test from "./Test";
import TestTwo from "./TestTwo";

const Main = () => {
  


  return (
    <div className="main">
      {/* <div className=""><Test/></div>
      <div className=""><TestTwo/></div> */}
      <div className="bg-main">
        <MainAbout />
      </div>
      <div className="bg-main">
        <MainService />
      </div>
      <div className="bg-main">
        <MainStart />
      </div>
      {/* <div className="">
        <MainBots />
      </div> */}
      {/* <div className="">
        <MainReview />
      </div> */}
      <div className="bg-main">
        <MainQuestion />
      </div>
      <div className="bg-white">
        <MainReady />
      </div>
    </div>
  );
};

export default Main;
