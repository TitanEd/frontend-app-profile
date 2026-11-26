import { defineMessages } from '@edx/frontend-platform/i18n';
import verawoodMessages from '../forms/SocialLinks.messages';

const customMessages = defineMessages({
  'profile.sociallinks.placeholder': {
    id: 'tels.profile.sociallinks.placeholder',
    defaultMessage: 'Enter a link',
    description: 'Placeholder text for social link input fields on the profile page',
  },
});

const messages = { ...verawoodMessages, ...customMessages };

export default messages;
