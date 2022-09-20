import { MockedProvider } from '@apollo/client/testing';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../src/scss/global.scss';

const customViewports = {
  mostMobile: {
    name: 'Mobile 375px',
    styles: {
      width: '375px',
      height: '812px',
    },
  },
  // according to https://gs.statcounter.com/screen-resolution-stats/tablet/united-states-of-america
  // this is the most common tablet size in the US
  mostUsedTablet: {
    name: 'Tablet 768px',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  iPadMini: {
    name: 'iPad Mini 744px',
    styles: {
      width: '744px',
      height: '1133px',
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  apolloClient: {
    MockedProvider,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: {
      ...MINIMAL_VIEWPORTS,
      ...customViewports,
    },
  },
};
