import React from 'react';
import { render } from 'react-dom';

import {
  AppExtensionSDK,
  SidebarExtensionSDK,
  init,
  locations,
} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';

import Config from './components/ConfigScreen';
import Sidebar from './components/Sidebar';

init((sdk) => {
  const root = document.getElementById('root');

  const ComponentLocationSettings = [
    {
      location: locations.LOCATION_APP_CONFIG,
      component: <Config sdk={sdk as AppExtensionSDK} />,
    },
    {
      location: locations.LOCATION_ENTRY_SIDEBAR,
      component: <Sidebar sdk={sdk as SidebarExtensionSDK} />
    },
  ];

  ComponentLocationSettings.forEach((componentLocationSetting) => {
    if (sdk.location.is(componentLocationSetting.location)) {
      render(componentLocationSetting.component, root);
    }
  });
});
