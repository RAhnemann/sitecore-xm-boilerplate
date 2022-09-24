import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import HelloSitecore from '.';

export default {
  title: 'Components/HelloSitecore',
  component: HelloSitecore,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};
const Template = (args) => <HelloSitecore {...args} />;

export const Default = Template.bind({});

Default.args = {
  params: {},
  sitecoreContext: {
    route: {
      fields: {
        Logo: {
          value: ''
        },
        Title: {
          value: 'Welcome to RP Storybook!'
        },
        Logo: {
          value: {
            src: '',
            alt: 'Sitecore Betty',
          },
        },
      }
    }
  }
};
