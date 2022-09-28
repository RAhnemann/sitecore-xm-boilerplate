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
  fields: {
    LogoImage: {
      value: {
        src: '/local/Home/Project/demo-site/demo-site/sc_logo.png',
        alt: 'Sitecore Logo',
      },
    },
    HeroImage: {
      value: {
        src: '/local/Home/Project/demo-site/demo-site/sitecore-betty.jpg',
        alt: 'Sitecore Betty',
      },
    },
    Title: {
      value: 'Welcome to RP Storybook!!'
    },
    BodyText: {
      value: '<strong>Bacon ipsum</strong> dolor amet fatback porchetta bresaola pork chop boudin pancetta kielbasa turkey tongue bacon pork belly pig. Filet mignon turducken brisket, corned beef salami tri-tip hamburger leberkas. Short loin picanha ham meatball cow chislic bacon cupim brisket ribeye rump pork chop porchetta jerky strip steak. Pastrami meatloaf bresaola ground round pork picanha burgdoggen cupim meatball doner tongue sirloin t-bone jerky pork chop.'
    },
  }
};
