// Verawood Bio messages with the Sumac label wording for the custom UI.
// Verawood changed the default text of the same message id, so the custom UI uses its own id.
import { defineMessages } from '@edx/frontend-platform/i18n';
import verawoodMessages from '../forms/Bio.messages';

const customMessages = defineMessages({
  'profile.bio.about.me': {
    id: 'profile.custom.bio.about.me',
    defaultMessage: 'About Me',
    description: 'Label for the bio field (Sumac custom UI wording).',
  },
});

const messages = { ...verawoodMessages, ...customMessages };

export default messages;
