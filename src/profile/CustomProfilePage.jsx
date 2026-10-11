import React, {
  useEffect, useState, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Hyperlink, Button, Container,
} from '@openedx/paragon';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { AppContext } from '@edx/frontend-platform/react';
import { useIntl } from '@edx/frontend-platform/i18n';

import {
  fetchProfile,
  saveProfile,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
} from './data/actions';
import { customSaveProfilePhoto } from './data/customActions';
import { customProfilePageSelector } from './data/customSelectors';
import withParams from '../utils/hoc';

// Components
// import ProfileAvatar from './forms/ProfileAvatar';
import CustomProfileAvatar from './forms/CustomProfileAvatar';
// import Name from './forms/Name';
// import Country from './forms/Country';
// import PreferredLanguage from './forms/PreferredLanguage';
// import Education from './forms/Education';
// import SocialLinks from './forms/SocialLinks';
// import Bio from './forms/Bio';
import Name from './custom-forms/Name';
import Country from './custom-forms/Country';
import PreferredLanguage from './custom-forms/PreferredLanguage';
import Education from './custom-forms/Education';
import SocialLinks from './custom-forms/SocialLinks';
import Bio from './custom-forms/Bio';
// import Certificates from './forms/Certificates';
// import Certificates from './Certificates';
import Certificates from './custom-forms/Certificates';
// import AgeMessage from './AgeMessage';
import DateJoined from './DateJoined';
// import UsernameDescription from './UsernameDescription';
import PageLoading from './PageLoading';
// import LearningGoal from './forms/LearningGoal';

import AdditionalProfileFieldsSlot from '../plugin-slots/AdditionalProfileFieldsSlot';

// i18n
import messages from './ProfilePage.messages';
import customProfileMessages from './CustomProfilePage.messages';

