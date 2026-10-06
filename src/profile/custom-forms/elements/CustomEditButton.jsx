// Sumac (tels/sumac.1) EditButton ("Edit" text button), used only by CustomProfilePage (custom UI).
// Verawood redesigned the default profile forms (src/profile/forms); the custom UI keeps the
// Sumac layout. Shared Verawood pieces (messages, FormControls with stateful_button_plugin_slot,
// SwitchContent, selectors) are reused so data handling stays on the Verawood code path.
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';

import messages from '../../forms/elements/EditButton.messages';

const EditButton = ({
  onClick, className, style, intl,
}) => (
  <Button
    variant="primary"
    size="sm"
    className={className}
    onClick={onClick}
    style={style}
  >
    <FontAwesomeIcon className="mr-1" icon={faPencilAlt} />
    {intl.formatMessage(messages['profile.editbutton.edit'])}
  </Button>
);

export default injectIntl(EditButton);

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line

  // i18n
  intl: intlShape.isRequired,
};

EditButton.defaultProps = {
  className: null,
  style: null,
};
