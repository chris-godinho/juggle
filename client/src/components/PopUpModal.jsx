import React, { useEffect } from "react";

const PopUpModal = ({
  isOpen,
  onClose,
  modalConfig,
  eventSubtypes,
  formData,
  setFormData,
}) => {
  const handleButtonClick = (choice) => {
    onClose && onClose(choice, formData);
  };

  const handleInputChange = (e) => {
    console.log(
      "[PopUpModal.jsx] Current formData (before handleInputChange):",
      formData
    );
    const { name, value } = e.target;
    if (name === "subtype") {
      const selectedSubtype = eventSubtypes.find(
        (subtype) => subtype.subtype.toLowerCase() === value.toLowerCase()
      );
      if (selectedSubtype) {
        // Handle category change and update corresponding type
        const correspondingType = selectedSubtype.parentType;
        setFormData((prevData) => {
          const newData = {
            ...prevData,
            [name]: value,
            type: correspondingType,
          };
          return newData;
        });
      }
    } else if (name === "type") {
      if (formData.subtype) {
        // Handle category change and update corresponding type
        const correspondingSubtype = eventSubtypes.find(
          (subtype) => subtype.parentType.toLowerCase() === value.toLowerCase()
        );
        if (correspondingSubtype !== formData.subtype) {
          setFormData((prevData) => {
            const newData = {
              ...prevData,
              [name]: value,
              subtype: "",
            };
            return newData;
          });
        }
      }
    }
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      return newData;
    });
    console.log(
      "[PopUpModal.jsx] Current formData (after handleInputChange):",
      formData
    );
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
