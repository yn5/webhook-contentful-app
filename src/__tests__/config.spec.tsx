import React from 'react';
import { render, waitFor } from '@testing-library/react';

import Config from '../components/ConfigScreen';

const sdkMock = {
  app: {
    getParameters: () => {},
    onConfigure: () => {},
    setReady: () => {},
  },
} as any;

describe('Config', () => {
  describe('When there are no stored appParameters', () => {
    it('Should render empty fields', async () => {
      const component = render(<Config sdk={sdkMock} />);

      await waitFor(() =>
        expect(
          component.getByTestId('webhook-url-input').querySelector('input')
        ).toHaveValue('')
      );
      await waitFor(() =>
        expect(
          component.getByTestId('button-text-input').querySelector('input')
        ).toHaveValue('')
      );
    });
  });
  describe('When there are stored app parameters', () => {
    beforeEach(() => {
      sdkMock.app.getParameters = () => ({
        buttonText: 'Custom button text',
        webhookUrl: 'https://www.google.com',
      });
    });
    it('Should render the parameters in the fields', async () => {
      const component = render(<Config sdk={sdkMock} />);

      await waitFor(() =>
        expect(
          component.getByTestId('webhook-url-input').querySelector('input')
        ).toHaveValue('https://www.google.com')
      );
      await waitFor(() =>
        expect(
          component.getByTestId('button-text-input').querySelector('input')
        ).toHaveValue('Custom button text')
      );
    });
  });
});
