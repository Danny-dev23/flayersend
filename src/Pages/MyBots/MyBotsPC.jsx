import React, { useEffect, useState, useRef } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Switch from '@mui/material/Switch';
import BotIcon from "../../assents/images/bot.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate, formatShortDateTime } from "./utils";

const MyBotsPC = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBotId, setEditBotId] = useState(null);
  const [editToken, setEditToken] = useState("");
  const [deleteBotNumber, setDeleteBotNumber] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState({});
  const [bookings, setBookings] = useState({});
  const fileInputRefs = useRef({});
  const [blockRange, setBlockRange] = useState([null, null]);
  const [blockings, setBlockings] = useState({});

  const fetchBots = async () => {
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('https://flyersendtest.ru/api/user/bots/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBots(data.result || []);
      }
    } catch (error) {
      console.error('Ошибка при получении ботов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          setCategories(data.result);
        }
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
      }
    };
    fetchCategories();
    fetchBots();
  }, []);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) return;
    bots.forEach(bot => {
      if (!bookings[bot.number]) {
        fetch(`https://flyersendtest.ru/api/bot/bookings/?number=${bot.number}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
          .then(res => res.json())
          .then(data => {
            setBookings(prev => ({ ...prev, [bot.number]: data.result }));
          })
          .catch(e => console.error('Ошибка при получении бронирований:', e));
      }
    });
  }, [bots]);

  const handleEditClick = (bot) => {
    setEditBotId(bot.bot_id);
    setEditToken(bot.token || "");
    fetchBlockings(bot.number);
  };

  const handleSave = () => {
    setEditBotId(null);
    setEditToken("");
  };

  const handleCancel = () => {
    setEditBotId(null);
    setEditToken("");
  };

  const handleDelete = (number) => {
    setDeleteBotNumber(number);
  };

  const handleConfirmDelete = async () => {
    if (!deleteBotNumber) return;
    setDeleting(true);
    const accessToken = sessionStorage.getItem('access_token');
    try {
      const response = await fetch('https://flyersendtest.ru/api/user/bot/delete/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ number: deleteBotNumber })
      });
      if (response.ok) {
        setDeleteBotNumber(null);
        await fetchBots();
      } else {
        alert('Ошибка при удалении бота');
      }
    } catch (error) {
      alert('Ошибка при удалении бота');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteBotNumber(null);
  };

  const handleToggleStatus = async (bot) => {
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) return;
    try {
      const response = await fetch('https://flyersendtest.ru/api/user/bot/edit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          number: bot.number,
          status: !bot.status,
        })
      });
      if (response.ok) {
        await fetchBots();
      } else {
        const result = await response.json();
        alert('Ошибка при изменении статуса: ' + (result?.detail || response.status));
      }
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error);
      alert('Ошибка при изменении статуса');
    }
  };

  const handleFileUpload = async (e, bot) => {
    const file = e.target.files[0];
    if (!file) return;
    const accessToken = sessionStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('number', bot.number);
    try {
      const response = await fetch('https://flyersendtest.ru/api/user/bot/edit/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      if (response.ok) {
        alert('Файл успешно загружен!');
        await fetchBots();
      } else {
        alert('Ошибка при загрузке файла');
      }
    } catch (error) {
      alert('Ошибка при загрузке файла');
    }
  };

  const fetchBlockings = async (number) => {
    const accessToken = sessionStorage.getItem('access_token');
    try {
      const response = await fetch(`https://flyersendtest.ru/api/bot/bookings/?number=${number}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBlockings(prev => ({ ...prev, [number]: data.result || [] }));
      }
    } catch (e) {
      console.error('Ошибка при получении блокировок:', e);
    }
  };

  const handleBlockDates = async (bot, range) => {
    const [start, end] = range;
    if (!(start instanceof Date) || !(end instanceof Date)) return;
    const startDate = new Date(start);
    startDate.setMinutes(0, 0, 0);
    const endDate = new Date(end);
    endDate.setMinutes(0, 0, 0);

    const accessToken = sessionStorage.getItem('access_token');
    const body = {
      number: bot.number,
      block: true,
      date_start: Math.floor(startDate.getTime() / 1000),
      date_end: Math.floor(endDate.getTime() / 1000)
    };
    try {
      const response = await fetch('https://flyersendtest.ru/api/bot/bookings/edit/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        fetchBlockings(bot.number);
      } else {
        alert('Ошибка при создании блокировки');
      }
    } catch (e) {
      alert('Ошибка сети');
    }
  };

  const handleRemoveBlockDate = async (bot, start, end) => {
    const accessToken = sessionStorage.getItem('access_token');
    const body = {
      number: bot.number,
      block: false,
      date_start: start,
      date_end: end
    };
    try {
      const response = await fetch('https://flyersendtest.ru/api/bot/bookings/edit/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        await fetchBlockings(bot.number);
      } else {
        alert('Ошибка при удалении блокировки');
      }
    } catch (e) {
      alert('Ошибка сети');
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (bots.length === 0) {
    return <div className="my-bots__empty">У вас пока нет ботов (Добавьте бота, чтобы увидеть его здесь)</div>;
  }

  return (
    <div className="my-bots__pc">
      {bots.map((bot) => (
        <div className="my-bots__item" key={bot.bot_id}>
          <div className="my-bots__item-title">
            <div className="my-bots__item-head">
              <div className="my-bots__item__head-text">
                <div className="my-bots__item__head-image">
                  {bot.photo !== null ? (
                    <img src={bot.photo} alt="Бот" />
                  ) : (
                    <img src={BotIcon} alt="Бот" />
                  )}
                </div>
                <div className="my-bots__item-title-text">
                  <p className="my-bots__item-title-text-name">
                    Бот {bot.name} {bot.status === true && <span className="my-bots__item-title-text-active">Активный</span>}
                  </p>
                  <p className="my-bots__item-title-text-category">
                    {bot.categories && categories
                      ? bot.categories
                        .map(catId => categories[String(catId)]?.name)
                        .filter(Boolean)
                        .join(', ')
                      : ''}
                  </p>
                </div>
              </div>
              <div className="my-bots__item-title-user">
                <p className="my-bots__item-title-user-text">
                  Живые: <span className="my-bots__item-title-user-text-number">{bot.file && typeof bot.file.users !== 'undefined' ? bot.file.users : 0}</span> тыс
                </p>
                <p className="my-bots__item-title-user-text">
                  USDT: <span className="my-bots__item-title-user-text-number">{bot.prices?.[1] || 0}</span>
                </p>
              </div>
            </div>
            <div className="my-bots-active__btn">
              <div className="my-bots__item-title-actions">
                <Switch
                  checked={!!bot.status}
                  onChange={() => handleToggleStatus(bot)}
                  color="primary"
                />
                <button
                  className="my-bots__edit-btn"
                  onClick={() => handleEditClick(bot)}
                  title="Редактировать токен"
                >
                  <EditIcon fontSize="small" />
                </button>
                <button
                  className="my-bots__delete-btn"
                  onClick={() => handleDelete(bot.number)}
                  title="Удалить бота"
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
              <div className="my-bots__item-title-actions">
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={el => fileInputRefs.current[bot.bot_id] = el}
                  onChange={e => handleFileUpload(e, bot)}
                  accept=".txt,.csv,.xlsx,.xls,.json"
                />
                <button
                  className="my-bots__upload-btn"
                  onClick={() => fileInputRefs.current[bot.bot_id].click()}
                >
                  Обновить базу
                </button>
              </div>
            </div>
          </div>

          {deleteBotNumber === bot.number && (
            <div className="my-bots__modal-inline">
              <div className="my-bots__modal-header">
                <span className="my-bots__modal-title">Удаление бота</span>
                <button className="my-bots__modal-close" onClick={handleCancelDelete}>&times;</button>
              </div>
              <div className="my-bots__modal-body">
                <div>Удалить выбранный бот?</div>
                <div style={{ color: '#888', fontSize: '0.95em', marginTop: 4 }}>Отменить действие будет невозможно.</div>
              </div>
              <div className="my-bots__modal-actions">
                <button className="my-bots__save-btn" onClick={handleConfirmDelete} disabled={deleting}>
                  Удалить
                </button>
                <button className="my-bots__cancel-btn" onClick={handleCancelDelete} disabled={deleting}>
                  Оставить
                </button>
              </div>
            </div>
          )}

          {editBotId === bot.bot_id && (
            <div className="my-bots__edit-form">
              <div className="my-bots__edit-form__close-date">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                  <DatePicker
                    selectsRange
                    startDate={blockRange[0]}
                    endDate={blockRange[1]}
                    onChange={(update) => setBlockRange(update)}
                    showTimeSelect
                    timeIntervals={60}
                    timeCaption="Час"
                    dateFormat="dd.MM.yyyy HH:00"
                    placeholderText="Выбрать закрытые даты"
                    minTime={new Date(new Date().setHours(0, 0, 0, 0))}
                    maxTime={new Date(new Date().setHours(23, 0, 0, 0))}
                  />
                </div>
                <div>
                  <b>Закрытые даты:</b>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {(blockings[bot.number] || []).map((b, idx) => (
                      <li key={idx} style={{ fontSize: 14, marginBottom: 4 }}>
                        с {formatDate(b.date_start)} - {formatDate(b.date_end)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="my-bots__edit-form__redact">
                <div className="my-bots__edit-form-title">Редактировать токен бота:</div>
                <div className="my-bots__edit-form-desc">
                  <p className="my-bots__edit-form-desc-text">Токен бота</p>
                  <input
                    type="text"
                    value={editToken}
                    onChange={e => setEditToken(e.target.value)}
                    className="my-bots__edit-input"
                    placeholder="1234asdfghjka1234asdfghjk"
                  />
                </div>
                <div className="my-bots__edit-actions">
                  <button
                    className="my-bots__save-btn"
                    onClick={async () => {
                      await handleBlockDates(bot, blockRange);
                      handleSave();
                    }}
                    disabled={!blockRange[0] || !blockRange[1]}
                  >
                    Сохранить изменения
                  </button>
                  <button className="my-bots__cancel-btn" onClick={handleCancel}>
                    Отменить
                  </button>
                </div>
              </div>
            </div>
          )}

          {editBotId !== bot.bot_id && bookings[bot.number] && bookings[bot.number].length > 0 && (
            <div className="my-bots__bookings-head">
              <p className="my-bots__bookings-text">Запланированные заказы:</p>
              <div className="my-bots__bookings">
                {bookings[bot.number].map(b => formatDate(b.start)).join(', ')}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyBotsPC; 