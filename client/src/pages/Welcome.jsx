// Welcome.jsx

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";

import { useColorScheme } from "../components/ColorSchemeProvider.jsx";

import { QUERY_USER } from "../utils/queries.js";

import Header from "../components/Header";
import Footer from "../components/Footer";
import WorkLifeSlider from "../components/WorkLifeSlider.jsx";
import ProfilePictureUpload from "../components/ProfilePictureUpload.jsx";
import SleepDropdownArea from "../components/SleepDropdownArea.jsx";

import AuthService from "../utils/auth.js";

import { lifeGoalActivities, workGoalActivities } from "../utils/preferredActivities.js";
import { colorSchemes } from "../utils/colorSchemes.js";

const Welcome = () => {
  console.log("[Welcome.jsx] Starting new render cycle.");

  const { changeColorScheme } = useColorScheme();

  const progressBar = useRef(null);
  const welcomeScreens = Array.from({ length: 8 }, () => useRef(null));

  const [currentScreen, setCurrentScreen] = useState(1);

  console.log("[Welcome.jsx] All variables set.");

  const userProfile = AuthService.getProfile();

  useEffect(() => {
    console.log("[Welcome.jsx] useEffect triggered (empty dependency).");
    console.log("[Welcome.jsx] progressBar:", progressBar.current);
  }, []);

  useEffect(() => {
    console.log(
      "[Welcome.jsx] useEffect triggered (currentScreen value change)."
    );
    const newWidth = `${(currentScreen / 8) * 100}%`;
    progressBar.current.style.minWidth = newWidth;
    console.log("[Welcome.jsx] Progress bar width changed?");
  }, [currentScreen]);

  const { data: userData, error: userError } = useQuery(QUERY_USER, {
    variables: { username: userProfile.data.username },
  });

  if (userError) {
    console.error("[Welcome.jsx] GraphQL Error:", userError);
    return <div>Error fetching data.</div>;
  }

  const userFirstName = userData?.user.firstName;

  const nextScreen = () => {
    console.log("[Welcome.jsx] nextScreen() triggered.");
    if (currentScreen === 8) {
      console.log(
        "[Welcome.jsx] currentScreen is 8. Redirecting to Dashboard..."
      );
      window.location.href = "/";
    } else {
      console.log("[Welcome.jsx] Moving to next screen...");
      welcomeScreens[currentScreen - 1].current.classList.add("hidden-jg");
      welcomeScreens[currentScreen].current.classList.remove("hidden-jg");
      setCurrentScreen(
        (prevScreen) => prevScreen + 1,
        console.log("[Welcome.jsx] currentScreen:", currentScreen.state)
      );
    }
  };

  const prevScreen = () => {
    console.log("[Welcome.jsx] prevScreen() triggered.");
    console.log("[Welcome.jsx] Moving to previous screen...");
    welcomeScreens[currentScreen - 1].current.classList.add("hidden-jg");
    welcomeScreens[currentScreen - 2].current.classList.remove("hidden-jg");
    if (currentScreen > 1) {
      setCurrentScreen(
        (prevScreen) => prevScreen - 1,
        console.log("[Welcome.jsx] currentScreen:", currentScreen.state)
      );
    }
  };

  return (
    <main className="main-jg">
      <Header />
      <div className="welcome-jg">
        <div ref={welcomeScreens[0]} className="welcome-screen-jg screen-1-jg">
          <div className="welcome-screen-content-container-jg">
            <div className="welcome-text-jg">
              <h1>Welcome to Juggler, {userFirstName}!</h1>
              <p>
                Since you're a new user, we'll need to adjust a few settings to
                get you started.
              </p>
              <p>
                If at any point you want to skip a particular setting, you can
                click on the arrow at the bottom right of the screen to move on
                to the next one.
              </p>
              <p>
                If you prefer not to adjust any settings at this point, you can
                click{" "}
                <a className="text-link-jg" href="/">
                  here
                </a>{" "}
                to move straight to your dashboard. Our default settings will be
                applied, and if you want to change them later, you can use the
                "User Settings" option in your user menu.
              </p>
              <p>
                Ready to get started? Click the arrow at the bottom right of the
                screen.
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
                  If you have a profile photo you'd like to use, you can upload
                  it here.
                </p>
                <p>
                  Profile photos are optional, and you can always add one later.
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
                default. We'll be dealing with sleep time later.
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
                  Sleep time is not taken into account in your work/life balance
                  goal.
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
              <div className="work-life-activities-list-jg">
                {lifeGoalActivities.map((activity, index) => (
                  <label
                    key={index}
                    className="work-life-activity-checkbox-jg checkbox-jg"
                    title={activity.description}
                  >
                    <input type="checkbox" name={`workActivity${index + 1}`} />
                    {activity.title}
                  </label>
                ))}
              </div>
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
                activities. What do you like to do to achieve your professional
                goals?
              </p>
              <div className="work-life-activities-list-jg">
                {workGoalActivities.map((activity, index) => (
                  <label
                    key={index}
                    className="work-life-activity-checkbox-jg checkbox-jg"
                    title={activity.description}
                  >
                    <input type="checkbox" name={`workActivity${index + 1}`} />
                    {activity.title}
                  </label>
                ))}
              </div>
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
                Finally, let's choose a color scheme for your dashboard. You can
                always change this later in your user settings.
              </p>
              <div className="color-scheme-table-jg">
                {colorSchemes.map((scheme, index) => (
                  <div key={index} className="color-scheme-card-jg">
                    <div className="color-scheme-sample-jg">
                      <a href="#" onClick={() => changeColorScheme(scheme.key)}>
                        <img
                          src={`/colorSchemes/${scheme.image}`}
                          alt={`Color Scheme Sample ${index + 1}`}
                          className="color-scheme-sample-image-jg"
                        />
                      </a>
                    </div>
                    <p className="color-scheme-name-jg">{scheme.name}</p>
                  </div>
                ))}
              </div>
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
            <span className="material-symbols-outlined">arrow_forward_ios</span>
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Welcome;
