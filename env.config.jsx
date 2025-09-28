import React from 'react';
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import CustomProfilePage from './src/profile/CustomProfilePage';

const config = {
  ...process.env,
  pluginSlots: {
    profile_page_plugin_slott: {
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
  },
};

export default config;
