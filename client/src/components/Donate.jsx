// Donate.jsx

export default function Donate() {
  const handleDonateClick = () => {
    window.open("https://donate.stripe.com/8wM3dFa433Urdva6oo", "_blank");
  };

  return (
    <div className="modal-inner-content-jg">
      <img
        src="/logo_1024x1024_transparent.png"
        alt="juggler logo"
        className="donate-logo-jg"
      />
      <h1>Support Us</h1>
      <div className="donate-blurb-text-jg">
        <p>We hope you are enjoying Juggler! </p>
        <p>
          If you would like to support us, please consider donating to our
          cause. We are a small team of developers who are passionate about
          helping people achieve their goals.
        </p>
        <p>
          Your donation will help us continue to improve Juggler and provide you
          with the best experience possible.
        </p>
      </div>
      <button onClick={handleDonateClick} className="button-jg">
        Donate
      </button>
    </div>
  );
}
