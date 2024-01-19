import React, { useState } from "react";

const PopUpModal = ({ isOpen, onClose, modalConfig }) => {
  const [formData, setFormData] = useState({});

  const handleButtonClick = (choice) => {
    onClose && onClose(choice, formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay-jg">
          <div className="modal-jg">
            {modalConfig.content(handleInputChange)}
            <div className="modal-button-tray-jg">
              {modalConfig.buttons.map((button, index) => (
                <button
                  key={index}
                  className="button-jg modal-button-jg"
                  onClick={() => handleButtonClick(button.label)}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopUpModal;
