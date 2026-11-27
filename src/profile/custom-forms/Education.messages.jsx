import { defineMessages } from '@edx/frontend-platform/i18n';
import verawoodMessages from '../forms/Education.messages';

const customMessages = defineMessages({
  'profile.education.placeholder': {
    id: 'tels.profile.education.placeholder',
    defaultMessage: 'Select a level of education',
    description: 'Placeholder text for the empty education select option on the profile page',
  },
});

const messages = { ...verawoodMessages, ...customMessages };

export default messages;
