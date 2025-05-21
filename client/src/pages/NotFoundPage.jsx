import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

const NotFoundPage = () => {
  return (
    <>
      <Header />

      <div
        className="container text-center p-3 d-flex justify-content-center align-items-center"
        style={{ height: "calc(var(--safe-height) - 128px)" }}
      >
        <div>
          <div className="fw-bolder display-5">404 - Page Not Found</div>
          <div className="my-2 text-muted fs-4">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Oops! We couldn't find that page you were looking for.
          </div>
          <Link to="/">Go to Homepage 🏠</Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NotFoundPage;
