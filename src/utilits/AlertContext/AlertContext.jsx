import React, { createContext, useState, useEffect } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    let timer;
    if (alert.open) {
      timer = setTimeout(() => {
        setAlert({ ...alert, open: false });
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [alert.open]);

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, handleClose }}>
      {children}
    </AlertContext.Provider>
  );
};