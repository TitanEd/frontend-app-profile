import {
  saveProfilePhotoBegin,
  saveProfilePhotoFailure,
  saveProfilePhotoReset,
  saveProfilePhotoSuccess,
} from './actions';
import { postProfilePhoto } from './services';

// Unlike the core saga, surfaces the API validation error (e.g. file too large / wrong type).
// eslint-disable-next-line import/prefer-default-export
export const customSaveProfilePhoto = (username, formData) => async (dispatch) => {
  try {
    dispatch(saveProfilePhotoBegin());
    const photoResult = await postProfilePhoto(username, formData);
    dispatch(saveProfilePhotoSuccess(photoResult));
    dispatch(saveProfilePhotoReset());
  } catch (e) {
    if (e.processedData) {
      dispatch(saveProfilePhotoFailure(e.processedData));
    } else {
      dispatch(saveProfilePhotoReset());
    }
  }
};
