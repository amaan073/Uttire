import { OverlayTrigger, Tooltip } from "react-bootstrap";

// eslint-disable-next-line react/prop-types
const DemoTooltipButton = ({ icon: Icon, label, className }) => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="demo-tooltip">Demo only – not functional</Tooltip>}
    >
      <button
        type="button"
        className={`btn d-flex gap-2 align-content-center ps-0 ${className}`}
      >
        <Icon /> {label}
      </button>
    </OverlayTrigger>
  );
};

export default DemoTooltipButton;
