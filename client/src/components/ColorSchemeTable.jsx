// ColorSchemeTable.jsx

import { useColorScheme } from "../components/ColorSchemeProvider.jsx";
import { useDataContext } from "./DataContext";

import { colorSchemes } from "../utils/colorSchemes.js";

export default function ColorSchemeTable({ cardSize = "normal" }) {
  const { formData, setFormData } = useDataContext();

  const { changeColorScheme } = useColorScheme();

  const handleColorSchemeChange = (key) => {
    changeColorScheme(key);
    setFormData({
      ...formData,
      user: {
        ...formData.user,
        colorModeSetting: key,
      },
    });
  };

  return (
    <div className={cardSize === "normal" ? "color-scheme-table-jg" : "settings-theme-card-container-jg"}>
      {colorSchemes.map((scheme, index) => (
        <div key={index} className={cardSize === "normal" ? "color-scheme-card-jg" : "color-scheme-card-jg settings-theme-card-jg"}>
          <div className="color-scheme-sample-jg">
            <a href="#" onClick={() => handleColorSchemeChange(scheme.key)}>
              <div
                className={`color-scheme-sample-bar-jg main-background-sample-jg ${scheme.key}`}
              ></div>
              <div
                className={`color-scheme-sample-bar-jg main-background-darker-accent-jg ${scheme.key}`}
              ></div>
              <div
                className={`color-scheme-sample-bar-jg main-text-color-jg ${scheme.key}`}
              ></div>
              <div
                className={`color-scheme-sample-bar-jg life-event-color-jg ${scheme.key}`}
              ></div>
              <div
                className={`color-scheme-sample-bar-jg work-event-color-jg ${scheme.key}`}
              ></div>
            </a>
          </div>
          <p className={cardSize === "normal" ? "color-scheme-name-jg" : "settings-thumbnail-label-jg"}>{scheme.name}</p>
        </div>
      ))}
    </div>
  );
}
