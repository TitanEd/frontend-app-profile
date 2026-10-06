// Sumac (tels/sumac.1) EmptyContent (primary "Add" button), used only by CustomProfilePage (custom UI).
// Verawood redesigned the default profile forms (src/profile/forms); the custom UI keeps the
// Sumac layout. Shared Verawood pieces (messages, FormControls with stateful_button_plugin_slot,
// SwitchContent, selectors) are reused so data handling stays on the Verawood code path.
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const EmptyContent = ({ children, onClick, showPlusIcon }) => (
  <div>
    {onClick ? (
      <button
        type="button"
        className="text-left btn-sm btn btn-primary"
        size="sm"
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter') { onClick(); } }}
        tabIndex={0}
      >
        {showPlusIcon ? <FontAwesomeIcon size="xs" className="mr-2" icon={faPlus} /> : null}
        {children}
      </button>
    ) : children}
  </div>
);

export default EmptyContent;

EmptyContent.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  showPlusIcon: PropTypes.bool,
};

EmptyContent.defaultProps = {
  onClick: null,
  children: null,
  showPlusIcon: true,
};
