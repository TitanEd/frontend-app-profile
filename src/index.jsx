/* eslint-disable no-console */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR,
  APP_READY,
  getConfig,
  initialize,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';
import {
  AppProvider,
  ErrorPage,
} from '@edx/frontend-platform/react';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import Header from '@edx/frontend-component-header';
import FooterSlot from '@openedx/frontend-slot-footer';
import { getMessages, IntlProvider } from '@edx/frontend-platform/i18n';
import Layout from './Layout';

import messages from './i18n';
import configureStore from './data/configureStore';

import './index.scss';
// import './styles/styles-overrides.scss';
// import './Layout.scss';
import Head from './head/Head';

import AppRoutes from './routes/AppRoutes';
import { applyTheme } from './styles/themeLoader';

// import 'titaned-lib/dist/index.css';

// Load styles only for new UI
const loadStylesForNewUI = (isOldUI) => {
  document.body.className = isOldUI ? 'old-ui' : 'new-ui';
  document.documentElement.className = isOldUI ? 'old-ui' : 'new-ui';

  if (!isOldUI) {
    import('titaned-frontend-library/dist/index.css');
    import('./styles/styles-overrides.scss');
  } else {
    import('./styles/old-ui.scss');
  }
};

// Main App component with state management
const App = () => {
  const [oldUI, setOldUI] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuConfig, setMenuConfig] = useState(null);

  // Load UI preference and menu config in one API call to avoid race conditions
  useEffect(() => {
    const loadUIPreferenceAndMenuConfig = async () => {
      try {
        // First, load from localStorage for immediate display
        const localStorageValue = localStorage.getItem('oldUI') || 'false';
        setOldUI(localStorageValue);
        setLoading(false);

        // Then, fetch both UI preference and menu config in one API call
        const response = await getAuthenticatedHttpClient().get(`${getConfig().STUDIO_BASE_URL}/titaned/api/v1/menu-config/`);

        if (response.status === 200 && response.data) {
          setMenuConfig(response.data);

          // Extract UI preference from the same response
          const useNewUI = response.data.use_new_ui === true;
          const apiOldUIValue = !useNewUI ? 'true' : 'false';

          // Check if API response matches localStorage
          if (localStorageValue !== apiOldUIValue) {
            localStorage.setItem('oldUI', apiOldUIValue);
            // Reload page to re-run build-time config with correct localStorage
            window.location.reload();
            return;
          }

          console.log('localStorage and API are in sync, no reload needed');
        } else {
          console.warn('API failed, using localStorage value and default menu config');
          setMenuConfig({}); // Set empty object as fallback
        }
      } catch (error) {
        console.error('API call failed, using localStorage value and default menu config:', error);
        setMenuConfig({}); // Set empty object as fallback
      }
    };

    loadUIPreferenceAndMenuConfig();
  }, []);

  // Apply theme from JSON
  useEffect(() => {
    if (oldUI === 'false') {
      applyTheme(); // Load default theme from /theme.json
    }
  }, [oldUI]);

  useEffect(() => {
    // Only load styles after we know the UI preference
    if (oldUI !== null) {
      loadStylesForNewUI(oldUI === 'true');
    }
  }, [oldUI]);

  // Show loading screen while UI preference is being fetched
  if (loading || menuConfig === null) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-column vh-100">
        <div>Loading... Please wait...</div>
      </div>
    );
  }

  return (
    <AppProvider store={configureStore()}>
      <Head />
      {oldUI === 'false' ? (
        <Layout>
          <AppRoutes />
        </Layout>
      ) : (
        <>
          <Header />
          <main id="main">
            <AppRoutes />
          </main>
          <FooterSlot />
        </>
      )}
    </AppProvider>
  );
};

subscribe(APP_READY, () => {
  ReactDOM.render(
    <IntlProvider locale={getConfig().language || 'en'} messages={getMessages()}>
      <App />
    </IntlProvider>,
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
