// Verawood Name messages plus the Sumac help text ('profile.name.details') that Verawood removed,
// and the Sumac label wording (Verawood changed the default text of the same message id).
import { defineMessages } from '@edx/frontend-platform/i18n';
import verawoodMessages from '../forms/Name.messages';

const customMessages = defineMessages({
  'profile.name.full.name': {
    id: 'profile.custom.name.full.name',
    defaultMessage: 'Full Name',
    description: 'Label for the full name field (Sumac custom UI wording).',
  },
  'profile.name.details': {
    id: 'profile.name.details',
    defaultMessage: 'This is the name that appears in your account and on your certificates.',
    description: 'Describes the area for a user to update their name.',
  },
});

const messages = { ...verawoodMessages, ...customMessages };

export default messages;
