// ColorSchemeTable.jsx

import { useColorScheme } from "../components/ColorSchemeProvider.jsx";
import { useDataContext } from "./DataContext";

import { colorSchemes } from "../utils/colorSchemes.js";

export default function ColorSchemeTable() {
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
    <div className="color-scheme-table-jg">
      {colorSchemes.map((scheme, index) => (
        <div key={index} className="color-scheme-card-jg">
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
          <p className="color-scheme-name-jg">{scheme.name}</p>
        </div>
      ))}
    </div>
  );
}
