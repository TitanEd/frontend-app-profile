import { defineMessages } from '@edx/frontend-platform/i18n';
import verawoodMessages from '../forms/Bio.messages';

const customMessages = defineMessages({
  'profile.bio.about.me': {
    id: 'profile.custom.bio.about.me',
    defaultMessage: 'About Me',
    description: 'Label for the bio field (Sumac custom UI wording).',
  },
  'profile.bio.placeholder': {
    id: 'tels.profile.bio.placeholder',
    defaultMessage: 'Enter a short bio',
    description: 'Placeholder text for the bio textarea on the profile page',
  },
});

const messages = { ...verawoodMessages, ...customMessages };

export default messages;
