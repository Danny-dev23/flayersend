import React from 'react';
import "./mainReady.css"
import LogoReady from "../../../assents/images/LogoReady.png"
const MainReady = () => {
  return (
    <div className='main-ready'>
      <img className='main-ready-image' src={LogoReady} alt="" />
      <h2 className='main-ready-title'>Готовы увеличить свой доход?</h2>
      <p className='main-ready-description'>Начните работать с Flyer и получите мгновенный прирост трафика</p>
      <button className='main-ready-button'>Перейти к каталогу</button>
    </div>
  );
};

export default MainReady;