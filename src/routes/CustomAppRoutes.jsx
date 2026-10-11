import React from 'react';
import { AuthenticatedPageRoute, PageWrap } from '@edx/frontend-platform/react';
import { Routes, Route } from 'react-router-dom';
import { NotFoundPage } from '../profile';
import CustomProfilePage from '../profile/CustomProfilePage';

const CustomAppRoutes = () => (
  <Routes>
    <Route path="/u/:username" element={<AuthenticatedPageRoute><CustomProfilePage /></AuthenticatedPageRoute>} />
    <Route path="/notfound" element={<PageWrap><NotFoundPage /></PageWrap>} />
    <Route path="*" element={<PageWrap><NotFoundPage /></PageWrap>} />
  </Routes>
);

export default CustomAppRoutes;
