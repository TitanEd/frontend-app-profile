// Verawood PreferredLanguage messages with the Sumac label wording for the custom UI.
// Verawood changed the default text of the same message id, so the custom UI uses its own id.
import { defineMessages } from '@edx/frontend-platform/i18n';
import verawoodMessages from '../forms/PreferredLanguage.messages';

const customMessages = defineMessages({
  'profile.preferredlanguage.label': {
    id: 'profile.custom.preferredlanguage.label',
    defaultMessage: 'Primary Language Spoken',
    description: 'Label for the preferred language field (Sumac custom UI wording).',
  },
});

const messages = { ...verawoodMessages, ...customMessages };

export default messages;
