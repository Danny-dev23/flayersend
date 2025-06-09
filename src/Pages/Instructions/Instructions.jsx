import React from "react";
import "./instructions.css";
const Instructions = () => {
  return (
    <div className="instructions">
      <h1 className="instructions-title">Инструкция</h1>
      <div className="instructions-box">
        <div className="instructions-box__card">
          <h2 className="instructions-box__card-title">1. Выберите ботов</h2>
          <p className="instructions-box__card-text">
            Найдите подходящих ботов в каталоге или с помощью умного подбора.
          </p>
          <p className="instructions-box__card-text">
            Нажмите «Добавить в корзину» у нужных вариантов.
          </p>
        </div>
        <div className="instructions-box__card">
          <h2 className="instructions-box__card-title">
            2. Авторизуйтесь через Telegram
          </h2>
          <p className="instructions-box__card-text">
            После добавления ботов, нажмите «Продолжить»
          </p>
          <p className="instructions-box__card-text">
            Система попросит вас войти через Telegram — это безопасно и нужно
            для оформления покупки.
          </p>
        </div>
        <div className="instructions-box__card">
          <h2 className="instructions-box__card-title">3. Оформление заказа</h2>
          <p className="instructions-box__card-text">
            После авторизации вы увидите свою корзину с выбранными ботами.
          </p>
          <p className="instructions-box__card-text">
            Проверьте данные и нажмите «Оформить заказ».
          </p>
        </div>
        <div className="instructions-box__card">
          <h2 className="instructions-box__card-title">4. Готово!</h2>
          <p className="instructions-box__card-text">
            После оплаты вы получите доступ к купленным ботам.
          </p>
          <p className="instructions-box__card-text">
            Информация о них появится в вашем личном кабинете.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
