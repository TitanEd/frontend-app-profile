/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, StatefulButton } from '@openedx/paragon';
import { intlShape } from '@edx/frontend-platform/i18n';

const CustomStatefulButton = (props) => {
  const {
    buttonState,
    cancelHandler,
    intl,
    messages,
  } = props;

  return (
    <div className="form-group flex-shrink-0 flex-grow-1 custom-statefull-button">
      <StatefulButton
        type="submit"
        size="sm"
        variant="primary"
        style={{ marginRight: '0.5rem' }}
        state={buttonState}
        labels={{
          default: intl.formatMessage(messages['profile.formcontrols.button.save']),
          pending: intl.formatMessage(messages['profile.formcontrols.button.saving']),
          complete: intl.formatMessage(messages['profile.formcontrols.button.saved']),
        }}
        onClick={(e) => {
          // Swallow clicks if the state is pending.
          // We do this instead of disabling the button to prevent
          // it from losing focus (disabled elements cannot have focus).
          // Disabling it would causes upstream issues in focus management.
          // Swallowing the onSubmit event on the form would be better, but
          // we would have to add that logic for every field given our
          // current structure of the application.
          if (buttonState === 'pending') {
            e.preventDefault();
          }
        }}
        disabledStates={[]}
      />
      <Button variant="tertiary" size="sm" onClick={cancelHandler}>
        {intl.formatMessage(messages['profile.formcontrols.button.cancel'])}
      </Button>
    </div>
  );
};

CustomStatefulButton.propTypes = {
  buttonState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  cancelHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  visibility: PropTypes.oneOf(['private', 'all_users']),
  visibilityId: PropTypes.string.isRequired,
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  intl: intlShape.isRequired,
  messages: PropTypes.object.isRequired,
};

CustomStatefulButton.defaultProps = {
  visibility: 'private',
  saveState: null,
  buttonState: null,
};

export default CustomStatefulButton;