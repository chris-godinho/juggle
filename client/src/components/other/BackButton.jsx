// BackButton.jsx
// Back button component for error pages and pages under construction

import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  // Returns user to previous page
  const goBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={goBack}
      className="button-jg"
    >
      Go Back
    </button>
  );
};

export default BackButton;
