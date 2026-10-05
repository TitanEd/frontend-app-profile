// Sumac (tels/sumac.1) EditableItemHeader (label with right-aligned Edit button), used only by CustomProfilePage (custom UI).
// Verawood redesigned the default profile forms (src/profile/forms); the custom UI keeps the
// Sumac layout. Shared Verawood pieces (messages, FormControls with stateful_button_plugin_slot,
// SwitchContent, selectors) are reused so data handling stays on the Verawood code path.
import React from 'react';
import PropTypes from 'prop-types';

import EditButton from './CustomEditButton';
import { Visibility } from '../../forms/elements/Visibility';
import { useIsVisibilityEnabled } from '../../data/hooks';

const EditableItemHeader = ({
  content,
  showVisibility,
  visibility,
  showEditButton,
  onClickEdit,
  headingId,
}) => {
  // Verawood: hide the visibility line when DISABLE_VISIBILITY_EDITING is set.
  const isVisibilityEnabled = useIsVisibilityEnabled();
  return (
    <div className="editable-item-header mb-2">
      <h2 className="edit-section-header" id={headingId}>
        {content}
        {showEditButton ? <EditButton style={{ marginTop: '-.35rem' }} className="float-right" onClick={onClickEdit} /> : null}
      </h2>
      {/* {showVisibility ? <p className="mb-0"><Visibility to={visibility} /></p> : null} */}
      {showVisibility && isVisibilityEnabled ? <p className="mb-0"><Visibility to={visibility} /></p> : null}
    </div>
  );
};

export default EditableItemHeader;

EditableItemHeader.propTypes = {
  onClickEdit: PropTypes.func,
  showVisibility: PropTypes.bool,
  showEditButton: PropTypes.bool,
  content: PropTypes.node,
  visibility: PropTypes.oneOf(['private', 'all_users']),
  headingId: PropTypes.string,
};

EditableItemHeader.defaultProps = {
  onClickEdit: () => {},
  showVisibility: false,
  showEditButton: false,
  content: '',
  visibility: 'private',
  headingId: null,
};
