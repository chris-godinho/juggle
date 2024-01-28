// LoadingSpinner.jsx

const LoadingSpinner = ({ spinnerStyle, spinnerElWidthHeight }) => {

  return (
    <div className="spinner-container-jg" style={spinnerStyle}>
      <div className="spinner-wrapper-jg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width={spinnerElWidthHeight}
          height={spinnerElWidthHeight}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          className="lds-ripple"
        >
          <circle cx="35" cy="50" r="15"></circle>
          <circle cx="65" cy="50" r="15"></circle>
          <circle cx="35" cy="50" r="15"></circle>
        </svg>
      </div>
    </div>
  );
};

export default LoadingSpinner;