const CustomProfilePage = ({ params }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const context = useContext(AppContext);
  const {
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
    languageProficiencies,
    visibilityLanguageProficiencies,
    courseCertificates,
    bio,
    visibilityBio,
    isLoadingProfile,
    dateJoined,
    photoUploadError,
    savePhotoState,
    saveState,
    username,
    countryMessages,
    languageMessages,
    educationMessages,
  } = useSelector(customProfilePageSelector);

  const navigate = useNavigate();
  const [viewMyRecordsUrl, setViewMyRecordsUrl] = useState(null);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [isEditingAboutMe, setIsEditingAboutMe] = useState(false);
  const [isEditingCertificates, setIsEditingCertificates] = useState(false);

  useEffect(() => {
    const { CREDENTIALS_BASE_URL } = context.config;
    if (CREDENTIALS_BASE_URL) {
      setViewMyRecordsUrl(`${CREDENTIALS_BASE_URL}/records`);
    }

    dispatch(fetchProfile(params.username));
    sendTrackingLogEvent('edx.profile.viewed', {
      username: params.username,
    });
  }, [dispatch, params.username, context.config]);

  useEffect(() => {
    if (!username && saveState === 'error' && navigate) {
      navigate('/notfound');
    }
  }, [username, saveState, navigate]);

  const authenticatedUserName = context.authenticatedUser.username;
  const accountSettingsUrl = context.config.ACCOUNT_SETTINGS_URL;

  const handleSaveProfilePhoto = useCallback((formData) => {
    dispatch(customSaveProfilePhoto(authenticatedUserName, formData));
  }, [dispatch, authenticatedUserName]);

  const handleDeleteProfilePhoto = useCallback(() => {
    dispatch(deleteProfilePhoto(authenticatedUserName));
  }, [dispatch, authenticatedUserName]);

  const handleClose = useCallback((formId) => {
    dispatch(closeForm(formId));
  }, [dispatch]);

  const handleOpen = useCallback((formId) => {
    dispatch(openForm(formId));
  }, [dispatch]);

  const handleSubmit = useCallback((formId) => {
    dispatch(saveProfile(formId, authenticatedUserName));
  }, [dispatch, authenticatedUserName]);

  const handleChange = useCallback((fieldName, value) => {
    dispatch(updateDraft(fieldName, value));
  }, [dispatch]);

  const isAuthenticatedUserProfile = params.username === authenticatedUserName;

  const commonFormProps = {
    openHandler: handleOpen,
    closeHandler: handleClose,
    submitHandler: handleSubmit,
    changeHandler: handleChange,
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
      {/* {isYOBDisabled() && <UsernameDescription />} */}
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

  // eslint-disable-next-line arrow-body-style
  const renderAgeMessage = () => {
    // const shouldShowAgeMessage = requiresParentalConsent && isAuthenticatedUserProfile;
    //
    // if (!shouldShowAgeMessage) {
    //   return null;
    // }
    // return <AgeMessage accountSettingsUrl={accountSettingsUrl} />;
    return null;
  };

  if (isLoadingProfile) {
    return (
      <div className="profile-page">
        <PageLoading srMessage={intl.formatMessage(messages['profile.loading'])} />
      </div>
    );
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

  const educationLabel = educationMessages[levelOfEducation]
    ? intl.formatMessage(educationMessages[levelOfEducation])
    : intl.formatMessage(customProfileMessages['profile.personalInformation.notSpecified']);

  return (
    <div className="profile-page">
      <Container size="xl" className="profile-page-container">
        <div className="row align-items-center mb-4">
          <div className="col-auto col-md-4 col-lg-3">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
              <CustomProfileAvatar
                className="mb-3 mb-md-0"
                src={profileImage.src}
                isDefault={profileImage.isDefault}
                onSave={handleSaveProfilePhoto}
                onDelete={handleDeleteProfilePhoto}
                savePhotoState={savePhotoState}
                // requiresParentalConsent (true when the account has no year of birth).
                // isEditable={isAuthenticatedUserProfile && !requiresParentalConsent}
                isEditable={isAuthenticatedUserProfile}
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
        <div className="custom-profile-page-fluid-container">
          {renderPhotoUploadErrorMessage()}
          {renderAgeMessage()}
          {!renderAgeMessage() && (
            <div className="row">
              <div className="col-12">
                <section className="card-section mb-4" aria-labelledby="profile-personal-info-heading">
                  <div className="card-section-header">
                    <h2 id="profile-personal-info-heading" className="card-section-title h5 mb-0">{intl.formatMessage(customProfileMessages['profile.personalInformation.title'])}</h2>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setIsEditingPersonalInfo(!isEditingPersonalInfo)}
                      className="edit-button"
                    >
                      {isEditingPersonalInfo ? intl.formatMessage(customProfileMessages['profile.personalInformation.cancel']) : intl.formatMessage(customProfileMessages['profile.personalInformation.edit'])}
                    </Button>
                  </div>
                  <hr className="customHr" />
                  <div className="card-section-content">
                    {!isEditingPersonalInfo ? (
                    // Display view - Column layout
                      <div className="personal-info-grid">
                        <div className="info-column">
                          <div className="info-label">{intl.formatMessage(customProfileMessages['profile.personalInformation.fullName'])}</div>
                          <div className="info-value">{name || intl.formatMessage(customProfileMessages['profile.personalInformation.notSpecified'])}</div>
                        </div>
                        <div className="info-column">
                          <div className="info-label">{intl.formatMessage(customProfileMessages['profile.personalInformation.location'])}</div>
                          <div className="info-value">{countryMessages[country] || intl.formatMessage(customProfileMessages['profile.personalInformation.notSpecified'])}</div>
                        </div>
                        <div className="info-column">
                          <div className="info-label">{intl.formatMessage(customProfileMessages['profile.personalInformation.education'])}</div>
                          <div className="info-value">{educationLabel}</div>
                        </div>
                        <div className="info-column">
                          <div className="info-label">{intl.formatMessage(customProfileMessages['profile.personalInformation.socialLinks'])}</div>
                          <div className="info-value">
                            {socialLinks.some(link => link.socialLink) ? (
                              <span className="social-links-count">{intl.formatMessage(customProfileMessages['profile.personalInformation.linksCount'], { count: socialLinks.filter(link => link.socialLink).length })}</span>
                            ) : (
                              <button
                                type="button"
                                className="add-link btn btn-link p-0"
                                onClick={() => setIsEditingPersonalInfo(true)}
                              >
                                {intl.formatMessage(customProfileMessages['profile.personalInformation.add'])}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="info-column">
                          <div className="info-label">{intl.formatMessage(customProfileMessages['profile.personalInformation.primaryLanguage'])}</div>
                          <div className="info-value">
                            {languageProficiencies.length > 0 ? languageMessages[languageProficiencies[0].code] : intl.formatMessage(customProfileMessages['profile.personalInformation.notSpecified'])}
                          </div>
                        </div>
                      </div>
                    ) : (
                    // Edit view - Existing form components
                      <>
                        {isNameBlockVisible && (
                        <Name
                          name={name}
                          visibilityName={visibilityName}
                          accountSettingsUrl={accountSettingsUrl}
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
                      </>
                    )}
                    {/* Verawood slot org.openedx.frontend.profile.additional_profile_fields.v1.
                        Kept outside the view/edit toggle so extended fields stay available in the
                        Sumac card. The slot renders nothing when no plugin is configured. */}
                    <AdditionalProfileFieldsSlot />
                  </div>
                </section>

                {/* About Me Card */}
                <section className="card-section mb-4" aria-labelledby="profile-about-me-heading">
                  <div className="card-section-header">
                    <h2 id="profile-about-me-heading" className="card-section-title h5 mb-0">{intl.formatMessage(customProfileMessages['profile.aboutMe.title'])}</h2>
                    {bio ? (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setIsEditingAboutMe(!isEditingAboutMe)}
                        className="edit-button"
                      >
                        {isEditingAboutMe ? intl.formatMessage(customProfileMessages['profile.aboutMe.cancel']) : intl.formatMessage(customProfileMessages['profile.aboutMe.edit'])}
                      </Button>
                    ) : (
                      <Button
                        variant={isEditingAboutMe ? 'outline-primary' : 'primary'}
                        size="sm"
                        onClick={() => setIsEditingAboutMe(!isEditingAboutMe)}
                        className="edit-button"
                      >
                        {isEditingAboutMe ? intl.formatMessage(customProfileMessages['profile.aboutMe.cancel']) : intl.formatMessage(customProfileMessages['profile.aboutMe.add'])}
                      </Button>
                    )}
                  </div>
                  <hr className="customHr" />
                  <div className="card-section-content">
                    {!isEditingAboutMe ? (
                    // Display view - Show bio or placeholder
                      <div className="about-me-content">
                        {bio ? (
                          <div className="bio-text">
                            <p className="bio-paragraph">{bio}</p>
                          </div>
                        ) : (
                          <div className="no-bio-placeholder">
                            <p className="placeholder-text">{intl.formatMessage(customProfileMessages['profile.aboutMe.noInformation'])}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                    // Edit view - Existing Bio component
                      isBioBlockVisible && (
                      <Bio
                        bio={bio}
                        visibilityBio={visibilityBio}
                        formId="bio"
                        {...commonFormProps}
                      />
                      )
                    )}
                  </div>
                </section>

                {/* My Certificates Card */}
                <section className="card-section mb-4" aria-labelledby="profile-certificates-heading">
                  <div className="card-section-header">
                    <h2 id="profile-certificates-heading" className="card-section-title h5 mb-0">{intl.formatMessage(customProfileMessages['profile.certificates.title'])}</h2>
                    {courseCertificates && courseCertificates.length > 0 ? (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setIsEditingCertificates(!isEditingCertificates)}
                        className="edit-button"
                      >
                        {isEditingCertificates ? intl.formatMessage(customProfileMessages['profile.certificates.cancel']) : intl.formatMessage(customProfileMessages['profile.certificates.edit'])}
                      </Button>
                    ) : (
                      <Button
                        variant={isEditingCertificates ? 'outline-primary' : 'primary'}
                        size="sm"
                        onClick={() => setIsEditingCertificates(!isEditingCertificates)}
                        className="edit-button"
                      >
                        {isEditingCertificates ? intl.formatMessage(customProfileMessages['profile.certificates.cancel']) : intl.formatMessage(customProfileMessages['profile.certificates.add'])}
                      </Button>
                    )}
                  </div>
                  <hr className="customHr" />
                  <div className="card-section-content">
                    {!isEditingCertificates ? (
                    // Display view - Show certificates or placeholder
                      <div className="certificates-content">
                        {courseCertificates && courseCertificates.length > 0 ? (
                          <div className="certificates-list">
                            {courseCertificates.map((certificate, index) => (
                              <div key={index} className="certificate-item">
                                <h6 className="certificate-title">{certificate.courseDisplayName}</h6>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="no-certificates-placeholder">
                            <p className="placeholder-text">{intl.formatMessage(customProfileMessages['profile.certificates.noCertificates'])}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                    // Edit view - Existing Certificates component
                      isCertificatesBlockVisible && (
                      <Certificates
                        formId="certificates"
                        {...commonFormProps}
                      />
                      )
                    )}
                  </div>
                </section>

                {/*
                {enableSkillsBuilderProfile && (
                <div className="card-section mb-4">
                  <div className="card-section-header">
                    <h5 className="card-section-title">{intl.formatMessage(customProfileMessages['profile.learningGoal.title'])}</h5>
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
                */}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

CustomProfilePage.propTypes = {
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default withParams(CustomProfilePage);
