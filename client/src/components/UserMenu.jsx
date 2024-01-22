// UserMenu.jsx

import { useModal } from "./ModalProvider";

import Auth from "../utils/auth";

export default function UserMenu({ username, userId }) {
  const { closeModal } = useModal();

  const logout = (event) => {
    // Log user out and return them to welcome page
    event.preventDefault();
    Auth.logout();
    window.location.href = "/";
  };

  return (
    <div className="modal-content-jg">
      <a href="#" className="modal-close-button-jg" onClick={closeModal}>
        <span className="material-symbols-outlined">close</span>
      </a>
      <div className="user-profile-picture-jg">
        <a href="#" className="user-menu-link-jg">
          <img
            className="dashboard-profile-picture-jg"
            src="/test-prof-pic.jpg"
            alt="profile picture"
          />
        </a>
      </div>
      <h1>
        <a href="#" className="user-menu-link-jg">
          {username}
        </a>
      </h1>
      <a href="#" className="user-menu-link-jg">
        View/Edit Profile
      </a>
      <a href="#" className="user-menu-link-jg">
        View Stats
      </a>
      <a href="#" className="user-menu-link-jg">
        User Settings
      </a>
      <a href="#" className="user-menu-link-jg">
        Support Us
      </a>
      <a href="#" onClick={logout} className="user-menu-link-jg">
        Logout
      </a>
    </div>
  );
}
