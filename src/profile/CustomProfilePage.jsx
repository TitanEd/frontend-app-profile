/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Hyperlink } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';

// Components
import ProfileAvatar from './forms/ProfileAvatar';
import Name from './forms/Name';
import Country from './forms/Country';
import PreferredLanguage from './forms/PreferredLanguage';
import Education from './forms/Education';
import SocialLinks from './forms/SocialLinks';
import Bio from './forms/Bio';
import Certificates from './forms/Certificates';
import AgeMessage from './AgeMessage';
import DateJoined from './DateJoined';
import UsernameDescription from './UsernameDescription';
import PageLoading from './PageLoading';
import LearningGoal from './forms/LearningGoal';

// i18n
import messages from './ProfilePage.messages';

const CustomProfilePage = ({
  // Profile data
  profileImage,
  name,
  visibilityName,
  country,
  visibilityCountry,
  levelOfEducation,
  visibilityLevelOfEducation,
  socialLinks,
  draftSocialLinksByPlatform,
  visibilitySocialLinks,
  learningGoal,
  visibilityLearningGoal,
  languageProficiencies,
  visibilityLanguageProficiencies,
  courseCertificates,
  visibilityCourseCertificates,
  bio,
  visibilityBio,
  requiresParentalConsent,
  isLoadingProfile,
  yearOfBirth,
  dateJoined,
  photoUploadError,
  savePhotoState,
  onSavePhoto,
  onDeletePhoto,
  enableSkillsBuilderProfile,

  // URLs
  viewMyRecordsUrl,
  accountSettingsUrl,

  // User info
  username,
  isAuthenticatedUserProfile,

  // Form handlers
  commonFormProps,

  // i18n
  intl,
}) => {
  const isYOBDisabled = () => {
    const currentYear = new Date().getFullYear();
    const isAgeOrNotCompliant = !yearOfBirth || ((currentYear - yearOfBirth) < 13);
    return isAgeOrNotCompliant && getConfig().COLLECT_YEAR_OF_BIRTH !== 'true';
  };

  // Inserted into the DOM in two places (for responsive layout)
  const renderViewMyRecordsButton = () => {
    if (!(viewMyRecordsUrl && isAuthenticatedUserProfile)) {
      return null;
    }

    return (
      <Hyperlink className="btn btn-primary" destination={viewMyRecordsUrl} target="_blank">
        {intl.formatMessage(messages['profile.viewMyRecords'])}
      </Hyperlink>
    );
  };

  // Inserted into the DOM in two places (for responsive layout)
  const renderHeadingLockup = () => (
    <span data-hj-suppress>
      <h1 className="h2 mb-0 font-weight-bold text-truncate">{username}</h1>
      <DateJoined date={dateJoined} />
      {isYOBDisabled() && <UsernameDescription />}
      <hr className="d-none d-md-block" />
    </span>
  );

  const renderPhotoUploadErrorMessage = () => {
    if (photoUploadError === null) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <Alert variant="danger" dismissible={false} show>
            {photoUploadError.userMessage}
          </Alert>
        </div>
      </div>
    );
  };

  const renderAgeMessage = () => {
    const shouldShowAgeMessage = requiresParentalConsent && isAuthenticatedUserProfile;

    if (!shouldShowAgeMessage) {
      return null;
    }
    return <AgeMessage accountSettingsUrl={accountSettingsUrl} />;
  };

  if (isLoadingProfile) {
    return <PageLoading srMessage={intl.formatMessage(messages['profile.loading'])} />;
  }

  const isBlockVisible = (blockInfo) => isAuthenticatedUserProfile
    || (!isAuthenticatedUserProfile && Boolean(blockInfo));

  const isLanguageBlockVisible = isBlockVisible(languageProficiencies.length);
  const isEducationBlockVisible = isBlockVisible(levelOfEducation);
  const isSocialLinksBLockVisible = isBlockVisible(socialLinks.some((link) => link.socialLink !== null));
  const isBioBlockVisible = isBlockVisible(bio);
  const isCertificatesBlockVisible = isBlockVisible(courseCertificates.length);
  const isNameBlockVisible = isBlockVisible(name);
  const isLocationBlockVisible = isBlockVisible(country);

  return (
    <div className="container-fluid profile-page-container">
      <div className="row align-items-center pt-4 mb-4 pt-md-0 mb-md-0">
        <div className="col-auto col-md-4 col-lg-3">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
            <ProfileAvatar
              className="mb-3 mb-md-0"
              src={profileImage.src}
              isDefault={profileImage.isDefault}
              onSave={onSavePhoto}
              onDelete={onDeletePhoto}
              savePhotoState={savePhotoState}
              isEditable={isAuthenticatedUserProfile && !requiresParentalConsent}
            />
            <div className="ml-md-3">
              {renderHeadingLockup()}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-none d-md-block float-right">
            {renderViewMyRecordsButton()}
          </div>
        </div>
      </div>
      <div className="container-fluid">
        {renderPhotoUploadErrorMessage()}
        <div className="row">
          <div className="col-12">
            <div className="card-section mb-4">
              <div className="card-section-header">
                <h5 className="card-section-title">Personal Information</h5>
                <hr className="customHr" />
              </div>
              <div className="card-section-content">
                {isNameBlockVisible && (
                  <Name
                    name={name}
                    visibilityName={visibilityName}
                    formId="name"
                    {...commonFormProps}
                  />
                )}
                {isLocationBlockVisible && (
                  <Country
                    country={country}
                    visibilityCountry={visibilityCountry}
                    formId="country"
                    {...commonFormProps}
                  />
                )}
                {isEducationBlockVisible && (
                  <Education
                    levelOfEducation={levelOfEducation}
                    visibilityLevelOfEducation={visibilityLevelOfEducation}
                    formId="levelOfEducation"
                    {...commonFormProps}
                  />
                )}
                {isSocialLinksBLockVisible && (
                  <SocialLinks
                    socialLinks={socialLinks}
                    draftSocialLinksByPlatform={draftSocialLinksByPlatform}
                    visibilitySocialLinks={visibilitySocialLinks}
                    formId="socialLinks"
                    {...commonFormProps}
                  />
                )}
                {isLanguageBlockVisible && (
                  <PreferredLanguage
                    languageProficiencies={languageProficiencies}
                    visibilityLanguageProficiencies={visibilityLanguageProficiencies}
                    formId="languageProficiencies"
                    {...commonFormProps}
                  />
                )}
              </div>
            </div>

            {/* About Me Card */}
            {isBioBlockVisible && (
              <div className="card-section mb-4">
                <div className="card-section-header">
                  <h5 className="card-section-title">About Me</h5>
                  <hr className="customHr" />
                </div>
                <div className="card-section-content">
                  <Bio
                    bio={bio}
                    visibilityBio={visibilityBio}
                    formId="bio"
                    {...commonFormProps}
                  />
                </div>
              </div>
            )}

            {/* My Certificates Card */}
            {isCertificatesBlockVisible && (
              <div className="card-section mb-4">
                <div className="card-section-header">
                  <h5 className="card-section-title">My Certificates</h5>
                  <hr className="customHr" />
                </div>
                <div className="card-section-content">
                  <Certificates
                    visibilityCourseCertificates={visibilityCourseCertificates}
                    formId="certificates"
                    {...commonFormProps}
                  />
                </div>
              </div>
            )}

            {/* Learning Goal Card */}
            {enableSkillsBuilderProfile && (
              <div className="card-section mb-4">
                <div className="card-section-header">
                  <h5 className="card-section-title">Learning Goal</h5>
                  <hr className="customHr" />
                </div>
                <div className="card-section-content">
                  <LearningGoal
                    learningGoal={learningGoal}
                    visibilityLearningGoal={visibilityLearningGoal}
                    formId="learningGoal"
                    {...commonFormProps}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CustomProfilePage.propTypes = {
  // Profile data
  requiresParentalConsent: PropTypes.bool,
  dateJoined: PropTypes.string,
  bio: PropTypes.string,
  yearOfBirth: PropTypes.number,
  visibilityBio: PropTypes.string.isRequired,
  courseCertificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  visibilityCourseCertificates: PropTypes.string.isRequired,
  country: PropTypes.string,
  visibilityCountry: PropTypes.string.isRequired,
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.string.isRequired,
  languageProficiencies: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
  })),
  visibilityLanguageProficiencies: PropTypes.string.isRequired,
  name: PropTypes.string,
  visibilityName: PropTypes.string.isRequired,
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibilitySocialLinks: PropTypes.string.isRequired,
  learningGoal: PropTypes.string,
  visibilityLearningGoal: PropTypes.string.isRequired,
  profileImage: PropTypes.shape({
    src: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isLoadingProfile: PropTypes.bool.isRequired,
  photoUploadError: PropTypes.objectOf(PropTypes.string),

  // URLs
  viewMyRecordsUrl: PropTypes.string,
  accountSettingsUrl: PropTypes.string,

  // User info
  username: PropTypes.string.isRequired,
  isAuthenticatedUserProfile: PropTypes.bool.isRequired,

  // Form handlers
  commonFormProps: PropTypes.object.isRequired,
  onSavePhoto: PropTypes.func.isRequired,
  onDeletePhoto: PropTypes.func.isRequired,
  enableSkillsBuilderProfile: PropTypes.bool,

  // i18n
  intl: PropTypes.object.isRequired,
};

CustomProfilePage.defaultProps = {
  savePhotoState: null,
  photoUploadError: {},
  profileImage: {},
  name: null,
  yearOfBirth: null,
  levelOfEducation: null,
  country: null,
  socialLinks: [],
  draftSocialLinksByPlatform: {},
  bio: null,
  learningGoal: null,
  languageProficiencies: [],
  courseCertificates: null,
  requiresParentalConsent: null,
  dateJoined: null,
  viewMyRecordsUrl: null,
  accountSettingsUrl: null,
};

export default CustomProfilePage;
