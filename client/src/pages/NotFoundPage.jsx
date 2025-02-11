import { Link } from "react-router-dom";

import Header from "../components/Header";

const NotFoundPage = () => {
  return (
    <>
      <Header />

      <div
        className="container text-center p-3 d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div>
          <div className="fw-bolder display-5">404 - Page Not Found</div>
          <div className="my-2">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Oops! We couldn't find that page you were looking for.
          </div>
          <Link to="/">Go to Homepage 🏠</Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
