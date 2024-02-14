// ModalProvider.jsx
// Provides a pop-up modal functionality

import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  // Stores the HTML content to be displayed in the modal
  const [modalContent, setModalContent] = useState(null);
  // Stores modal open/closed state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isModalOpen && modalContent && (
        <div className="modal-overlay-jg">
            {modalContent}
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
