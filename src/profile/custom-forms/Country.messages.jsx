// Verawood Country messages with the Sumac label wording for the custom UI.
// Verawood changed the default text of the same message id, so the custom UI uses its own id.
import { defineMessages } from '@edx/frontend-platform/i18n';
import verawoodMessages from '../forms/Country.messages';

const customMessages = defineMessages({
  'profile.country.label': {
    id: 'profile.custom.country.label',
    defaultMessage: 'Location',
    description: 'Label for the country/location field (Sumac custom UI wording).',
  },
});

const messages = { ...verawoodMessages, ...customMessages };

export default messages;
