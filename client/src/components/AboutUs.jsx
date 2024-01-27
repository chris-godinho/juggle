// WorkLifeStats.jsx

export default function AboutUs() {
  return (
    <div className="modal-inner-content-jg">
      <h1 className="about-us-heading-jg">Hey you.</h1>
      <div className="about-us-container-jg">
        <img
          className="about-us-image-jg"
          src="/aboutus_cbg.jpg"
          alt="Chris Godinho"
        />
        <p>
          I am{" "}
          <a className="text-link-jg" href="http://chrisgodinho.com" target="_blank">
            Chris Godinho
          </a>
          , a Full Stack Developer based in Mississauga, Ontario, Canada.
        </p>
        <p>
          I am passionate about turning innovative ideas into tangible digital
          reality. Apart for that I am a fan of card games, trivia, and dogs.
          ALL of them.
        </p>
        <p>
          My approach to every project is shaped by an unwavering attention to
          detail, a commitment to ethical behaviour in all aspects of my work,
          and a relentless drive to overcome challenges, ensuring precision,
          integrity, and a determination to achieve excellence.
        </p>
        <p>Most importantly: I love what I do.</p>
      </div>
    </div>
  );
}
