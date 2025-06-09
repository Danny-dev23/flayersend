import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import "./balans.css";
import axios from "axios";

const Balans = () => {
  const [balance, setBalance] = useState(0);
  const [retention, SetRetention] = useState(0);
  const [operationType, setOperationType] = useState("Пополнить баланс"); // Состояние для типа операции (пополнение или вывод)
  const [isOperationVisible, setIsOperationVisible] = useState(true);
  const [activeOperation, setActiveOperation] = useState("Пополнить баланс");
  const [history, setHistory] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState("");
  const [withdrawWallet, setWithdrawWallet] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferUserId, setTransferUserId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = sessionStorage.getItem('access_token');

      if (!accessToken) {
        console.error("access_token не найден в sessionStorage");
        return;
      }

      try {
        // Получение баланса и retention
        const balanceResponse = await fetch(
          `https://flyersendtest.ru/api/user/info/`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        // Получение истории
        const historyResponse = await fetch(
          `https://flyersendtest.ru/api/user/history/`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (balanceResponse.ok && historyResponse.ok) {
          const balanceData = await balanceResponse.json();
          const historyData = await historyResponse.json();
          SetRetention(balanceData.result.retention);
          setBalance(balanceData.result.balance);
          setHistory(historyData.result || []); // Сохраняем историю в состояние
        }
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) return;

    axios.get("https://flyersendtest.ru/api/user/deposit/", {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        setMethods(res.data.result);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleMethodChange = (e) => {
    const method = methods.find((m) => m.method === e.target.value);
    setSelectedMethod(method);
    setAmount(""); // сбросить сумму при смене метода
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (
      !selectedMethod ||
      !selectedMethod.min_amount ||
      parseFloat(value) >= parseFloat(selectedMethod.min_amount)
    ) {
      setAmount(value);
    } else {
      setAmount(value); // все равно обновим, но можем показать ошибку отдельно
    }
  };

  const getFilteredHistory = (type) => {
    return history.filter((operation) => {
      const typeMatch = operation.type === type;
      const operationDate = new Date(operation.datetime * 1000);

      // Проверка на соответствие типу
      if (!typeMatch) return false;

      // Проверка на соответствие статусу
      if (statusFilter !== "all" && operation.status !== statusFilter)
        return false;

      // Проверка на соответствие диапазону дат
      if (dateFrom && new Date(dateFrom) > operationDate) return false;
      if (dateTo && new Date(dateTo) < operationDate) return false;

      return true;
    });
  };
  const handleDateFromChange = (event) => {
    setDateFrom(event.target.value);
  };

  const handleDateToChange = (event) => {
    setDateTo(event.target.value);
  };

  // Добавляем обработчик для кнопок фильтра
  const handleFilterClick = (status) => {
    setStatusFilter(status);
  };

  const handleOperationClick = (type) => {
    setOperationType(type); // Устанавливаем тип операции
    setIsOperationVisible(true); // Делаем блок операций видимым
    setActiveOperation(type); // Устанавливаем активную кнопку
  };

  // Добавьте эту функцию в компонент Balans
  const getStatusClass = (status) => {
    switch (status) {
      case "checking":
        return "balans-history-status__checking";
      case "denied":
        return "balans-history-status__denied";
      case "success":
        return "balans-history-status__success";
      default:
        return "balans-history-status";
    }
  };
  const getStatusTranslation = (status) => {
    switch (status) {
      case "checking":
        return "В обработке";
      case "denied":
        return "Отклонено";
      case "success":
        return "Успешно";
      default:
        return status;
    }
  };

  const handleDeposit = async () => {
    const accessToken = sessionStorage.getItem('access_token');

    if (!accessToken || !selectedMethod || !amount) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      const response = await axios.post(
        "https://flyersendtest.ru/api/user/deposit/create/",
        {
          method: selectedMethod.method,
          amount: parseFloat(amount),
          paid_TEST: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.result && response.data.result.link) {
        window.open(response.data.result.link, "_blank");
        setAmount("");
        setSelectedMethod(null);
      } else {
        alert("Ссылка для оплаты не получена");
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      alert("Произошла ошибка при отправке запроса");
    }
  };

  const handleWithdraw = async () => {
    const accessToken = sessionStorage.getItem('access_token');

    if (!accessToken || !withdrawWallet || !withdrawAmount) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    const requestData = {
      address: withdrawWallet,
      amount: parseFloat(withdrawAmount),
      paid_TEST: false,
    };

    try {
      const response = await axios.post(
        "https://flyersendtest.ru/api/user/withdraw/create/",
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      console.log("Ответ сервера:", response.data);
      setWithdrawWallet("");
      setWithdrawAmount("");
      alert("Заявка на вывод средств создана");
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      alert("Произошла ошибка при отправке запроса");
    }
  };

  const handleTransfer = async () => {
    const accessToken = sessionStorage.getItem('access_token');

    if (!accessToken || !transferUserId || !transferAmount) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      const response = await axios.post(
        "https://flyersendtest.ru/api/user/transfer/",
        {
          to_id: transferUserId,
          amount: parseFloat(transferAmount),
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      console.log("Ответ сервера:", response.data);
      setTransferUserId("");
      setTransferAmount("");
      alert("Перевод выполнен успешно");
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      alert("Произошла ошибка при переводе средств");
    }
  };

  return (
    <div className="balans">
      <h4 className="balans-title">Баланс</h4>
      <div className="balans-flex">
        <div className="balans-container">
          <div className="balans-info">
            <Box className="balans-header">
              <h6 className="balans-amount">
                Баланс:{" "}
                <span
                  className="balans-amount-value"
                  style={{ color: "#1976d2" }}
                >
                  {Math.round(balance - retention)} USDT
                </span>
              </h6>
              <div className="balans-buttons">
                <button
                  className={`balans-button ${activeOperation === "Пополнить баланс" ? "active" : ""
                    }`}
                  onClick={() => handleOperationClick("Пополнить баланс")}
                >
                  Пополнить
                </button>
                <button
                  className={`balans-button ${activeOperation === "Вывод средств" ? "active" : ""
                    }`}
                  onClick={() => handleOperationClick("Вывод средств")}
                >
                  Вывести
                </button>
                <button
                  className={`balans-button ${activeOperation === "Перевод средств" ? "active" : ""
                    }`}
                  onClick={() => handleOperationClick("Перевод средств")}
                >
                  Перевести
                </button>
              </div>
              <div className="balans-method-mobile">
                {isOperationVisible && (
                  <div className="balans-operations">
                    <div className="top-up-container">
                      <h4 className="top-up-title">{operationType}</h4>
                      {operationType === "Пополнить баланс" && (
                        <>
                          <div
                            style={{
                              maxWidth: 400,
                              margin: "20px auto",
                              display: "flex",
                              flexDirection: "column",
                              gap: 20,
                            }}
                          >
                            <FormControl fullWidth>
                              <InputLabel id="method-select-label">
                                Способ пополнения
                              </InputLabel>
                              <Select
                                labelId="method-select-label"
                                value={selectedMethod?.method || ""}
                                onChange={handleMethodChange}
                                label="Способ пополнения"
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 400,
                                      overflowY: 'auto',
                                      zIndex: 1302,
                                    },
                                  },
                                }}
                              >
                                {methods.map((m) => (
                                  <MenuItem key={m.method} value={m.method}>
                                    {m.name || m.title || m.method}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {selectedMethod && (
                              <>
                                <Typography variant="body2">
                                  Минимальный платеж:{" "}
                                  <strong>
                                    {selectedMethod.min_amount || "не задан"}
                                  </strong>
                                </Typography>
                                <TextField
                                  label="Введите сумму"
                                  type="number"
                                  value={amount}
                                  onChange={handleAmountChange}
                                  error={
                                    selectedMethod.min_amount &&
                                    parseFloat(amount || 0) <
                                    parseFloat(selectedMethod.min_amount)
                                  }
                                  helperText={
                                    selectedMethod.min_amount &&
                                      parseFloat(amount || 0) <
                                      parseFloat(selectedMethod.min_amount)
                                      ? `Сумма должна быть не меньше ${selectedMethod.min_amount}`
                                      : ""
                                  }
                                  fullWidth
                                />
                              </>
                            )}
                          </div>
                          <button
                            className="top-up-button"
                            onClick={handleDeposit}
                            disabled={
                              !selectedMethod ||
                              !amount ||
                              (selectedMethod.min_amount &&
                                parseFloat(amount) <
                                parseFloat(selectedMethod.min_amount))
                            }
                          >
                            Пополнить баланс
                          </button>
                        </>
                      )}

                      {operationType === "Вывод средств" && (
                        <>
                          <div className="top-up-input-container">
                            <label htmlFor="wallet" className="top-up-label">
                              Адрес кошелька:
                            </label>
                            <input
                              type="text"
                              id="wallet"
                              name="wallet"
                              value={withdrawWallet}
                              onChange={(e) => setWithdrawWallet(e.target.value)}
                              placeholder="Введите адрес кошелька"
                              className="top-up-input"
                            />
                          </div>
                          <div className="top-up-input-container">
                            <label htmlFor="amount" className="top-up-label">
                              Введите сумму:
                            </label>
                            <input
                              type="number"
                              id="amount"
                              name="amount"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder="400"
                              className="top-up-input"
                            />
                          </div>
                          <button
                            className="top-up-button"
                            onClick={handleWithdraw}
                            disabled={!withdrawWallet || !withdrawAmount}
                          >
                            Вывести средства
                          </button>
                        </>
                      )}

                      {operationType === "Перевод средств" && (
                        <>
                          <div className="top-up-input-container">
                            <label htmlFor="userId" className="top-up-label">
                              ID пользователя:
                            </label>
                            <input
                              type="text"
                              id="userId"
                              name="userId"
                              value={transferUserId}
                              onChange={(e) => setTransferUserId(e.target.value)}
                              placeholder="ID пользователя"
                              className="top-up-input"
                            />
                          </div>
                          <div className="top-up-input-container">
                            <label htmlFor="amount" className="top-up-label">
                              Введите сумму:
                            </label>
                            <input
                              type="number"
                              id="amount"
                              name="amount"
                              value={transferAmount}
                              onChange={(e) => setTransferAmount(e.target.value)}
                              placeholder="400"
                              className="top-up-input"
                            />
                          </div>
                          <button
                            className="top-up-button"
                            onClick={handleTransfer}
                            disabled={!transferUserId || !transferAmount}
                          >
                            Перевести
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Box>

            {/* Фильтр по дате */}


            {/* Фильтры операций */}
            <div className="balans-operation-slider">
              <button
                className={`balans-operation-filter ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => handleFilterClick("all")}
              >
                Все операции
              </button>
              <button
                className={`balans-operation-filter ${statusFilter === "success" ? "active" : ""}`}
                onClick={() => handleFilterClick("success")}
              >
                Успешно
              </button>
              <button
                className={`balans-operation-filter ${statusFilter === "checking" ? "active" : ""}`}
                onClick={() => handleFilterClick("checking")}
              >
                В обработке
              </button>
              <button
                className={`balans-operation-filter ${statusFilter === "denied" ? "active" : ""}`}
                onClick={() => handleFilterClick("denied")}
              >
                Отменённые
              </button>
            </div>
            {/* <div className="balans-operation-slider">
              <div className="balans-operation-slider">
                <div className="balans-operation-filters">




                </div>
              </div>
            </div> */}
          </div>

          <div className="balans-history">
            <h6 className="balans-history-title">История пополнения</h6>
            {getFilteredHistory("deposit").map((operation, index) => (
              <div key={index} className="balans-history-item">
                <p className="balans-history-date">
                  Дата:{" "}
                  <span className="balans-history-date__span">
                    {new Date(operation.datetime * 1000).toLocaleDateString(
                      "ru-RU"
                    )}
                  </span>
                </p>
                <div className="balans-history-amount">
                  Сумма:{" "}
                  <span className="balans-history-date__span">
                    +{Math.round(operation.amount)} USDT
                  </span>
                </div>
                <div className="balans-history-status__success">Успешно</div>
              </div>
            ))}
          </div>

          {/* История выводов */}
          <div className="balans-history">
            <h6 className="balans-history-title">История выводов</h6>
            {getFilteredHistory("withdraw").map((operation, index) => (
              <div key={index} className="balans-history-item">
                <p className="balans-history-date">
                  Дата:{" "}
                  <span className="balans-history-date__span">
                    {new Date(operation.datetime * 1000).toLocaleDateString(
                      "ru-RU"
                    )}
                  </span>
                </p>
                <div className="balans-history-amount">
                  Сумма:{" "}
                  <span className="balans-history-date__span">
                    -{Math.round(operation.amount)} USDT
                  </span>
                </div>
                <div className={getStatusClass(operation.status)}>
                  {getStatusTranslation(operation.status)}
                </div>
              </div>
            ))}
          </div>

          {/* История переводов */}
          <div className="balans-history">
            <h6 className="balans-history-title">История переводов</h6>
            {getFilteredHistory("transfer").map((operation, index) => (
              <div key={index} className="balans-history-item">
                <p className="balans-history-date">
                  Дата:{" "}
                  <span className="balans-history-date__span">
                    {new Date(operation.datetime * 1000).toLocaleDateString(
                      "ru-RU"
                    )}
                  </span>
                </p>
                <div className="balans-history-amount">
                  Сумма:{" "}
                  <span className="balans-history-date__span">
                    {Math.round(operation.amount)} USDT
                  </span>
                </div>
                <div className="balans-history-status__success">Успешно</div>
              </div>
            ))}
          </div>
        </div>
        <div className="balans-method">
          {isOperationVisible && (
            <div className="balans-operations">
              <div className="top-up-container">
                <h4 className="top-up-title">{operationType}</h4>
                {operationType === "Пополнить баланс" && (
                  <>
                    <div
                      style={{
                        maxWidth: 400,
                        margin: "20px auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel id="method-select-label">
                          Способ пополнения
                        </InputLabel>
                        <Select
                          labelId="method-select-label"
                          value={selectedMethod?.method || ""}
                          onChange={handleMethodChange}
                          label="Способ пополнения"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 400,
                                overflowY: 'auto',
                                zIndex: 1302,
                              },
                            },
                          }}
                        >
                          {methods.map((m) => (
                            <MenuItem key={m.method} value={m.method}>
                              {m.name || m.title || m.method}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {selectedMethod && (
                        <>
                          <Typography variant="body2">
                            Минимальный платеж:{" "}
                            <strong>
                              {selectedMethod.min_amount || "не задан"}
                            </strong>
                          </Typography>
                          <TextField
                            label="Введите сумму"
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            error={
                              selectedMethod.min_amount &&
                              parseFloat(amount || 0) <
                              parseFloat(selectedMethod.min_amount)
                            }
                            helperText={
                              selectedMethod.min_amount &&
                                parseFloat(amount || 0) <
                                parseFloat(selectedMethod.min_amount)
                                ? `Сумма должна быть не меньше ${selectedMethod.min_amount}`
                                : ""
                            }
                            fullWidth
                          />
                        </>
                      )}
                    </div>
                    <button
                      className="top-up-button"
                      onClick={handleDeposit}
                      disabled={
                        !selectedMethod ||
                        !amount ||
                        (selectedMethod.min_amount &&
                          parseFloat(amount) <
                          parseFloat(selectedMethod.min_amount))
                      }
                    >
                      Пополнить баланс
                    </button>
                  </>
                )}

                {operationType === "Вывод средств" && (
                  <>
                    <div className="top-up-input-container">
                      <label htmlFor="wallet" className="top-up-label">
                        Адрес кошелька:
                      </label>
                      <input
                        type="text"
                        id="wallet"
                        name="wallet"
                        value={withdrawWallet}
                        onChange={(e) => setWithdrawWallet(e.target.value)}
                        placeholder="Введите адрес кошелька"
                        className="top-up-input"
                      />
                    </div>
                    <div className="top-up-input-container">
                      <label htmlFor="amount" className="top-up-label">
                        Введите сумму:
                      </label>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="400"
                        className="top-up-input"
                      />
                    </div>
                    <button
                      className="top-up-button"
                      onClick={handleWithdraw}
                      disabled={!withdrawWallet || !withdrawAmount}
                    >
                      Вывести средства
                    </button>
                  </>
                )}

                {operationType === "Перевод средств" && (
                  <>
                    <div className="top-up-input-container">
                      <label htmlFor="userId" className="top-up-label">
                        ID пользователя:
                      </label>
                      <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={transferUserId}
                        onChange={(e) => setTransferUserId(e.target.value)}
                        placeholder="ID пользователя"
                        className="top-up-input"
                      />
                    </div>
                    <div className="top-up-input-container">
                      <label htmlFor="amount" className="top-up-label">
                        Введите сумму:
                      </label>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="400"
                        className="top-up-input"
                      />
                    </div>
                    <button
                      className="top-up-button"
                      onClick={handleTransfer}
                      disabled={!transferUserId || !transferAmount}
                    >
                      Перевести
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* История пополнения */}
    </div>
  );
};

export default Balans;

