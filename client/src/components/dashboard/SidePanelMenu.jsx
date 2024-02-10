// SidePanelMenu.jsx

import { useDataContext } from "../contextproviders/DataContext";
import { useModal } from "../contextproviders/ModalProvider.jsx";

import UserMenu from "../usermenu/UserMenu.jsx";
import NewEvent from "./NewEvent.jsx";

import Auth from "../../utils/auth";

export default function SidePanelMenu({ refreshResponsiveGrid }) {
  const { openModal } = useModal();

  const { fetchedSettings, eventsRefetch } = useDataContext();

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
          eventSubtypes={fetchedSettings?.eventSubtypes}
          handleNewEventModalClose={handleNewEventModalClose}
          userId={fetchedSettings?.userId}
          showStats={fetchedSettings?.showStats}
          refreshResponsiveGrid={refreshResponsiveGrid}
        />
      );
    } else {
      openModal(
        <UserMenu
          username={fetchedSettings?.username}
          userId={fetchedSettings?.userId}
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
        {fetchedSettings?.username}
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
      {fetchedSettings?.showStats && (
        <a
          href="#"
          className="side-panel-link-jg"
          onClick={() => openMenuModal("WorkLifeStats")}
        >
          View Stats
        </a>
      )}
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
