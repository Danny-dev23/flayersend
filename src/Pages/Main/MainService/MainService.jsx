import React from 'react';
import "./mainService.css";
import BgService from "../../../assents/images/main-images__two.png";
const MainService = () => {
  return (
    <div>
      <div className="main-service">
        <h2 className="main-service__title">Преимущества сервиса</h2>
        <div className="main-service__content">
          <div className="main-service__card">
            <img
              src={BgService}
              alt="Аналитика"
              className="main-service__image"
            />
            <h3 className="main-service__card-title">Аналитика</h3>
            <p className="main-service__card-description">
              Отслеживайте эффективность закупок в реальном времени
            </p>
          </div>
          <div className="main-service__features">
            <div className="main-service__feature">
              <h3 className="main-service__feature-title">Быстрая настройка</h3>
              <p className="main-service__feature-description">
                Запустите трафик в один клик
              </p>
            </div>
            <div className="main-service__feature">
              <h3 className="main-service__feature-title">Гибкая фильтрация</h3>
              <p className="main-service__feature-description">
                Настраивайте аудиторию по полу и интересам
              </p>
            </div>
            <div className="main-service__feature">
              <h3 className="main-service__feature-title">Честные выплаты</h3>
              <p className="main-service__feature-description">
                Получайте доход за каждого подписчика
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainService;