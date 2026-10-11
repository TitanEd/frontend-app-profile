import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './FormControls.messages';

import { VisibilitySelect } from './Visibility';
import CustomStatefulButton from './CustomStatefulButton';
import { useIsVisibilityEnabled } from '../../data/hooks';

const CustomFormControls = ({
  cancelHandler,
  changeHandler,
  visibility = 'private',
  visibilityId,
  saveState = null,
}) => {
  const intl = useIntl();
  const buttonState = saveState === 'error' ? null : saveState;
  const isVisibilityEnabled = useIsVisibilityEnabled();

  return (
    <div className="d-flex flex-row-reverse flex-wrap justify-content-end align-items-center">
      {isVisibilityEnabled && (
        <div className="form-group d-flex flex-wrap">
          <label className="col-form-label" htmlFor={visibilityId}>
            {intl.formatMessage(messages['profile.formcontrols.who.can.see'])}
          </label>
          <VisibilitySelect
            id={visibilityId}
            className="d-flex align-items-center"
            type="select"
            name={visibilityId}
            value={visibility}
            onChange={changeHandler}
          />
        </div>
      )}
      <CustomStatefulButton
        buttonState={buttonState}
        cancelHandler={cancelHandler}
        changeHandler={changeHandler}
        visibility={visibility}
        visibilityId={visibilityId}
        saveState={saveState}
        intl={intl}
        messages={messages}
      />
    </div>
  );
};

export default CustomFormControls;

CustomFormControls.propTypes = {
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  visibility: PropTypes.oneOf(['private', 'all_users']),
  visibilityId: PropTypes.string.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
};
