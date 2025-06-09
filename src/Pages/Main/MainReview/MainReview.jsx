import React from "react";
import "./mainReview.css";
import QuoteMark from "../../../assents/images/Quote-mark.png";
import QuoteMarkSmall from "../../../assents/images/QuoteMark-small.png";
import Topor from "../../../assents/images/Topor-img.png";
import NoMorgen from "../../../assents/images/NoMorgen-img.png";
import Blat from "../../../assents/images/Blat-img.png";

const MainReview = () => {
  return (
    <div className="main-review">
      <div className="main-review__header">
        <img
          className="main-review__header-quote-mark"
          src={QuoteMark}
          alt=""
        />
        <h1 className="main-review__header-title">Отзывы и кейсы</h1>
        <p className="main-review__header-subtitle">
          Успешные компании наших клиентов
        </p>
      </div>
      <div className="main-review__cards">
        <div className="main-review__card box-medium">
          <div className="main-review__card-header">
            <img
              className="main-review__card-header-image"
              src={Topor}
              alt=""
            />
            <span className="main-review__card-header-label">ТОПОР 18+</span>
          </div>
          <div className="main-review__card-body">
            <img
              className="main-review__card-body-quote-mark"
              src={QuoteMarkSmall}
              alt=""
            />
            <p className="main-review__card-body-text">
              "Работаем с платформой уже несколько месяцев — удобный интерфейс,
              чёткая аналитика и, главное, реальный результат. Трафик приходит
              без пересечений, подписчики остаются и активно вовлекаются.
              Однозначно топовый инструмент для роста!"
            </p>
          </div>
        </div>
        <div className="main-review__card-position">
          <div className="main-review__card box-large">
            <div className="main-review__card-header">
              <img
                className="main-review__card-header-image"
                src={NoMorgen}
                alt=""
              />
              <span className="main-review__card-header-label">
                НЕ МОРГЕНШТЕРН
              </span>
            </div>
            <div className="main-review__card-body">
              <img
                className="main-review__card-body-quote-mark"
                src={QuoteMarkSmall}
                alt=""
              />
              <p className="main-review__card-body-text">
                "Сначала сомневались, но после первого же теста убедились –
                Flyer реально даёт качественный трафик. Гибкие фильтры позволяют
                настраивать аудиторию под наш контент, а премиум-подписчики
                увеличивают охваты и ER.”
              </p>
            </div>
          </div>
          <div className="main-review__card box-small">
            <div className="main-review__card-header">
              <img
                className="main-review__card-header-image"
                src={Blat}
                alt=""
              />
              <span className="main-review__card-header-label">ПО БЛАТУ</span>
            </div>
            <div className="main-review__card-body">
              <img
                className="main-review__card-body-quote-mark"
                src={QuoteMarkSmall}
                alt=""
              />
              <p className="main-review__card-body-text">
                "Flyer – один из немногих сервисов, который не просто «наливает»
                подписчиков, а даёт реально живую аудиторию.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainReview;
