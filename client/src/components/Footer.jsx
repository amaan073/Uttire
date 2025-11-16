import DemoToolTip from "../components/ui/DemoTooltip";

const Footer = () => {
  return (
    <>
      <footer className="py-3 pt-4 mt-2 bg-dark text-white text-center">
        <div className="d-flex w-100 justify-content-center gap-3">
          <DemoToolTip>
            <span className="text-primary cursor-pointer">Privacy Policy</span>
          </DemoToolTip>
          <p className="text-primary">|</p>
          <DemoToolTip>
            <span className="text-primary cursor-pointer">
              Terms and Conditions
            </span>
          </DemoToolTip>
        </div>

        <p>© {new Date().getFullYear()} Uttire, Inc. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Footer;
