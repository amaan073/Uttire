import PropTypes from "prop-types";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function EmailWithTooltip({ email }) {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id="email-tooltip">{email}</Tooltip>}
    >
      <p
        className="text-muted text-truncate mb-0"
        style={{ maxWidth: "200px", cursor: "default" }}
      >
        {email}
      </p>
    </OverlayTrigger>
  );
}

EmailWithTooltip.propTypes = {
  email: PropTypes.string,
};

export default EmailWithTooltip;
