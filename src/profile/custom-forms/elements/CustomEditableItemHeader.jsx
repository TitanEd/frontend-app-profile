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
  const isVisibilityEnabled = useIsVisibilityEnabled();
  return (
    <div className="editable-item-header mb-2">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="edit-section-header mb-0" id={headingId}>
          {content}
        </h2>
        {showEditButton ? (
          <EditButton style={{ marginTop: '-.35rem' }} onClick={onClickEdit} />
        ) : null}
      </div>
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
