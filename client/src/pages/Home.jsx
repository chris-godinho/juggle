// Home.jsx
// Landing page for Juggler app

import Header from "../components/other/Header";

const Home = () => {
  return (
    <main className="main-jg">
      <Header />
      <div className="home-jg">
        <div className="home-image-container-jg">
          <img
            src="/clown_welcome.png"
            className="home-clown-jg"
            alt="Juggler Clown"
          />
        </div>
        <div className="home-text-jg">
          <h1>Welcome to Juggler.</h1>
          <p>
            Introducing Juggler, the ultimate web organizer designed to
            seamlessly manage tasks and events, striking a perfect balance
            between work and life commitments.
          </p>
          <p>
            With productivity tracking, tailored suggestions, and timely
            reminders, Juggler empowers you to optimize your schedule
            effortlessly.
          </p>
          <p>
            Experience a holistic approach to organization that enhances your
            efficiency without sacrificing personal well-being.
          </p>
          <p>Welcome to Juggler – where productivity meets harmony.</p>
        </div>
      </div>
    </main>
  );
};

export default Home;
