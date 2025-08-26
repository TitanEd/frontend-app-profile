import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';
import {
  AppProvider,
  ErrorPage,
} from '@edx/frontend-platform/react';

import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './Layout';

import messages from './i18n';
import configureStore from './data/configureStore';

import './index.scss';
import './styles/styles-overrides.scss';
// import './Layout.scss';
import Head from './head/Head';

import AppRoutes from './routes/AppRoutes';

import 'titaned-lib/dist/index.css';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={configureStore()}>
      <Head />
      <Layout>
        <AppRoutes />
      </Layout>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        COLLECT_YEAR_OF_BIRTH: process.env.COLLECT_YEAR_OF_BIRTH,
        ENABLE_SKILLS_BUILDER_PROFILE: process.env.ENABLE_SKILLS_BUILDER_PROFILE,
      }, 'App loadConfig override handler');
    },
  },
});
