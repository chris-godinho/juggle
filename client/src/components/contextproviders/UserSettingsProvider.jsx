import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { QUERY_USER } from "../../utils/queries.js";
import { UPDATE_USER_SETTINGS } from "../../utils/mutations.js";

import LoadingSpinner from "../other/LoadingSpinner.jsx";

import { removeTypename } from "../../utils/helpers.js";
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
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const [updateUserSettings] = useMutation(UPDATE_USER_SETTINGS);

  let username;
  try {
    const userProfile = AuthService.getProfile();
    username = userProfile?.data?.username;
  } catch (error) {
    username = null;
  }

  const { loading, error, data } = useQuery(QUERY_USER, {
    skip: !username,
    variables: { username: username },
  });

  useEffect(() => {
    if (!loading && !error && data) {
      console.log("[UserSettingsProvider.jsx] User Settings query finished. data:", data);
      setUserSettings(data.user);
      setIsLoadingSettings(false);
      console.log("[UserSettingsProvider.jsx] isLoadingSettings set to false");
    }
  }, [loading, error, data]);

  const updateProviderUserSettings = async (newSettings) => {
    console.log("[UserSettingsProvider.jsx] updateProviderUserSettings()");
  
    // Remove __typename from newSettings
    const cleanSettings = removeTypename(newSettings);
  
    setUserSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  
    console.log("[UserSettingsProvider.jsx] cleanSettings:", cleanSettings);

    try {
      const { data } = await updateUserSettings({
        variables: { ...cleanSettings },
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
