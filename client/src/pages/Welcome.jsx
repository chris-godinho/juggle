// Welcome.jsx

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";

import DataContext from "../components/DataContext.jsx";

import { QUERY_USER } from "../utils/queries.js";
import { UPDATE_USER_SETTINGS } from "../utils/mutations.js";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfilePictureUpload from "../components/ProfilePictureUpload.jsx";
import WorkLifeSlider from "../components/WorkLifeSlider.jsx";
import SleepDropdownArea from "../components/SleepDropdownArea.jsx";
import LifeActivitiesCheckboxes from "../components/LifeActivitiesCheckboxes.jsx";
import WorkActivitiesCheckboxes from "../components/WorkActivitiesCheckboxes.jsx";
import ColorSchemeTable from "../components/ColorSchemeTable.jsx";

import AuthService from "../utils/auth.js";

const Welcome = () => {
  const progressBar = useRef(null);
  const welcomeScreens = Array.from({ length: 8 }, () => useRef(null));

  const [updateUserSettings, { error: updateError }] =
    useMutation(UPDATE_USER_SETTINGS);

  const userProfile = AuthService.getProfile();

  const [currentScreen, setCurrentScreen] = useState(1);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const newWidth = `${(currentScreen / 8) * 100}%`;
    progressBar.current.style.minWidth = newWidth;
  }, [currentScreen]);

  const { data: userData, error: userError } = useQuery(QUERY_USER, {
    variables: { username: userProfile.data.username },
  });

  if (userError) {
    console.error("[Welcome.jsx] GraphQL Error:", userError);
    return <div>Error fetching data.</div>;
  }

  useEffect(() => {
    if (userData) {
      setFormData({
        user: {
          username: userData?.user.username || "",
          colorModeSetting:
            userData?.user.colorModeSetting || "default-mode-jg",
          statSettings: {
            showStats: userData?.user.statSettings.showStats || true,
            balanceGoal: userData?.user.statSettings.balanceGoal || 50,
            percentageBasis:
              userData?.user.statSettings.percentageBasis || "waking",
            ignoreUnalotted:
              userData?.user.statSettings.ignoreUnalotted || false,
          },
          sleepingHours: {
            sunday: {
              start: userData?.user.sleepingHours.sunday.start || "11:00 PM",
              end: userData?.user.sleepingHours.sunday.end || "07:00 AM",
            },
            monday: {
              start: userData?.user.sleepingHours.monday.start || "11:00 PM",
              end: userData?.user.sleepingHours.monday.end || "07:00 AM",
            },
            tuesday: {
              start: userData?.user.sleepingHours.tuesday.start || "11:00 PM",
              end: userData?.user.sleepingHours.tuesday.end || "07:00 AM",
            },
            wednesday: {
              start: userData?.user.sleepingHours.wednesday.start || "11:00 PM",
              end: userData?.user.sleepingHours.wednesday.end || "07:00 AM",
            },
            thursday: {
              start: userData?.user.sleepingHours.thursday.start || "11:00 PM",
              end: userData?.user.sleepingHours.thursday.end || "07:00 AM",
            },
            friday: {
              start: userData?.user.sleepingHours.friday.start || "11:00 PM",
              end: userData?.user.sleepingHours.friday.end || "07:00 AM",
            },
            saturday: {
              start: userData?.user.sleepingHours.saturday.start || "11:00 PM",
              end: userData?.user.sleepingHours.saturday.end || "07:00 AM",
            },
          },
          lifePreferredActivities: {
            exercise: userData?.user.lifePreferredActivities.exercise || true,
            mindfulness: userData?.user.lifePreferredActivities.mindfulness || true,
            sleep: userData?.user.lifePreferredActivities.sleep || true,
            healthAwareness: userData?.user.lifePreferredActivities.healthAwareness || true,
            reading: userData?.user.lifePreferredActivities.reading || true,
            music: userData?.user.lifePreferredActivities.music || true,
            games: userData?.user.lifePreferredActivities.games || true,
            movies: userData?.user.lifePreferredActivities.movies || true,
            cooking: userData?.user.lifePreferredActivities.cooking || true,
            socializing: userData?.user.lifePreferredActivities.socializing || true,
            sports: userData?.user.lifePreferredActivities.sports || true,
            outdoorsExploration: userData?.user.lifePreferredActivities.outdoorsExploration || true,
            travel: userData?.user.lifePreferredActivities.travel || true,
            journaling: userData?.user.lifePreferredActivities.journaling || true,
            personalGrowth: userData?.user.lifePreferredActivities.personalGrowth || true,
            creativeExpression: userData?.user.lifePreferredActivities.creativeExpression || true,
            financialPlanning: userData?.user.lifePreferredActivities.financialPlanning || true,
            digitalDetox: userData?.user.lifePreferredActivities.digitalDetox || true,
            purposeAndMeaning: userData?.user.lifePreferredActivities.purposeAndMeaning || true,
            boundarySetting: userData?.user.lifePreferredActivities.boundarySetting || true,
          },
          workPreferredActivities: {
            goalSetting: userData?.user.workPreferredActivities.goalSetting || true,
            skillDevelopment: userData?.user.workPreferredActivities.skillDevelopment || true,
            industryResearch: userData?.user.workPreferredActivities.industryResearch || true,
            mentorship: userData?.user.workPreferredActivities.mentorship || true,
            softSkills: userData?.user.workPreferredActivities.softSkills || true,
            networking: userData?.user.workPreferredActivities.networking || true,
            branding: userData?.user.workPreferredActivities.branding || true,
            progressEvaluation: userData?.user.workPreferredActivities.progressEvaluation || true,
            teamBuilding: userData?.user.workPreferredActivities.teamBuilding || true,
            teamFeedback: userData?.user.workPreferredActivities.teamFeedback || true,
            customerFeedback: userData?.user.workPreferredActivities.customerFeedback || true,
            qualityAssurance: userData?.user.workPreferredActivities.qualityAssurance || true,
            brainstorming: userData?.user.workPreferredActivities.brainstorming || true,
            innovationMindset: userData?.user.workPreferredActivities.innovationMindset || true,
            technologyIntegration: userData?.user.workPreferredActivities.technologyIntegration || true,
            teamIntegration: userData?.user.workPreferredActivities.teamIntegration || true,
            milestoneCelebration: userData?.user.workPreferredActivities.milestoneCelebration || true,
            reverseMentorship: userData?.user.workPreferredActivities.reverseMentorship || true,
            volunteering: userData?.user.workPreferredActivities.volunteering || true,
            entrepreneurship: userData?.user.workPreferredActivities.entrepreneurship || true,
          },
        },
      });
    }
  }, [userData]);

  const userFirstName = userData?.user.firstName;

  const saveSettingsData = async () => {
    console.log("[Welcome.jsx] saveSettingsData() triggered.");
    console.log("[Welcome.jsx] formData:", formData);
    try {
      const { data } = await updateUserSettings({
        variables: { ...formData.user },
      });
      console.log("[Welcome.jsx] data:", data);
    } catch (updateError) {
      console.error("[Welcome.jsx] GraphQL Error:", updateError);
    }
  };

  const nextScreen = () => {
    if (currentScreen === 8) {
      window.location.href = "/";
    } else {
      welcomeScreens[currentScreen - 1].current.classList.add("hidden-jg");
      welcomeScreens[currentScreen].current.classList.remove("hidden-jg");
      if (currentScreen === 7) {
        console.log("[Welcome.jsx] currentScreen is 7. Saving data...");
        console.log("[Welcome.jsx] formData:", formData);
        saveSettingsData();
      }
      setCurrentScreen((prevScreen) => prevScreen + 1);
    }
  };

  const prevScreen = () => {
    welcomeScreens[currentScreen - 1].current.classList.add("hidden-jg");
    welcomeScreens[currentScreen - 2].current.classList.remove("hidden-jg");
    if (currentScreen > 1) {
      setCurrentScreen((prevScreen) => prevScreen - 1);
    }
  };

  return (
    <DataContext.Provider value={{ formData, setFormData }}>
      <main className="main-jg">
        <Header />
        <div className="welcome-jg">
          <div
            ref={welcomeScreens[0]}
            className="welcome-screen-jg screen-1-jg"
          >
            <div className="welcome-screen-content-container-jg">
              <div className="welcome-text-jg">
                <h1>Welcome to Juggler, {userFirstName}!</h1>
                <p>
                  Since you're a new user, we'll need to adjust a few settings
                  to get you started.
                </p>
                <p>
                  If at any point you want to skip a particular setting, you can
                  click on the arrow at the bottom right of the screen to move
                  on to the next one.
                </p>
                <p>
                  If you prefer not to adjust any settings at this point, you
                  can click{" "}
                  <a className="text-link-jg" href="/">
                    here
                  </a>{" "}
                  to move straight to your dashboard. Our default settings will
                  be applied, and if you want to change them later, you can use
                  the "User Settings" option in your user menu.
                </p>
                <p>
                  Ready to get started? Click the arrow at the bottom right of
                  the screen.
                </p>
              </div>
            </div>
          </div>
          <div
            ref={welcomeScreens[1]}
            className="welcome-screen-jg screen-2-jg hidden-jg"
          >
            <div className="welcome-screen-content-container-jg">
              <div className="welcome-text-container-jg">
                <div className="welcome-text-jg">
                  <h1>Profile Photo</h1>
                  <p>
                    If you have a profile photo you'd like to use, you can
                    upload it here.
                  </p>
                  <p>
                    Profile photos are optional, and you can always add one
                    later.
                  </p>
                  <p>
                    If you don't have a profile photo, you can use the default
                    image.
                  </p>
                </div>
                <ProfilePictureUpload />
              </div>
            </div>
          </div>
          <div
            ref={welcomeScreens[2]}
            className="welcome-screen-jg screen-3-jg hidden-jg"
          >
            <div className="welcome-screen-content-container-jg">
              <div className="welcome-text-jg">
                <h1>Your Balance Goals</h1>
                <p>
                  Here you will decide what the ideal balance of your life looks
                  like.
                </p>
                <p>
                  The average person sleeps 8 hours a day, works 8 hours a day,
                  and has 8 hours of personal time, so we've set that as the
                  default. We'll be dealing with sleep time in a moment.
                </p>
                <p>
                  Move the slider to the left or right to adjust your desired
                  work/life balance goal.
                </p>
                <div className="welcome-work-life-container-jg">
                  <WorkLifeSlider />
                </div>
              </div>
            </div>
          </div>
          <div
            ref={welcomeScreens[3]}
            className="welcome-screen-jg screen-4-jg hidden-jg"
          >
            <div className="welcome-screen-content-container-jg">
              <div className="welcome-text-container-jg">
                <div className="welcome-text-jg">
                  <h1>Your Sleep Habits</h1>
                  <p>Now let's talk about your sleep habits.</p>
                  <p>
                    As we mentioned earlier, the average person sleeps 8 hours a
                    day. If you sleep more or less than that, you can adjust the
                    dropdown menus according to your personal habits.
                  </p>
                  <p>
                    Sleep time is not taken into account in your work/life
                    balance goal.
                  </p>
                </div>
                <div className="welcome-sleep-dropdown-container-jg">
                  <SleepDropdownArea />
                </div>
              </div>
            </div>
          </div>
          <div
            ref={welcomeScreens[4]}
            className="welcome-screen-jg screen-5-jg hidden-jg"
          >
            <div className="welcome-screen-content-container-jg">
              <div className="welcome-text-jg">
                <h1>Suggested Life Activities</h1>
                <p>
                  Now it's time to fine-tune our suggestions for improving your
                  work/life balance. Mark the checkboxes that correspond to
                  activities that you enjoy doing in your free time.
                </p>
                <LifeActivitiesCheckboxes />
              </div>
            </div>
          </div>
          <div
            ref={welcomeScreens[5]}
            className="welcome-screen-jg screen-6-jg hidden-jg"
          >
            <div className="welcome-screen-content-container-jg">
              <div className="welcome-text-jg">
                <h1>Suggested Work Activities</h1>
                <p>
                  As before, now we're going to select your preferred work
                  activities. What do you like to do to achieve your
                  professional goals?
                </p>
                <WorkActivitiesCheckboxes />
              </div>
            </div>
          </div>
          <div
            ref={welcomeScreens[6]}
            className="welcome-screen-jg screen-7-jg hidden-jg"
          >
            <div className="welcome-screen-content-container-jg">
              <div className="welcome-text-jg">
                <h1>Color Scheme</h1>
                <p>
                  Finally, let's choose a color scheme for your dashboard. You
                  can always change this later in your user settings.
                </p>
                <ColorSchemeTable />
              </div>
            </div>
          </div>
          <div
            ref={welcomeScreens[7]}
            className="welcome-screen-jg screen-8-jg hidden-jg"
          >
            <div className="welcome-screen-content-container-jg">
              <div className="welcome-text-jg">
                <h1>We're all set.</h1>
                <p>Your new settings have been saved.</p>
                <p>
                  Thank you for taking the time to personalize your Juggler
                  experience.
                </p>
                <p>We hope you enjoy a seamless and balanced journey ahead.</p>
                <p>Happy juggling!</p>
              </div>
            </div>
          </div>
          <div className="welcome-progress-bar-jg">
            <div
              ref={progressBar}
              className="welcome-progress-bar-filled-jg"
            ></div>
          </div>
          <div className="navigation-arrow-container-jg">
            <a
              href="#"
              className={
                currentScreen === 1
                  ? "navigation-arrow-button-jg camouflaged-jg"
                  : "navigation-arrow-button-jg"
              }
              onClick={prevScreen}
            >
              <span className="material-symbols-outlined">
                arrow_back_ios_new
              </span>
            </a>
            <p>{currentScreen} of 8</p>
            <a
              href="#"
              className="navigation-arrow-button-jg"
              onClick={nextScreen}
            >
              <span className="material-symbols-outlined">
                arrow_forward_ios
              </span>
            </a>
          </div>
        </div>
        <Footer />
      </main>
    </DataContext.Provider>
  );
};

export default Welcome;
