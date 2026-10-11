import { defineMessages } from '@edx/frontend-platform/i18n';
import verawoodMessages from '../forms/Country.messages';

const customMessages = defineMessages({
  'profile.country.label': {
    id: 'profile.custom.country.label',
    defaultMessage: 'Location',
    description: 'Label for the country/location field (Sumac custom UI wording).',
  },
  'profile.form.empty.option': {
    id: 'profile.custom.form.empty.option',
    defaultMessage: 'Select an option',
    description: 'Accessible label for an empty select option in custom profile forms',
  },
});

const messages = { ...verawoodMessages, ...customMessages };

export default messages;
