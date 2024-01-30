// UserMenu.jsx

import React, { useState } from "react";

import DataContext from "../contextproviders/DataContext.jsx";
import { useModal } from "../contextproviders/ModalProvider";
import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import UserMenuOptions from "./UserMenuOptions";
import UserProfile from "./UserProfile";
import WorkLifeStats from "./WorkLifeStats";
import Settings from "./Settings";
import Donate from "./Donate";
import AboutUs from "./AboutUs.jsx";
import ContactUs from "./ContactUs.jsx";

export default function UserMenu({ username, userId, modalContent }) {
  const [userMenuModalContent, setUserMenuModalContent] =
    useState(modalContent);
  const [userDeleted, setUserDeleted] = useState(false);

  const { updateProviderUserSettings, userSettings } = useUserSettings();

  const [formData, setFormData] = useState({});

  const { closeModal } = useModal();

  const handleFormSubmit = async (event) => {
    console.log("[UserMenu.jsx] handleFormSubmit()");
    console.log("[UserMenu.jsx] formData: ", formData);

    updateProviderUserSettings(formData?.user);

    setFormData({});
  };

  const backToMenu = (event) => {
    if (userMenuModalContent === "Settings") {
      handleFormSubmit();
    }
    setUserMenuModalContent("UserMenuOptions");
  };

  const checkCloseModal = (event) => {
    if (userMenuModalContent === "Settings") {
      handleFormSubmit();
    }
    closeModal();
  };

  const renderContent = () => {
    switch (userMenuModalContent) {
      case "UserMenuOptions":
        return (
          <UserMenuOptions
            username={username}
            setUserMenuModalContent={setUserMenuModalContent}
          />
        );
      case "UserProfile":
        return (
          <UserProfile
            username={username}
            backToMenu={backToMenu}
            setUserDeleted={setUserDeleted}
          />
        );
      case "WorkLifeStats":
        return <WorkLifeStats />;
      case "Settings":
        return <Settings />;
      case "Donate":
        return <Donate />;
      case "AboutUs":
        return <AboutUs />;
      case "ContactUs":
        return <ContactUs />;
      default:
        return null;
    }
  };

  return (
    <DataContext.Provider value={{ formData, setFormData, userSettings }}>
      <div
        className={
          userMenuModalContent === "Settings"
            ? "modal-jg settings-modal-container-jg"
            : "modal-jg user-menu-modal-container-jg"
        }
      >
        <div className="modal-content-jg">
          {!userDeleted && (
            <>
              <a
                href="#"
                className={
                  userMenuModalContent === "UserMenuOptions"
                    ? "modal-back-button-jg hidden-jg"
                    : "modal-back-button-jg"
                }
                onClick={backToMenu}
              >
                <span className="material-symbols-outlined">
                  arrow_back_ios_new
                </span>
              </a>
              <a
                href="#"
                className="modal-close-button-jg"
                onClick={checkCloseModal}
              >
                <span className="material-symbols-outlined">close</span>
              </a>
            </>
          )}
          {renderContent()}
        </div>
      </div>
    </DataContext.Provider>
  );
}
