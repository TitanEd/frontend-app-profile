import React from 'react';
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import CustomProfilePage from './src/profile/CustomProfilePage';

const getPluginSlots = () => {
  if (typeof window !== 'undefined' && localStorage.getItem('oldUI') === 'true') {
    return {};
  }

  return {
    profile_page_plugin_slot: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'profile-page-plugin-slot',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: (props) => <CustomProfilePage {...props} />,
          },
        },
      ],
    },
  };
};

// Load environment variables from .env file
const config = {
  ...process.env,
  get pluginSlots() {
    return getPluginSlots();
  },
};

export default config;
