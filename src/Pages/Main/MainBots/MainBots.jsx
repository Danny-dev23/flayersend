import React from "react";
import "./mainBots.css";
import botImage from "../../../assents/images/botImage.png";

const MainBots = () => {
  const items = [
    {
      id: 1,
      image: botImage,
      title: "Поиск музыки",
      rating: 4.9,
      category: "Музыка",
      audience: "390 тыс",
      purchases: 250,
      ru: "80%",
      mca: "50%",
      price: "USDT 75",
    },
    {
      id: 2,
      image: botImage,
      title: "Поиск фильма",
      rating: 4.9,
      category: "Фильмы",
      audience: "390 тыс",
      purchases: 250,
      ru: "80%",
      mca: "50%",
      price: "USDT 75",
    },
    {
      id: 3,
      image: botImage,
      title: "Поиск игр на пк",
      rating: 4.9,
      category: "Игры",
      audience: "390 тыс",
      purchases: 250,
      ru: "80%",
      mca: "50%",
      price: "USDT 75",
    },
    {
      id: 4,
      image: botImage,
      title: "Поиск музыки",
      rating: 4.9,
      category: "Музыка",
      audience: "390 тыс",
      purchases: 250,
      ru: "80%",
      mca: "50%",
      price: "USDT 75",
    },
  ];
  return (
    <div className="main-bots">
      <h1 className="main-bots__title">Рекомендуемые боты</h1>
      <div className="main-bots__card">
        {items.map((item) => (
          <div key={item.id} className="catalog-item">
            <div className="item-text">
              <div className="item-details">
                <img
                  src={item.image}
                  alt={item.category}
                  className="item-image"
                  style={{ marginRight: "20px" }}
                />
                <div className="item-text__details">
                  <h3 className="item-title">
                    {item.title}{" "}
                    <span className="item-rating">
                      <span className="item-rating__star">★</span> {item.rating}
                    </span>
                  </h3>
                  <p className="item-category">{item.category}</p>
                </div>
              </div>
              <div className="item-stats">
                <div className="item-stats__box">
                  <span className="item-stats__text">
                    Аудитория:{" "}
                    <span className="item-stats__text-span">
                      {item.audience}
                    </span>
                  </span>
                  <span className="item-stats__text">
                    RU: <span className="item-stats__text-span">{item.ru}</span>{" "}
                  </span>
                  <span className="item-stats__text">
                    Покупок:{" "}
                    <span className="item-stats__text-span">
                      {item.purchases}
                    </span>
                  </span>
                  <span className="item-stats__text">
                    МЦА:{" "}
                    <span className="item-stats__text-span">{item.mca}</span>{" "}
                  </span>
                </div>
                <button className="item-price">{item.price}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainBots;
