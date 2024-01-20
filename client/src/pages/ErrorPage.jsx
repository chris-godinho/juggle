import { useRouteError } from "react-router-dom";

import BackButton from "../components/BackButton";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <main className="main-jg">
      <div id="error-page-jg">
        <div>
          <img className="clown-error-jg" src="/clown_welcome.png" alt="clown" />
        </div>
        <div>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <BackButton />
        </div>
      </div>
    </main>
  );
}
