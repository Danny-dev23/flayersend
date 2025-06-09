import React from "react";
import FooterLogo from "../../assents/images/LogoFooter.png";
import "./footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-logo">
        <img src={FooterLogo} alt="" />
        <p className="footer-logo__text">2025 FLYER. Все права защищены</p>
      </div>
      <div className="footer-items">
        <p className="footer-items__text">Политика конфиденциальности </p>
        <p className="footer-items__text">Условия использования</p>
      </div>
      <div className="footer-items">
        <p className="footer-items__text">Официальный бот</p>
        <p className="footer-items__text text-blue">@FlyerSendBot</p>
      </div>
      <div className="footer-items">
        <p className="footer-items__text">Официальный поддержка</p>
        <p className="footer-items__text text-blue">@FlyerServiceSupport</p>
      </div>
    </div>
  );
};

export default Footer;
