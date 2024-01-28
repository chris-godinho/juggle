import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { QUERY_USER } from "../../utils/queries.js";
import { UPDATE_USER_SETTINGS } from "../../utils/mutations.js";

import LoadingSpinner from "../other/LoadingSpinner.jsx";

import AuthService from "../../utils/auth.js";

const UserSettingsContext = createContext();

const providerSpinnerStyle = {
  spinnerWidth: "100%",
  spinnerHeight: "100vh",
  spinnerElWidthHeight: "150px",
};

export const useUserSettings = () => {
  return useContext(UserSettingsContext);
};

export const UserSettingsProvider = ({ children }) => {
  console.log("[UserSettingsProvider.jsx] Initializing...");

  const [userSettings, setUserSettings] = useState({});

  const [updateUserSettings] = useMutation(UPDATE_USER_SETTINGS);

  let username;
  try {
    const userProfile = AuthService.getProfile();
    username = userProfile?.data?.username;
    console.log("[UserSettingsProvider.jsx] userProfile:", userProfile);
    console.log("[UserSettingsProvider.jsx] username:", username);
  } catch (error) {
    console.log("[UserSettingsProvider.jsx] No user logged in. Loading default settings...");
    // Handle the error gracefully, set username to null, or take appropriate action
    username = null;
  }

  const { loading, error, data } = useQuery(QUERY_USER, {
    skip: !username,
    variables: { username: username },
  });

  useEffect(() => {
    console.log("[UserSettingsProvider.jsx] useEffect hook triggered");
    if (!loading && !error && data) {
      console.log("[UserSettingsProvider.jsx] data:", data);
      setUserSettings(data.user);
    }
  }, [loading, error, data]);

  const updateProviderUserSettings = async (newSettings) => {
    console.log("[UserSettingsProvider.jsx] newSettings:", newSettings);

    setUserSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));

    try {
      const { data } = await updateUserSettings({
        variables: { ...newSettings },
      });
    
      console.log("[UserSettingsProvider.jsx] data:", data);
    } catch (err) {
      console.error(err);
    }

    console.log("[UserSettingsProvider.jsx] userSettings:", userSettings);
  };

  if (loading) {
    // Render loading state or a fallback UI while fetching user settings
    return (
      <div className="dark-background-jg">
        <LoadingSpinner
          spinnerStyle={providerSpinnerStyle}
          spinnerElWidthHeight="100px"
        />
      </div>
    );
  }

  console.log("[UserSettingsProvider.jsx] userSettings:", userSettings);

  return (
    <UserSettingsContext.Provider value={{ userSettings, updateProviderUserSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};
