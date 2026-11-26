import { defineMessages } from '@edx/frontend-platform/i18n';
import verawoodMessages from '../forms/PreferredLanguage.messages';

const customMessages = defineMessages({
  'profile.preferredlanguage.label': {
    id: 'profile.custom.preferredlanguage.label',
    defaultMessage: 'Primary Language Spoken',
    description: 'Label for the preferred language field (Sumac custom UI wording).',
  },
  'profile.form.empty.option': {
    id: 'profile.custom.form.empty.option',
    defaultMessage: 'Select an option',
    description: 'Accessible label for an empty select option in custom profile forms',
  },
  'profile.preferredlanguage.placeholder': {
    id: 'tels.profile.preferredlanguage.placeholder',
    defaultMessage: 'Select a language',
    description: 'Placeholder text for the empty preferred language select option on the profile page',
  },
});

const messages = { ...verawoodMessages, ...customMessages };

export default messages;
