import React from 'react';
import { render, screen } from '@testing-library/react';

import Config from '../components/ConfigScreen';

const sdkMock = {
  app: {
    getParameters: () => {},
    onConfigure: () => {},
    setReady: () => {},
  },
} as any;

describe('Config', () => {
  describe('When there are no webhooks', () => {
    it('Should match snapshot', async () => {
      render(<Config sdk={sdkMock} />);

      expect(await screen.findByTestId('container')).toMatchSnapshot();
    });
    describe('When the add button is clicked', () => {
      it('Should render config fields for a webhook', () => {
        render(<Config sdk={sdkMock} />);

        screen.getByTestId('add-webhook-button').click();

        expect(screen.getByTestId('webhook-fields-0')).toBeVisible();
      });
    });
    describe('When the add button is clicked twice', () => {
      it('Should render config fields for two webhooks', () => {
        render(<Config sdk={sdkMock} />);

        screen.getByTestId('add-webhook-button').click();
        screen.getByTestId('add-webhook-button').click();

        expect(screen.getByTestId('webhook-fields-0')).toBeVisible();
        expect(screen.getByTestId('webhook-fields-1')).toBeVisible();
      });
    });
  });

  describe('When there is an empty webhook', () => {
    beforeEach(() => {
      sdkMock.app.getParameters = () => ({
        webhooks: [
          {
            name: undefined,
            buttonText: undefined,
            webhookUrl: undefined,
          },
        ],
      });
    });
    it('Should match snapshot', async () => {
      render(<Config sdk={sdkMock} />);

      expect(await screen.findByTestId('container')).toMatchSnapshot();
    });
    it('Should render empty fields', async () => {
      render(<Config sdk={sdkMock} />);

      expect(await screen.findByTestId('webhook-fields-0')).toBeVisible();
      expect(
        (await screen.findByTestId('name-input-0')).querySelector('input')
      ).toHaveValue('');
    });
  });

  describe('When there is a webhook with values', () => {
    beforeEach(() => {
      sdkMock.app.getParameters = () => ({
        webhooks: [
          {
            name: 'Test',
            buttonText: 'Custom button text',
            webhookUrl: 'https://www.google.com',
          },
        ],
      });
    });
    it('Should match snapshot', async () => {
      render(<Config sdk={sdkMock} />);

      expect(await screen.findByTestId('container')).toMatchSnapshot();
    });
    it('Should render the parameters in the fields', async () => {
      render(<Config sdk={sdkMock} />);

      expect(
        (await screen.findByTestId('name-input-0')).querySelector('input')
      ).toHaveValue('Test');
      expect(
        (await screen.findByTestId('button-text-input-0')).querySelector(
          'input'
        )
      ).toHaveValue('Custom button text');
      expect(
        (await screen.findByTestId('webhook-url-input-0')).querySelector(
          'input'
        )
      ).toHaveValue('https://www.google.com');
    });
    describe('And a delete link is clicked', () => {
      it('Should delete the fields for that webhook', async () => {
        render(<Config sdk={sdkMock} />);

        expect(await screen.findByTestId('webhook-fields-0')).toBeVisible();
        screen.getByTestId('delete-webhook-button-0').click();
        expect(await screen.queryByTestId('webhook-fields-0')).toBe(null);
      });
    });
  });

  describe('When there are multiple webhooks with values', () => {
    beforeEach(() => {
      sdkMock.app.getParameters = () => ({
        webhooks: [
          {
            name: 'Test 1',
            buttonText: 'Custom button text 1',
            webhookUrl: 'https://www.google.com/search?q=1',
          },
          {
            name: 'Test 2',
            buttonText: 'Custom button text 2',
            webhookUrl: 'https://www.google.com/search?q=2',
          },
        ],
      });
    });
    describe('And a delete link is clicked', () => {
      it('Should delete the fields for that webhook', async () => {
        render(<Config sdk={sdkMock} />);

        expect(await screen.findByTestId('webhook-fields-1')).toBeVisible();
        screen.getByTestId('delete-webhook-button-1').click();
        expect(await screen.queryByTestId('webhook-fields-1')).toBe(null);
      });
    });
  });
});
