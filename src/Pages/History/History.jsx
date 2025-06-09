import React, { useEffect, useState, useRef } from "react";
import { formatDate } from "../MyBots/utils.js";
import SearchIcon from '@mui/icons-material/Search';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarPopup from "./CalendarPopup";
import "./history.css";
import UsersBot from "../../assents/images/users-bot.png";
import ChatsBot from "../../assents/images/chats-bot.png";
import UsersInChatsBot from "../../assents/images/users-bot-active.png";
import BotIcon from "../../assents/images/bot.png";

function formatInputDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

const DateInput = ({ value, onClick, placeholder, iconPosition = "left" }) => (
  <div className={`history__date-input-wrap ${iconPosition}`} onClick={onClick} tabIndex={0}>
    {iconPosition === "left" && <CalendarTodayIcon className="history__date-icon" />}
    <span className="history__date-placeholder">{placeholder}</span>
    {value && <span className="history__date-value">{formatInputDate(value)}</span>}
    {iconPosition === "right" && <CalendarTodayIcon className="history__date-icon" />}
  </div>
);

const History = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [showCalendar, setShowCalendar] = useState(null); // 'from' | 'to' | null
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("all");
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const calendarRef = useRef();

  useEffect(() => {
    const fetchPurchases = async () => {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('https://flyersendtest.ru/api/purchase/list/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPurchases(data.result || []);
          setFilteredPurchases(data.result || []);
        }
      } catch (error) {
        console.error('Ошибка при получении списка покупок:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) return;
      try {
        const response = await fetch('https://flyersendtest.ru/api/bot/category/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(
            data.result
              ? Object.entries(data.result).map(([id, obj]) => ({ ...obj, id: Number(id) }))
              : []
          );
          setCategoryMap(data.result || {});
        }
      } catch (error) {
        // ignore
      }
    };
    fetchPurchases();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = [...purchases];
    if (searchQuery) {
      filtered = filtered.map(group =>
        group.filter(purchase =>
          purchase.bot.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ).filter(group => group.length > 0);
    }
    if (status !== "all") {
      filtered = filtered.map(group =>
        group.filter(purchase => {
          if (status === 'confirmed') return purchase.status === 'confirmed' || purchase.status === 'завершено';
          if (status === 'awaiting confirmation') return purchase.status === 'awaiting confirmation' || purchase.status === 'в обработке';
          if (status === 'cancelled') return purchase.status === 'cancelled' || purchase.status === 'отменено';
          return true;
        })
      ).filter(group => group.length > 0);
    }
    // Фильтрация по выбранным датам
    if (dateFrom || dateTo) {
      filtered = filtered.map(group =>
        group.filter(purchase => {
          const purchaseDate = new Date(purchase.datetime * 1000);
          if (dateFrom && purchaseDate < new Date(dateFrom).setHours(0, 0, 0, 0)) return false;
          if (dateTo && purchaseDate > new Date(dateTo).setHours(23, 59, 59, 999)) return false;
          return true;
        })
      ).filter(group => group.length > 0);
    }
    if (category !== "all") {
      console.log('category value:', category);
      console.log('categories in select:', categories);
      filtered = filtered.map(group =>
        group.filter(purchase => {
          console.log('purchase.bot.categories:', purchase.bot.categories);
          if (!purchase.bot.categories) return false;
          return purchase.bot.categories.map(Number).includes(Number(category));
        })
      ).filter(group => group.length > 0);
    }
    setFilteredPurchases(filtered);
  }, [searchQuery, status, dateFrom, dateTo, category, purchases]);

  // Закрытие календаря по клику вне
  useEffect(() => {
    function handleClickOutside(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(null);
      }
    }
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="history">
      <h3 className="history__title">История покупок</h3>
      <div className="history__filters-panel">
        <div className="history__search">
          <SearchIcon className="history__search-icon" />
          <input
            type="text"
            placeholder="Поиск...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="history__search-input"
          />
        </div>
        <div className="history__filters-row">
          <div style={{ position: 'relative', flex: 1 }}>
            <DateInput
              value={dateFrom}
              onClick={() => setShowCalendar(showCalendar === 'from' ? null : 'from')}
              placeholder="От"
              iconPosition="left"
            />
            {showCalendar === 'from' && (
              <div className="calendar-popup-outer" ref={calendarRef}>
                <CalendarPopup
                  selected={dateFrom}
                  onSelect={date => setDateFrom(date)}
                  onClose={() => setShowCalendar(null)}
                  initialMonth={dateFrom || dateTo || new Date()}
                  maxDate={dateTo}
                />
              </div>
            )}
          </div>
          <div style={{ position: '', flex: 1 }}>
            <DateInput
              value={dateTo}
              onClick={() => setShowCalendar(showCalendar === 'to' ? null : 'to')}
              placeholder="До"
              iconPosition="right"
            />
            {showCalendar === 'to' && (
              <div className="calendar-popup-outer" ref={calendarRef}>
                <CalendarPopup
                  selected={dateTo}
                  onSelect={date => setDateTo(date)}
                  onClose={() => setShowCalendar(null)}
                  initialMonth={dateTo || dateFrom || new Date()}
                  minDate={dateFrom}
                />
              </div>
            )}
          </div>
        </div>
        <select
          className="history__category-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="all">Все категории <KeyboardArrowDownIcon className="history__category-select-icon" /></option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <div className="history__status-tabs">
          <button className={status === 'all' ? 'active' : ''} onClick={() => setStatus('all')}>Все</button>
          <button className={status === 'confirmed' ? 'active' : ''} onClick={() => setStatus('confirmed')}>Завершённые</button>
          <button className={status === 'awaiting confirmation' ? 'active' : ''} onClick={() => setStatus('awaiting confirmation')}>В обработке</button>
          <button className={status === 'cancelled' ? 'active' : ''} onClick={() => setStatus('cancelled')}>Отменённые</button>
        </div>
      </div>
      {/* {formatDate(purchase.datetime)} */}
      <div className="history__list">
        {filteredPurchases.map((purchaseGroup, groupIndex) => (
          <div key={groupIndex} className="history__group">
            {purchaseGroup.map((purchase) => (
              <div key={purchase.post_id} className="history__item">
                <div className="history__item-header">
                  <div className="history__item-date">
                    <div className="history__item-date-icon">
                      <img src={purchase.bot.photo || BotIcon} alt="" />
                    </div>
                    <div className="history__item-date-text">
                      <p className="history__item-date-text-name">{purchase.bot.name}</p>
                      <p className="history__item-date-text-categories">{Array.isArray(purchase.bot.categories) && purchase.bot.categories.length > 0
                        ? purchase.bot.categories.map(cid => categoryMap[cid]?.name || cid).join(', ')
                        : ''}</p>
                    </div>
                  </div>
                  <div className={`history__item-status history__item-status--${purchase.status}`}>
                    {purchase.status}
                  </div>
                </div>
                <div className="history__item-content">
                  <div className="history__item-bot">

                    <div className="history__item-bot-stats2col">
                      <div className="history__item-bot-stats2col-col">
                        <div className="history__item-bot-stat">
                          <img src={UsersBot} alt="users" className="history__item-bot-stat-icon" />
                          <span className={purchase.bot.file.users > 0 ? "history__item-bot-stat-value" : "history__item-bot-stat-value zero"}>{purchase.bot.file.users > 0 ? purchase.bot.file.users + ' тыс' : '0 тыс'}</span>
                        </div>
                        <div className="history__item-bot-stat">
                          <img src={ChatsBot} alt="chats" className="history__item-bot-stat-icon" />
                          <span className={purchase.bot.file.chats > 0 ? "history__item-bot-stat-value" : "history__item-bot-stat-value zero"}>{purchase.bot.file.chats > 0 ? purchase.bot.file.chats + ' тыс' : '0 тыс'}</span>
                        </div>
                        <div className="history__item-bot-stat">
                          <img src={UsersInChatsBot} alt="users in chats" className="history__item-bot-stat-icon" />
                          <span className={purchase.bot.file.users_in_chats > 0 ? "history__item-bot-stat-value" : "history__item-bot-stat-value zero"}>{purchase.bot.file.users_in_chats > 0 ? purchase.bot.file.users_in_chats + ' тыс' : '0 тыс'}</span>
                        </div>
                      </div>
                      <div className="history__item-bot-stats2col-col">
                        <div className="history__item-bot-stat">
                          <span className="history__item-bot-stat-label">Покупок:</span>
                          <span className="history__item-bot-stat-value blue">{purchase.bot.data && purchase.bot.data.purchases !== undefined ? purchase.bot.data.purchases : 0}</span>
                        </div>
                        <div className="history__item-bot-stat">
                          <span className="history__item-bot-stat-label">RU:</span>
                          <span className="history__item-bot-stat-value blue">{purchase.bot.data && purchase.bot.data.ru !== undefined ? purchase.bot.data.ru : 0} %</span>
                        </div>
                        <div className="history__item-bot-stat">
                          <span className="history__item-bot-stat-label">МЦА:</span>
                          <span className="history__item-bot-stat-value blue">{purchase.bot.data && purchase.bot.data.men !== undefined ? purchase.bot.data.men : 0} %</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="history__item-amount">
                    {purchase.amount} USDT
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History; 