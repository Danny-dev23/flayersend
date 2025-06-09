import React, { useState } from "react";
import "./mainQuestion.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const MainQuestion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const questions = [
    {
      question: "Как начать работу с платформой?",
      answer: "Ответ на вопрос 1",
    },
    {
      question: "Какие способы оплаты доступны?",
      answer:
        "Платформа работает с USDT. Вы можете пополнить или вывести баланс через интерфейс личного кабинета",
    },
    {
      question: "Как начать работу с платформой?",
      answer: "Ответ на вопрос 1",
    },
    {
      question: "Можно ли изменить параметры кампании после запуска?",
      answer: "Ответ на вопрос 3",
    },
  ];
  return (
    <div>
      <div className="faq-container">
        <h2 className="faq-title">Часто задаваемые вопросы</h2>
        <div className="faq-box">
          {questions.map((item, index) => (
            <div key={index} className="faq-item">
              <div
                className="faq-question"
                onClick={() => toggleQuestion(index)}
              >
                <span>{item.question}</span>
                <span
                  className={`arrow ${activeIndex === index ? "open" : ""}`}
                >
                  <KeyboardArrowDownIcon />
                </span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainQuestion;
