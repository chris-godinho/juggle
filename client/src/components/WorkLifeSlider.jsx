import { useState } from "react";

import { useDataContext } from "./DataContext"

export default function WorkLifeSlider() {

  const { formData, setFormData } = useDataContext();

  console.log("[WorkLifeSlider.jsx] formData:", formData);

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);

    // TODO: Update formData with new value (leave other values unchanged)

    setFormData({
      ...formData,
      user: {
        ...formData.user,
        statSettings: {
          ...formData?.user?.statSettings,
          balanceGoal: value,
        },
      },
    });

    console.log("[WorkLifeSlider.jsx] handleSliderChange - formData:", formData);

  };

  return (
    <div className="welcome-work-life-slider-jg">
      <input
        type="range"
        min="0"
        max="100"
        value={formData?.user?.statSettings?.balanceGoal || 50}
        className="slider-jg"
        onChange={handleSliderChange}
      />
      <div className="welcome-work-life-labels-jg">
        <div>
          <span className="slider-jg-text work-text-jg">Work</span>
          <span className="slider-jg-value work-text-jg">
            {formData?.user?.statSettings?.balanceGoal || 50}%
          </span>
        </div>
        <div>
          <span className="slider-jg-value life-text-jg">
            {100 - formData?.user?.statSettings?.balanceGoal || 50}%
          </span>
          <span className="slider-jg-text life-text-jg">Life</span>
        </div>
      </div>
    </div>
  );
}
