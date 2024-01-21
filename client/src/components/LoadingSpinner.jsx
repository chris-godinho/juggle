// LoadingSpinner.jsx

const LoadingSpinner = () => {
  return (
    <div className="spinner-container-jg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="217px"
        height="217px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        className="lds-ripple"
      >
        <circle cx="35" cy="50" r="15"></circle>
        <circle cx="65" cy="50" r="15"></circle>
        <circle cx="35" cy="50" r="15"></circle>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
