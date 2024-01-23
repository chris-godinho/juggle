import { useState } from "react";

export default function WorkLifeSlider() {
  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setSliderValue(value);
  };

  return (
    <div className="welcome-work-life-slider-jg">
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        class="slider-jg"
        onChange={handleSliderChange}
      />
      <div className="welcome-work-life-labels-jg">
        <div>
          <span className="slider-jg-text work-text-jg">Work</span>
          <span className="slider-jg-value work-text-jg">
            {sliderValue}%
          </span>
        </div>
        <div>
          <span className="slider-jg-value life-text-jg">
            {100 - sliderValue}%
          </span>
          <span className="slider-jg-text life-text-jg">Life</span>
        </div>
      </div>
    </div>
  );
}
