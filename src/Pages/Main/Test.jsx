import axios from "axios";
import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://85.198.111.189:8080";
const USER_ID = 123456; 

const Test = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [postText, setPostText] = useState("");
  const [postId, setPostId] = useState("");
  const [postData, setPostData] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [category, setCategory] = useState("");
  const [botNumber, setBotNumber] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");

  const [methods, setMethods] = useState([1]);
  const [method, setMethod] = useState('money');
  const [amount, setAmount] = useState('');
  const [depositResult, setDepositResult] = useState(null);

  const createUser = async (userId) => {
    try {
      const response = await axios.post(
        'http://85.198.111.189:8080/system/user/create',
        { user_id: USER_ID },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Пользователь создан:', response.data);
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
    }
  };


  // useEffect(() => {
  //   const fetchMethods = async () => {
  //     try {
  //       const response = await axios.get(`${API_BASE_URL}/client/user/deposit`);
  //       if (Array.isArray(response.data.result)) {
  //         setMethods(response.data.result);
  //       } else {
  //         console.error('Неверный формат данных:', response.data);
  //       }
  //     } catch (err) {
  //       console.error('Ошибка при получении методов пополнения:', err);
  //       setError('Не удалось получить методы пополнения');
  //     }
  //   };

  //   fetchMethods();
  // }, []);

  const handleDeposit = async () => {
    setError('');
    setDepositResult(null);

    const amountFloat = parseFloat(amount);
    if (!method || isNaN(amountFloat)) {
      setError('Пожалуйста, выберите метод и введите корректную сумму');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/client/user/deposit/create`, {
        method: method,
        amount: "200",
        paid_TEST: true, // если тестовый платеж — поставьте true
      });

      console.log('Ответ на создание депозита:', response.data);

      if (response.data && response.data.result) {
        setDepositResult(response.data.result);
      } else {
        setError('Ошибка при создании депозита');
      }
    } catch (err) {
      console.error('Ошибка при создании депозита:', err);
      setError('Не удалось создать депозит');
    }
  };

  // Создание пользователя
 
  // Получение информации о пользователе
  const fetchUser = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/client/user`,
        { id_: USER_ID },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Данные пользователя:', response.data);
      setUserData(response.data);
    } catch (err) {
      console.error('Ошибка при получении пользователя:', err);
      setError('Ошибка при получении пользователя');
    }
  };
  useEffect(() => {
    const fetchAndCreate = async () => {
      await createUser();     // сначала создаем
      await fetchUser();      // потом получаем
    };

    fetchAndCreate();
  }, []);

  // Создание поста
  const createPost = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/client/post/create`,
        {
          id_: USER_ID,
          text: postText,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // Если сервер вернул результат с постом
      if (response.data && response.data.result) {
        const { result } = response.data;
        if (result.link) {
          alert(`Пост успешно создан! Перейдите по ссылке: ${result.link}`);
          console.log("Ссылка на пост:", result.link);
          console.log("Post ID:", result.post_id);
        } else {
          console.error("Ошибка: нет ссылки на пост в ответе");
          alert("Ошибка при создании поста");
        }
      } else {
        console.error("Ошибка при создании поста:", response.data);
        alert("Ошибка при создании поста");
      }
    } catch (err) {
      console.error("Ошибка при создании поста:", err.response || err);
      alert("Ошибка при создании поста");
    }
  };

  // Получение поста по ID
  const fetchPost = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/client/post`,
        {
          id_: USER_ID,
          post_id: postId,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setPostData(response.data);
      console.log("Данные поста:", response.data);
    } catch (err) {
      console.error("Ошибка при получении поста:", err);
      alert("Ошибка при получении поста");
    }
  };

  useEffect(() => {
    const init = async () => {
      await createUser();
      await fetchUser();
    };
    init();
  }, []);

  // Функция для получения списка покупок
  const getPurchases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/client/purchases`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && Array.isArray(response.data.result)) {
        setPurchases(response.data.result);
      } else {
        console.error("Ошибка при получении покупок:", response.data);
      }
    } catch (err) {
      console.error("Ошибка при получении покупок:", err);
      setError("Не удалось получить список покупок");
    }
  };

  // Функция для создания новой покупки
  const createPurchase = async () => {
    // Преобразуем введенные значения в числа
    const categoryInt = parseInt(category);
    const botNumberInt = parseInt(botNumber);
    const priceInt = parseInt(price);
    const dateInt = parseInt(date);

    // Проверяем, что все обязательные данные корректны
    if (
      isNaN(categoryInt) ||
      isNaN(botNumberInt) ||
      isNaN(priceInt) ||
      isNaN(dateInt)
    ) {
      setError(
        "Пожалуйста, убедитесь, что все поля содержат числовые значения."
      );
      return;
    }

    try {
      console.log("Отправка запроса на создание покупки с данными:", {
        category: categoryInt,
        bot_number: botNumberInt,
        price: priceInt,
        post_id: postId,
        date: dateInt,
      });

      const response = await axios.post(
        `${API_BASE_URL}/client/purchases/create`,
        {
          category: categoryInt,
          bot_number: botNumberInt,
          price: priceInt,
          post_id: postId,
          date: dateInt,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Ответ при создании покупки:", response.data);

      if (response.data && response.data.result) {
        alert(`Покупка успешно создана с ID: ${response.data.result}`);
        setCategory("");
        setBotNumber("");
        setPrice("");
        setPostId("");
        setDate("");
        getPurchases(); // Перезагрузка списка покупок
      } else {
        setError("Ошибка при создании покупки");
      }
    } catch (err) {
      console.error("Ошибка при создании покупки:", err.response || err);
      setError("Не удалось создать покупку");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Информация о пользователе</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {userData && (
        <ul>
          <li>
            <strong>Баланс:</strong> {userData.balance}
          </li>
          <li>
            <strong>Удержания:</strong> {userData.retention}
          </li>
          <li>
            <strong>Заблокирован:</strong> {userData.banned ? "Да" : "Нет"}
          </li>
        </ul>
      )}

      <hr />

      <h2>Создать пост</h2>
      <textarea
        rows={4}
        placeholder="Введите текст поста"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button onClick={createPost}>Создать пост</button>

      <hr />

      <h2>Получить пост</h2>
      <input
        type="text"
        placeholder="Введите post_id"
        value={postId}
        onChange={(e) => setPostId(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={fetchPost}>Получить</button>

      {postData && (
        <div style={{ marginTop: 20 }}>
          <h3>Данные поста:</h3>
          <p>
            <strong>Текст:</strong> {postData.text}
          </p>
          <p>
            <strong>Файл:</strong> {postData.file || "нет"}
          </p>
          <p>
            <strong>Клавиатура:</strong>{" "}
            {JSON.stringify(postData.keyboard) || "нет"}
          </p>
        </div>
      )}

      <div>
        <h1>Управление покупками</h1>

        <div>
          <h2>Список покупок</h2>
          <button onClick={getPurchases}>Получить список покупок</button>
          <ul>
            {purchases.length > 0 ? (
              purchases.map((purchase, index) => (
                <li key={index}>
                  <p>Category: {purchase.category}</p>
                  <p>Bot Number: {purchase.bot_number}</p>
                  <p>Price: {purchase.price}</p>
                  <p>Post ID: {purchase.post_id}</p>
                  <p>Date: {purchase.date}</p>
                </li>
              ))
            ) : (
              <p>Нет покупок для отображения</p>
            )}
          </ul>
        </div>

        <div>
          <h2>Создать новую покупку</h2>
          <div>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Введите категорию"
            />
          </div>
          <div>
            <input
              type="text"
              value={botNumber}
              onChange={(e) => setBotNumber(e.target.value)}
              placeholder="Введите номер бота"
            />
          </div>
          <div>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Введите цену"
            />
          </div>
          <div>
            <input
              type="text"
              value={postId}
              onChange={(e) => setPostId(e.target.value)}
              placeholder="Введите ID поста"
            />
          </div>
          <div>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Введите дату"
            />
          </div>
          <button onClick={createPurchase}>Создать покупку</button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div>
      <h1>Пополнение баланса</h1>

      <div>
        <label>Метод пополнения:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="">Выберите метод</option>
          {methods.map((m, idx) => (
            <option key={idx} value={m.method || m.name || m}>
              {m.method || m.name || m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Сумма:</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Введите сумму"
        />
      </div>

      <button onClick={handleDeposit}>Создать депозит</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {depositResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Депозит создан:</h3>
          <p><strong>Сумма:</strong> {depositResult.amount}</p>
          <p><strong>Адрес:</strong> {depositResult.address}</p>
          {depositResult.link && (
            <p>
              <strong>Ссылка:</strong>{' '}
              <a href={depositResult.link} target="_blank" rel="noopener noreferrer">
                Перейти к оплате
              </a>
            </p>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default Test;
