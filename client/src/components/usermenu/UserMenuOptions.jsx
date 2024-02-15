// UserMenuOptions.jsx
// Options for user menu modal

import { useState, useEffect } from "react";

import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import DefaultProfilePicture from "../other/DefaultProfilePicture.jsx";

import Auth from "../../utils/auth";

export default function UserMenuOptions({ username, setUserMenuModalContent }) {
  const { userSettings, isLoadingSettings } = useUserSettings();

  // Initialize state for profile picture URL
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    null
  );

  // Set profile picture URL after user settings are loaded
  useEffect(() => {
    if (!isLoadingSettings) {
      setProfilePictureUrl(
        userSettings?.profilePictureUrl || null
      );
    }
  }, [isLoadingSettings, userSettings]);

  const logout = (event) => {
    // Log user out and return them to welcome page
    event.preventDefault();
    Auth.logout();
    window.location.href = "/";
  };

  return (
    <div className="modal-inner-content-jg">
      <div className="user-profile-picture-jg work-border-jg work-border-link-jg">
        <a href="#">
          {profilePictureUrl ? (
          <img
            className="dashboard-profile-picture-jg"
            src={profilePictureUrl}
            alt="profile picture"
            onClick={() => setUserMenuModalContent("UserProfile")}
          />
          ) : (
          <DefaultProfilePicture />
          )}
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
      {userSettings?.statSettings?.showStats && (
        <a
          href="#"
          className="user-menu-link-jg"
          onClick={() => setUserMenuModalContent("WorkLifeStats")}
        >
          View Stats
        </a>
      )}
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
