// UserMenu.jsx

import { useState, useEffect } from "react";

import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import Auth from "../../utils/auth";

export default function UserMenuOptions({ username, setUserMenuModalContent }) {
  const { userSettings, isLoadingSettings } = useUserSettings();

  const [profilePictureUrl, setProfilePictureUrl] = useState(
    "/default-profile-picture.png"
  );

  useEffect(() => {
    if (!isLoadingSettings) {
      setProfilePictureUrl(
        userSettings?.profilePictureUrl || "/default-profile-picture.png"
      );
    }
  }, [isLoadingSettings, userSettings]);

  const logout = (event) => {
    // Log user out and return them to welcome page
    event.preventDefault();
    Auth.logout();
    window.location.href = "/";
  };

  // TODO: Remove this useEffect after testing
  useEffect(() => {
    console.log("[UserMenuOptions.jsx] profilePictureUrl: ", profilePictureUrl);
  }, [profilePictureUrl]);

  return (
    <div className="modal-inner-content-jg">
      <div className="user-profile-picture-jg work-border-jg work-border-link-jg">
        <a href="#">
          <img
            className="dashboard-profile-picture-jg"
            src={profilePictureUrl}
            alt="profile picture"
            onClick={() => setUserMenuModalContent("UserProfile")}
          />
        </a>
      </div>
      <h1 className="user-menu-username-jg">
        <a href="#" onClick={() => setUserMenuModalContent("UserProfile")}>
          {username}
        </a>
      </h1>
      <a
        href="#"
        className="user-menu-link-jg"
        onClick={() => setUserMenuModalContent("UserProfile")}
      >
        View/Edit Profile
      </a>
      <a
        href="#"
        className="user-menu-link-jg"
        onClick={() => setUserMenuModalContent("WorkLifeStats")}
      >
        View Stats
      </a>
      <a
        href="#"
        className="user-menu-link-jg"
        onClick={() => setUserMenuModalContent("Settings")}
      >
        User Settings
      </a>
      <a
        href="#"
        className="user-menu-link-jg"
        onClick={() => setUserMenuModalContent("Donate")}
      >
        Support Us
      </a>
      <a
        href="#"
        className="user-menu-link-jg"
        onClick={() => setUserMenuModalContent("AboutUs")}
      >
        About Us
      </a>
      <a
        href="#"
        className="user-menu-link-jg"
        onClick={() => setUserMenuModalContent("ContactUs")}
      >
        Contact
      </a>
      <a href="#" onClick={logout}>
        Logout
      </a>
    </div>
  );
}
