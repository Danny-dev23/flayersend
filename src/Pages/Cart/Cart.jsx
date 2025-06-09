import React, { useContext, useEffect, useState, forwardRef } from "react";
import { CartContext } from "../../utilits/CartContext/CartContext";
import BotIcon from "../../assents/images/bot.png";
import EmptyCart from "../../assents/images/EmptyCart.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./cart.css";
import Galka from "../../assents/images/galoshka.png"
import Trash from "../../assents/images/trash_can.png"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5MDMyMTQ4LCJpYXQiOjE3NDg0MjczNDgsImp0aSI6ImU1ZWZlZWFiMjg2NzQ1YTNiMzk5YjJiMjViNmNhYzg3IiwidXNlcl9pZCI6NTA2MzI1ODg3N30.8bmasO_ZoRQNRHkDm5ZTLnFaojB6Rya2te1psN4hH7Q";

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <input
    className="date-picker"
    onClick={onClick}
    value={value}
    placeholder={placeholder}
    ref={ref}
    readOnly
    style={{ background: "#fff", cursor: "pointer" }}
  />
));

const Cart = () => {
  const { cart, setCart } = useContext(CartContext);
  const [categories, setCategories] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [postLinks, setPostLinks] = useState({});
  const [postStatuses, setPostStatuses] = useState({});
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [mobileOpen, setMobileOpen] = useState({});

  // Загрузка категорий для отображения их названий
  useEffect(() => {
    const fetchCategories = async () => {
      const accessToken = sessionStorage.getItem('access_token');
      if (!token) return;
      try {
        const response = await fetch('https://flyersendtest.ru/api/bot/category/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data.result);
        }
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
      }
    };
    fetchCategories();
  }, []);

  const createPostForBot = async (botNumber) => {
    const accessToken = sessionStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch('https://flyersendtest.ru/api/user/post/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: "New Post",
          text: "Post content",
          is_public: true
        })
      });
      if (response.ok) {
        const data = await response.json();
        setPostLinks(prev => ({
          ...prev,
          [botNumber]: {
            post_id: data.result.post_id,
            link: data.result.link
          }
        }));
        checkPostStatus(botNumber, data.result.post_id);
      }
    } catch (error) {
      console.error('Ошибка при создании поста:', error);
    }
  };

  const checkPostStatus = async (botNumber, postId) => {
    const accessToken = sessionStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch(`https://flyersendtest.ru/api/user/post/?post_id=${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const isPostReady = (data.result?.text && data.result.text.trim() !== "") ||
          (data.result?.file && Object.keys(data.result.file).length > 0);
        setPostStatuses(prev => ({
          ...prev,
          [botNumber]: isPostReady
        }));
        if (!isPostReady) {
          setTimeout(() => checkPostStatus(botNumber, postId), 2000);
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке поста:', error);
    }
  };

  const isCheckoutValid = () => {
    if (cart.length === 0) return false;
    const minTimestamp = Date.now() + 24 * 60 * 60 * 1000;
    return cart.every(item =>
      selectedDates[item.number] &&
      postLinks[item.number]?.post_id &&
      postStatuses[item.number] &&
      selectedDates[item.number].getTime() > minTimestamp
    );
  };

  const handlePurchase = async () => {
    setPurchaseLoading(true);
    const accessToken = sessionStorage.getItem('access_token');
    if (!token) return;

    const purchases = cart.map(item => ({
      category: item.categories?.[0] || item.category,
      bot_number: item.number,
      price: item.price,
      post_id: postLinks[item.number]?.post_id,
      date: Math.floor(selectedDates[item.number].getTime() / 1000)
    }));

    console.log('Отправляемые данные на /api/purchase/create/:', purchases);

    try {
      const response = await fetch('https://flyersendtest.ru/api/purchase/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchases)
      });
      if (response.ok) {
        alert('Покупки успешно оформлены!');
        setCart([]);
      } else {
        alert('Ошибка при оформлении покупок');
      }
    } catch (error) {
      alert('Ошибка сети');
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Подсчет количества и суммы
  const totalCount = cart.length;
  const totalSum = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  // Выделить/снять выделение одной карточки
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id]
    );
  };

  // Выбрать все
  const selectAll = () => {
    setSelected(cart.map((item) => item.id || item.number));
  };

  // Снять все
  const deselectAll = () => {
    setSelected([]);
  };

  // Удалить выбранные
  const removeSelected = () => {
    const newCart = cart.filter(item => !selected.includes(item.id || item.number));
    setCart(newCart);
    setSelected([]);
  };

  // Ограничения для выбора даты: минимум завтра с 00:00, максимум через 30дней
  const now = new Date();
  const minDateTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const maxDateTime = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="">
      <h3 className="catalog-title">Корзина</h3>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <img src={EmptyCart} alt="" className="empty-cart__img" />
          <h3 className="empty-cart__title">Корзина пуста</h3>
          <button className="empty-cart__button">Перейти к каталогу</button>
        </div>
      ) : (
        <div className="cart-box">
          <div className="cart-actions">
            <button onClick={selected.length === cart.length ? deselectAll : selectAll} className="cart-actions__button">
              {selected.length === cart.length ? "Снять все" : "Выбрать все"} <img src={Galka} alt="" />
            </button>
            <button
              onClick={removeSelected}
              disabled={selected.length === 0}
              className="cart-remove-btn"
            >
              Удалить выбранные <img src={Trash} alt="" />
            </button>
          </div>
          <div className="cart-box__items">
            <div className="cart-box__items-left">
              {cart.map((item, index) => {
                const id = item.id || item.number || index;
                const isActive = selected.includes(id);
                const isMobileOpen = mobileOpen[id] || false;
                return (
                  <div
                    className={`cart-item${isActive ? ' cart-item--active' : ''}`}
                    key={id}
                    onClick={() => toggleSelect(id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Десктопная версия (как есть) */}
                    <div className="catalog-item catalog-item--desktop">
                      <div className="item-text">
                        <div className="item-text__left">
                          <div className="item-details">
                            <div className="item-details__image">
                              {item.photo ? (
                                <img src={item.photo} alt="Бот" className="item-image" />
                              ) : (
                                <img src={BotIcon} alt="Бот" className="item-image" />
                              )}
                            </div>
                            <div className="item-text__details">
                              <h3 className="item-title">
                                {item.name}
                                {item.data?.purchases && (
                                  <span className="item-rating">
                                    <span className="item-rating__star">★</span>{" "}
                                    {(item.data.purchases / 20).toFixed(1)}
                                  </span>
                                )}
                              </h3>
                              <p className="my-bots__item-title-text-category">
                                {item.categories && categories
                                  ? item.categories
                                    .map(catId => categories[String(catId)]?.name)
                                    .filter(Boolean)
                                    .join(', ')
                                  : ''}
                              </p>
                            </div>
                          </div>
                          <div className="item-stats-cart">
                            <div className="item-stats__box">
                              <span className="item-stats__text">
                                Аудитория: {" "}
                                <span className="item-stats__text-span">
                                  {item.file?.users ?? "-"}
                                </span>
                              </span>
                              <span className="item-stats__text">
                                RU: <span className="item-stats__text-span">{item.data?.ru ?? "-"}</span>
                              </span>
                              <span className="item-stats__text">
                                Покупок: {" "}
                                <span className="item-stats__text-span">
                                  {item.data?.purchases ?? 0}
                                </span>
                              </span>
                              <span className="item-stats__text">
                                МЦА: <span className="item-stats__text-span">{item.data?.men ?? "-"}</span>
                              </span>
                            </div>

                          </div>
                          <div className="items-details__price">
                            <span className="item-price-cart">
                              USDT {item.price}
                            </span>
                          </div>
                        </div>
                        <div className="cart-item__details">
                          <div className="cart-item__post">
                            {postLinks[item.number] ? (
                              <div className="post-status">
                                {postStatuses[item.number] ? (
                                  <div className="post-link-">
                                    <span className="post-status__icon">✓</span>
                                    Пост загружен
                                  </div>
                                ) : (
                                  <a
                                    href={postLinks[item.number].link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="post-link"
                                  >
                                    Загрузить пост
                                  </a>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  createPostForBot(item.number);
                                }}
                                className="create-post-btn"
                              >
                                Создать  пост
                              </button>
                            )}
                          </div>

                          <div className="cart-item__calendar">
                            <DatePicker
                              selected={selectedDates[item.number]}
                              onChange={date => {
                                setSelectedDates(prev => ({
                                  ...prev,
                                  [item.number]: date
                                }));
                              }}
                              minDate={minDateTime}
                              maxDate={maxDateTime}
                              filterDate={date => {
                                const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
                                const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
                                return (
                                  endOfDay >= minDateTime && startOfDay <= maxDateTime
                                );
                              }}
                              filterTime={time => {
                                return time >= minDateTime && time <= maxDateTime;
                              }}
                              placeholderText="Выберите дату и время"
                              dateFormat="dd.MM.yyyy HH:00"
                              showTimeSelect
                              timeFormat="HH:00"
                              timeIntervals={60}
                              timeCaption="Время"
                              customInput={<CustomInput />}
                              shouldCloseOnSelect={true}
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Мобильная версия */}
                    <div className="catalog-item cart-mobile">
                      <div className="cart-mobile__box">
                        <div className="cart-mobile__photo">
                          {item.photo ? (
                            <img src={item.photo} alt="Бот" className="item-image" />
                          ) : (
                            <img src={BotIcon} alt="Бот" className="item-image" />
                          )}
                        </div>
                        <div className="cart-mobile__text">
                          <h3 className="cart-mobile__title">{item.name}</h3>
                          <span className="cart-mobile__audience">
                            Аудитория: <b>{item.file?.users ?? '-'}</b>
                          </span> <br />
                          <span>Покупок: <b>{item.data?.purchases ?? 0}</b></span><br />
                          {/* Скрываемый блок */}
                          <div className={`cart-mobile__hidden${isMobileOpen ? ' cart-mobile__hidden--open' : ''}`}>
                            <span>Категория: <b>{item.categories && categories ? item.categories.map(catId => categories[String(catId)]?.name).filter(Boolean).join(', ') : ''}</b></span><br />
                            <span>RU: <b>{item.data?.ru ?? '-'}</b></span><br />
                            <span>МЦА: <b>{item.data?.men ?? '-'}</b></span>
                          </div>
                          <button
                            className="cart-mobile__more"
                            onClick={e => {
                              e.stopPropagation();
                              setMobileOpen(prev => ({ ...prev, [id]: !prev[id] }));
                            }}
                          >
                            {isMobileOpen ? 'Свернуть ▲' : 'Подробнее ▼'}
                          </button>
                        </div>
                        <div className="cart-mobile__bottom">
                          <span className="cart-mobile__rate">
                            <span className="item-rating__star">★</span>{' '}
                            {item.data?.purchases ? (item.data.purchases / 20).toFixed(1) : '4.9'}
                          </span>
                          <span className="item-price-cart">USDT {item.price}</span>
                        </div>
                      </div>
                      <div className="cart-item__details">
                          <div className="cart-item__post-mobile">
                            {postLinks[item.number] ? (
                              <div className="post-status">
                                {postStatuses[item.number] ? (
                                  <div className="create-post-btn">
                                    <span className="post-status__icon">✓</span>
                                    Пост загружен
                                  </div>
                                ) : (
                                  <a
                                    href={postLinks[item.number].link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="create-post-btn"
                                  >
                                    Загрузить пост
                                  </a>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  createPostForBot(item.number);
                                }}
                                className="create-post-btn"
                              >
                                Создать пост
                              </button>
                            )}
                          </div>

                          <div className="cart-item__calendar">
                            <DatePicker
                              selected={selectedDates[item.number]}
                              onChange={date => {
                                setSelectedDates(prev => ({
                                  ...prev,
                                  [item.number]: date
                                }));
                              }}
                              minDate={minDateTime}
                              maxDate={maxDateTime}
                              filterDate={date => {
                                const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
                                const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
                                return (
                                  endOfDay >= minDateTime && startOfDay <= maxDateTime
                                );
                              }}
                              filterTime={time => {
                                return time >= minDateTime && time <= maxDateTime;
                              }}
                              placeholderText="Выберите дату и время"
                              dateFormat="dd.MM.yyyy HH:00"
                              showTimeSelect
                              timeFormat="HH:00"
                              timeIntervals={60}
                              timeCaption="Время"
                              customInput={<CustomInput />}
                              shouldCloseOnSelect={true}
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-item__price">
              <div className="cart-summary">
                <p className="cart-summary__bots">
                  {totalCount} {
                    totalCount === 1 ? 'бот' :
                    totalCount >= 2 && totalCount <= 4 ? 'бота' :
                    'ботов'
                  }
                </p>
                <p className="cart-summary__total">
                  Итоговая стоимость: {" "}
                  <span className="cart-summary__total-price">{totalSum} USDT</span>
                </p>
              </div>
              <button
                className={`cart-summary__checkout${!isCheckoutValid() ? ' cart-summary__checkout--disabled' : ''
                  }`}
                disabled={!isCheckoutValid() || purchaseLoading}
                onClick={handlePurchase}
              >
                {purchaseLoading ? "Оформляем..." : "Перейти к оформлению"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
