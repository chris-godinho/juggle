// SidePanelMenu.jsx

import { useDataContext } from "../contextproviders/DataContext";
import { useModal } from "../contextproviders/ModalProvider.jsx";

import UserMenu from "../usermenu/UserMenu.jsx";
import NewEvent from "./NewEvent.jsx";

import Auth from "../../utils/auth";

export default function SidePanelMenu() {
  const { openModal } = useModal();

  const { username, userId, eventSubtypes, eventsRefetch } = useDataContext();

  const logout = (event) => {
    // Log user out and return them to welcome page
    event.preventDefault();
    Auth.logout();
    window.location.href = "/";
  };

  const openMenuModal = (menuOption) => {
    if (menuOption === "NewEvent") {
      openModal(
        <NewEvent
          eventSubtypes={eventSubtypes}
          handleNewEventModalClose={handleNewEventModalClose}
          userId={userId}
        />
      );
    } else {
      openModal(
        <UserMenu
          username={username}
          userId={userId}
          modalContent={menuOption}
        />
      );
    }
  };

  const handleNewEventModalClose = () => {
    eventsRefetch();
  };

  return (
    <>
      <a
        href="#"
        className="side-panel-username-jg text-link-jg"
        onClick={() => openMenuModal("UserProfile")}
      >
        {username}
      </a>
      <a
        href="#"
        className="side-panel-link-jg"
        onClick={() => openMenuModal("NewEvent")}
      >
        New Event
      </a>
      <a
        href="#"
        className="side-panel-link-jg"
        onClick={() => openMenuModal("UserProfile")}
      >
        View/Edit Profile
      </a>
      <a
        href="#"
        className="side-panel-link-jg"
        onClick={() => openMenuModal("WorkLifeStats")}
      >
        View Stats
      </a>
      <a
        href="#"
        className="side-panel-link-jg"
        onClick={() => openMenuModal("Settings")}
      >
        User Settings
      </a>
      <a
        href="#"
        className="side-panel-link-jg"
        onClick={() => openMenuModal("Donate")}
      >
        Support Us
      </a>
      <a
        href="#"
        className="side-panel-link-jg"
        onClick={() => openMenuModal("AboutUs")}
      >
        About Us
      </a>
      <a
        href="#"
        className="side-panel-link-jg"
        onClick={() => openMenuModal("ContactUs")}
      >
        Contact
      </a>
      <a href="#" className="side-panel-link-jg" onClick={logout}>
        Logout
      </a>
    </>
  );
}
