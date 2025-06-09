import React, { useContext, useState } from "react";
import "./sorting.css";
import botImage from "../../assents/images/botImage.png";
import SortingImage from "../../assents/images/sorting-modal__img.png";
import { CartContext } from "../../utilits/CartContext/CartContext";
import { AlertContext } from "../../utilits/AlertContext/AlertContext";
import { StepContext } from "../../utilits/StepContext/StepContext";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  MobileStepper,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";

const Sorting = () => {
  const [postType, setPostType] = useState("ordinary");
  const [audience, setAudience] = useState("men");
  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("");
  const [visibleItems, setVisibleItems] = useState(6);
  const { addToCart } = useContext(CartContext);
  const { showAlert } = useContext(AlertContext);
  const { setStep } = useContext(StepContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const slides = [
    () => (
      <div className="sorting-modal slide-1">
        <img src={SortingImage} alt="" className="slide-1__image" />
        <strong className="slide-modal__title">Умный подбор</strong>
        <p className="slide-modal__description">
          Наш сервис поможет вам подобрать подходящих ботов под ваш бюджет и
          целевую аудиторию
        </p>
        <button
          className="slide-modal__button"
          variant="contained"
          fullWidth
          onClick={handleNext} // Переход к следующему слайду
        >
          Начать подбор
        </button>
      </div>
    ),
    () => (
      <div className="sorting-modal slide-2">
        <strong className="slide-modal__title">Тип поста</strong>
        <p className="slide-modal__title-2">
          Выберите, какой тип размещения вам нужен
        </p>
        <div className="sorting-modal__button-group">
          <button
            className={`sorting-modal__button-2 ${
              postType === "ordinary" ? "active" : ""
            }`}
            onClick={() => setPostType("ordinary")}
          >
            <p className="sorting-modal__button-2__text">Обычный</p>
          </button>
          <button
            className={`sorting-modal__button-2 ${
              postType === "gambling" ? "active" : ""
            }`}
            onClick={() => setPostType("gambling")}
          >
            <p className="sorting-modal__button-2__text">Гемблинг</p>
          </button>
        </div>
      </div>
    ),
    () => (
      <div className="sorting-modal slide-3">
        <strong className="slide-modal__title">Бюджет</strong>
        <p className="slide-modal__title-2">
          Выберите, какой тип размещения вам нужен
        </p>
        <div className="slide-modal__group">
          <input
            type="text"
            className="slide-modal__group-input"
            placeholder="От"
          />
          <input
            type="text"
            className="slide-modal__group-input"
            placeholder="До"
          />
        </div>
      </div>
    ),
    () => (
      <div className="sorting-modal slide-4">
        <strong className="slide-modal__title">Целевая аудитория</strong>
        <p className="slide-modal__title-2">
          Введите диапазон цен, который вам удобен
        </p>
        <div className="sorting-modal__button-group">
          <button
            className={`sorting-modal__button-2 ${
              postType === "ordinary" ? "active" : ""
            }`}
            onClick={() => setPostType("ordinary")}
          >
            <p className="sorting-modal__button-2__text">Универсально</p>
          </button>
          <button
            className={`sorting-modal__button-2 ${
              postType === "men" ? "active" : ""
            }`}
            onClick={() => setPostType("men")}
          >
            <p className="sorting-modal__button-2__text">Мужчины</p>
          </button>
          <button
            className={`sorting-modal__button-2 ${
              postType === "gambling" ? "active" : ""
            }`}
            onClick={() => setPostType("gambling")}
          >
            <p className="sorting-modal__button-2__text">Женщины</p>
          </button>
        </div>
      </div>
    ),
    () => (
      <div className="sorting-modal slide-4">
        <strong className="slide-modal__title">Загрузка файла</strong>
        <p className="slide-modal__title-2">
          Загрузите свою базу пользователей
        </p>
        <div className="sorting-modal__button-group">
          <label className="custom-file-upload">
            <input type="file" />
            <span>Загрузка файла</span>
            <FileUploadIcon />
          </label>
        </div>
      </div>
    ),
  ];

  const handleNext = () => {
    if (activeStep === slides.length - 1) {
      setModalOpen(false);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    showAlert("Бот добавлен в корзину!", "success");
  };

  const handleShowMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 6);
  };

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
    {
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
      id: 9,
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
      id: 10,
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
      id: 11,
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
      id: 12,
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
      id: 13,
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
      id: 14,
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
      id: 15,
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
    // Add more items here
  ];

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sorting-container">
      <Dialog
        open={modalOpen}
        fullWidth
        maxWidth="sm"
        className="sorting-modal__dialog"
      >
        <DialogContent className="sorting-modal__content">
          <div className="sorting-modal__close" onClick={() => { setStep(1); setActiveStep(0); setModalOpen(false); }}>
            <CloseIcon />
          </div>
          <Box minHeight={200} py={2}>
            {slides[activeStep]()}
          </Box>

          {/* Нижняя панель с точками и кнопками */}
          {activeStep > 0 && (
            <MobileStepper
              variant="dots"
              steps={slides.length}
              position="static"
              activeStep={activeStep}
              nextButton={
                <button
                  className="modal-stepper__button-next"
                  size="small"
                  onClick={handleNext}
                >
                  {activeStep === slides.length - 1 ? "Далее" : "Далее"}
                </button>
              }
              backButton={
                <button
                  className="modal-stepper__button-prev"
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Назад
                </button>
              }
              sx={{ justifyContent: "space-between", mt: 2 }}
            />
          )}
        </DialogContent>
      </Dialog>
      {!modalOpen && (
        <div className="">
          <h2>Каталог</h2>
          <div className="sorting-options">
            <button
              className="sorting-options__button"
              onClick={() => {
                setModalOpen(true);
                setActiveStep(1);
              }}
            >
              Подобрать бота
            </button>
          </div>
          <div className="catalog-box">
            {filteredItems.slice(0, visibleItems).map((item) => (
              <div key={item.id} className="catalog-item">
                <div className="">
                  <img
                    src={item.image}
                    alt={item.category}
                    className="item-image"
                  />
                </div>
                <div className="item-text">
                  <div className="item-details">
                    <div className="item-text__details">
                      <h3 className="item-title">
                        {item.title}{" "}
                        <span className="item-rating">
                          <span className="item-rating__star">★</span>{" "}
                          {item.rating}
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
                        RU:{" "}
                        <span className="item-stats__text-span">{item.ru}</span>{" "}
                      </span>
                      <span className="item-stats__text">
                        Покупок:{" "}
                        <span className="item-stats__text-span">
                          {item.purchases}
                        </span>
                      </span>
                      <span className="item-stats__text">
                        МЦА:{" "}
                        <span className="item-stats__text-span">
                          {item.mca}
                        </span>{" "}
                      </span>
                    </div>
                    <button
                      className="item-price"
                      onClick={() => handleAddToCart(item)}
                    >
                      {item.price}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            {visibleItems < filteredItems.length && (
              <div className="show-more">
                <button className="show-more-button" onClick={handleShowMore}>
                  Показать еще
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sorting;
