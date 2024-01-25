// UserMenu.jsx

import React, { useState } from "react";

import { useModal } from "./ModalProvider";

import UserMenuOptions from "./UserMenuOptions";
import UserProfile from "./UserProfile";
import WorkLifeStats from "./WorkLifeStats";
import Settings from "./Settings";
import Donate from "./Donate";

export default function UserMenu({ username, userId }) {
  const [userMenuModalContent, setUserMenuModalContent] =
    useState("UserMenuOptions");
  const [userDeleted, setUserDeleted] = useState(false);

  const { closeModal } = useModal();

  const backToMenu = (event) => {
    setUserMenuModalContent("UserMenuOptions");
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
        return <UserProfile username={username} backToMenu={backToMenu} setUserDeleted={setUserDeleted} />;
      case "WorkLifeStats":
        return <WorkLifeStats />;
      case "Settings":
        return <Settings />;
      case "Donate":
        return <Donate />;
      default:
        return null;
    }
  };

  return (
    <div className={userMenuModalContent === "Settings" ? "modal-jg settings-modal-container-jg" : "modal-jg user-menu-modal-container-jg"}>
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
            <a href="#" className="modal-close-button-jg" onClick={closeModal}>
              <span className="material-symbols-outlined">close</span>
            </a>
          </>
        )}
        {renderContent()}
      </div>
    </div>
  );
}
