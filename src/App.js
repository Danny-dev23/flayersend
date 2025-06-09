import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header.jsx";
import routes from "./router.js";
import Footer from "./Components/Footer/Footer.jsx";
import Home from "./Pages/Home/home.jsx"; // Импортируем Home
import { AlertContext } from "./utilits/AlertContext/AlertContext.jsx";
import { Alert, Snackbar } from "@mui/material";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const { alert, handleClose } = useContext(AlertContext);
  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  return (
    <Router>
      <Header cartItems={cartItems} />
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
      <div className="">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} {...route} />
          ))}
          <Route path="/home" element={<Home addToCart={addToCart} />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
