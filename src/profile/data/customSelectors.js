import { createSelector } from 'reselect';
import { getCountryList } from '@edx/frontend-platform/i18n';

import educationMessages from '../forms/Education.messages';
import {
  countriesCodesListSelector,
  countryMessagesSelector,
  editableFormSelector,
  languageMessagesSelector,
  localeSelector,
  profileAccountSelector,
  profilePageSelector,
} from './selectors';

// Message descriptors (not defaultMessage strings) so callers can intl.formatMessage.
export const educationMessagesSelector = createSelector(
  localeSelector,
  () => ({
    p: educationMessages['profile.education.levels.p'],
    m: educationMessages['profile.education.levels.m'],
    b: educationMessages['profile.education.levels.b'],
    a: educationMessages['profile.education.levels.a'],
    hs: educationMessages['profile.education.levels.hs'],
    jhs: educationMessages['profile.education.levels.jhs'],
    el: educationMessages['profile.education.levels.el'],
    none: educationMessages['profile.education.levels.none'],
    other: educationMessages['profile.education.levels.o'],
    o: educationMessages['profile.education.levels.o'],
  }),
);

export const customSortedCountriesSelector = createSelector(
  localeSelector,
  countriesCodesListSelector,
  profileAccountSelector,
  (locale, countriesCodesList, profileAccount) => {
    const countryList = getCountryList(locale);
    const userCountry = profileAccount.country;
    const allowedCodes = Array.isArray(countriesCodesList) ? countriesCodesList : [];

    // The registration API supplies the site's allowed countries. When the LMS has no country
    // field there the allowlist is empty, which means "no restriction": show the full list.
    if (allowedCodes.length === 0) {
      return countryList;
    }

    return countryList.filter(({ code }) => code === userCountry || allowedCodes.find(x => x === code));
  },
);

export const customCountrySelector = createSelector(
  editableFormSelector,
  customSortedCountriesSelector,
  countryMessagesSelector,
  countriesCodesListSelector,
  profileAccountSelector,
  (editableForm, translatedCountries, countryMessages, countriesCodesList, account) => ({
    ...editableForm,
    translatedCountries,
    countryMessages,
    countriesCodesList,
    committedCountry: account.country,
  }),
);

export const customProfilePageSelector = createSelector(
  profilePageSelector,
  countryMessagesSelector,
  languageMessagesSelector,
  educationMessagesSelector,
  (profilePage, countryMessages, languageMessages, educationLevelMessages) => ({
    ...profilePage,
    countryMessages,
    languageMessages,
    educationMessages: educationLevelMessages,
  }),
);
