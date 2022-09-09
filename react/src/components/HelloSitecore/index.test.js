import React from 'react';
import { render } from '@testing-library/react';
import HomePageHero from '.';

describe('HomePageHero tests', () => {
  test('should render without error', async () => {
    expect(() => render(<HomePageHero />)).not.toThrow();
  });
});
