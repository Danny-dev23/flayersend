import React, { createContext, useState, useEffect } from 'react';

export const StepContext = createContext();

export const StepProvider = ({ children }) => {
  // При инициализации читаем step из localStorage, если есть
  const getInitialStep = () => {
    const saved = localStorage.getItem('currentStep');
    return saved ? Number(saved) : 1;
  };

  const [step, setStepState] = useState(getInitialStep);

  // При каждом изменении step сохраняем его в localStorage
  useEffect(() => {
    localStorage.setItem('currentStep', step);
  }, [step]);

  // Обёртка для setStep, чтобы всегда сохранять в localStorage
  const setStep = (newStep) => {
    setStepState(newStep);
    localStorage.setItem('currentStep', newStep);
  };

  return (
    <StepContext.Provider value={{ step, setStep }}>
      {children}
    </StepContext.Provider>
  );
};