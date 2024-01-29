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
  const [userSettings, setUserSettings] = useState({});

  const [updateUserSettings] = useMutation(UPDATE_USER_SETTINGS);

  let username;
  try {
    const userProfile = AuthService.getProfile();
    username = userProfile?.data?.username;
  } catch (error) {
    // Handle the error gracefully, set username to null, or take appropriate action
    username = null;
  }

  const { loading, error, data } = useQuery(QUERY_USER, {
    skip: !username,
    variables: { username: username },
  });

  useEffect(() => {
    if (!loading && !error && data) {
      setUserSettings(data.user);
    }
  }, [loading, error, data]);

  const updateProviderUserSettings = async (newSettings) => {
    setUserSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));

    try {
      const { data } = await updateUserSettings({
        variables: { ...newSettings },
      });
    } catch (err) {
      console.error(err);
    }
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

  return (
    <UserSettingsContext.Provider
      value={{ userSettings, updateProviderUserSettings }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};
