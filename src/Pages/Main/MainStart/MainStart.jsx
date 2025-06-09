import React from "react";
import "./mainStart.css";
import BgStart from "../../../assents/images/main-images__three.png";
import BgStartActive from "../../../assents/images/main-images-threee_one.png";

const MainStart = () => {
  return (
    <div className="main-start">
      {/* <img src={BgStart} alt="" className="main-start__bg"/> */}
      <h1 className="main-start__title">Как начать работать с Flyer Send?</h1>
      <div className="main-start__steps">
        <div className="main-start__steps-box">
          <div className="main-start__steps-box__item">
            <div className="main-start__step main-start__step">
              <h2 className="main-start__step-title">1. Регистрация</h2>
              <p className="main-start__step-description">
                Зарегистрируйтесь через Telegram и получите доступ к личному
                кабинету
              </p>
            </div>
            <div className="main-start__step main-start__step">
              <h2 className="main-start__step-title">2. Выбор бота</h2>
              <p className="main-start__step-description">
                Подберите подходящий бот из каталога, настроив параметры под ваш
                продукт
              </p>
            </div>
          </div>
          <div className="main-start__steps-box__image">
            <img src={BgStartActive} alt="" />
          </div>
        </div>
        <div className="main-start__step main-start__step">
          <h2 className="main-start__step-title">3. Запуск</h2>
          <p className="main-start__step-description">
            Запустите кампанию – система автоматически распределит трафик и
            покажет статистику
          </p>
        </div>
        <div className="main-start__step main-start__step">
          <h2 className="main-start__step-title">4. Анализ результатов</h2>
          <p className="main-start__step-description">
            Получайте аналитику и корректируйте стратегию для максимального
            роста
          </p>
        </div>
      </div>
      <div className="main-start__steps-mobile">
        <div className="main-start__steps-box">
          <div className="main-start__steps-box__item">
            <div className="main-start__step main-start__step">
              <h2 className="main-start__step-title">1. Регистрация</h2>
              <p className="main-start__step-description">
                Зарегистрируйтесь через Telegram и получите доступ к личному
                кабинету
              </p>
            </div>
            <div className="main-start__step main-start__step">
              <h2 className="main-start__step-title">2. Выбор бота</h2>
              <p className="main-start__step-description">
                Подберите подходящий бот из каталога, настроив параметры под ваш
                продукт
              </p>
            </div>
          </div>
          
        </div>
        <div className="main-start__step main-start__step">
          <h2 className="main-start__step-title">3. Запуск</h2>
          <p className="main-start__step-description">
            Запустите кампанию – система автоматически распределит трафик и
            покажет статистику
          </p>
        </div>
        <div className="main-start__step main-start__step">
          <h2 className="main-start__step-title">4. Анализ результатов</h2>
          <p className="main-start__step-description">
            Получайте аналитику и корректируйте стратегию для максимального
            роста
          </p>
        </div>
        <div className="main-start__steps-box__image">
            <img src={BgStartActive} alt="" />
          </div>
      </div>
    </div>
  );
};

export default MainStart;
