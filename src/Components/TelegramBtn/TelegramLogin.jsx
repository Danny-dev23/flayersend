import { useEffect } from 'react';


const TelegramLogin = () => {
  useEffect(() => {
    // Глобальная функция, которую вызывает Telegram виджет
    window.TelegramLoginWidget = {
      dataOnauth: function (user) {
        // Сохраняем данные в sessionStorage
        sessionStorage.setItem("telegramUser", JSON.stringify(user));
        sessionStorage.setItem("user_id", JSON.stringify(user.id));
        sessionStorage.setItem("user_firstName", JSON.stringify(user.first_name));
        sessionStorage.setItem("user_username", JSON.stringify(user.username));
        sessionStorage.setItem("user_photo_url", JSON.stringify(user.photo_url));
        sessionStorage.setItem("user_id", JSON.stringify(user.id));
        sessionStorage.setItem("user_id", JSON.stringify(user.id));
        window.location.reload(); // Перезагружаем, чтобы Header обновился
      },
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.setAttribute("data-telegram-login", "FlyerSendBot"); // без @
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    document.getElementById("telegram-button").appendChild(script);
  }, []);

  return <div id="telegram-button"></div>;
};

export default TelegramLogin;
