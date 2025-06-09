import React, { useContext, useEffect, useState } from "react";
import "./catalog.css";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CartContext } from "../../utilits/CartContext/CartContext";
import { AlertContext } from "../../utilits/AlertContext/AlertContext";
import BotIcon from "../../assents/images/bot.png"

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleItems, setVisibleItems] = useState(5);
  const [items, setItems] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { showAlert } = useContext(AlertContext);
  const [categories, setCategories] = useState({});
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);





  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5NzI2NTc3LCJpYXQiOjE3NDkxMjE3NzcsImp0aSI6Ijg0NjgxYTFjNzQ0MjRiZTM5MDA0MGI3MjZiMDBiOGQxIiwidXNlcl9pZCI6NjU5NjYzNDcxLCJ0ZWxlZ3JhbV9pZCI6NjU5NjYzNDcxLCJmaXJzdF9uYW1lIjoiRGFubnkiLCJsYXN0X25hbWUiOm51bGwsInVzZXJuYW1lIjoiRGFubnlfZGV2X2wiLCJwaG90b191cmwiOiJodHRwczovL3QubWUvaS91c2VycGljLzMyMC9fcXBmSjZqOGFVVkNSU2FZVHp3TXlLUjRxWUZjVURWbmRUck5ZLUlvc05jLmpwZyJ9.zFKyjRwOA_mK5JFTzH-4ZgxrMql50HJVP2FTcYMbOuk";

  useEffect(() => {
    const fetchCategoryBots = async (categoryId) => {
      const response = await fetch(
        `https://flyersendtest.ru/api/bot/catalog/?category=${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Ошибка загрузки категории ${categoryId}`);
      }
      const data = await response.json();
      return data.result;
    };

    const loadBots = async () => {
      try {
        const [cat1Bots] = await Promise.all([
          fetchCategoryBots(1)
        ]);
        setItems([...cat1Bots]);
      } catch (err) {
        console.error(err);
        showAlert("Ошибка загрузки каталога", "error");
      }
    };

    loadBots();
  }, [token, showAlert]);

  const fetchBots = async () => {
    const accessToken = sessionStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('https://flyersendtest.ru/api/user/bots/', {
        headers: {
          'Authorization': `Bearer ${token}`
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
    fetchBots();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleAddToCart = (item) => {
    addToCart(item);
    console.log(item);
    showAlert("Бот добавлен в корзину!", "success");
  };
  const handleShowMore = () => setVisibleItems((prev) => prev + 5);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="catalog">
      <h3 className="catalog-title">Каталог</h3>
      <div className="catalog-header">
        <TextField
          variant="outlined"
          placeholder="Поиск..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className="catalog-box">
        {filteredItems.slice(0, visibleItems).map((item) => (
          <div key={item.id || item.number} className="catalog-item">
            <div className="item-text">
              <div className="item-details">
                {item.photo !== null ? (
                  <img src={item.photo} alt="Бот"  className="item-image" />
                ) : (
                  <img src={BotIcon} alt="Бот"  className="item-image" />
                )}
                <div className="item-text__details">
                  <h3 className="item-title">
                    {item.name}
                    <span className="item-rating">
                      <span className="item-rating__star">★</span>{" "}
                      {item.rate_count}
                    </span>
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

              <div className="item-stats">
                <div className="item-stats__box">
                  <span className="item-stats__text">
                    Аудитория:{" "}
                    <span className="item-stats__text-span">
                      {item.file?.users ?? "-"}
                    </span>
                  </span>
                  <span className="item-stats__text">
                    RU: <span className="item-stats__text-span">{item.data?.ru ?? "-"}</span>
                  </span>
                  <span className="item-stats__text">
                    Покупок:{" "}
                    <span className="item-stats__text-span">
                      {item.data?.purchases ?? 0}
                    </span>
                  </span>
                  <span className="item-stats__text">
                    МЦА: <span className="item-stats__text-span">{item.data?.men ?? "-"}</span>
                  </span>
                </div>
                <button
                  className="item-price"
                  onClick={() => handleAddToCart(item)}
                >
                  USDT {item.price}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleItems < filteredItems.length && (
        <div className="show-more">
          <button className="show-more-button" onClick={handleShowMore}>
            Показать еще
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
