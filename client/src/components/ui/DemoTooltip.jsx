import { OverlayTrigger, Tooltip } from "react-bootstrap";

const DemoTooltip = (props) => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="demo-tooltip">Demo only – not functional</Tooltip>}
    >
      {/* eslint-disable-next-line react/prop-types */}
      {props.children}
    </OverlayTrigger>
  );
};

export default DemoTooltip;
