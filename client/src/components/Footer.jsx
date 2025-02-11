const Footer = () => {
  return (
    <>
      <footer className="py-1 mt-2">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <div className="d-flex align-items-center">
            <span className="mb-3 mb-md-0 text-dark">
              © {new Date().getFullYear()} Uttire, Inc.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
