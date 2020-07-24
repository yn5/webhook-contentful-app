import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SidebarExtensionSDK } from 'contentful-ui-extensions-sdk';

import Sidebar from '../components/Sidebar';

const sdkMock = {
  parameters: {
    installation: {},
  },
} as SidebarExtensionSDK;

const defaultButtonText = 'Trigger webhook';
const triggerButtonTestId = 'trigger-webhook-button';

describe('Sidebar', () => {
  describe('When the button text is not configured', () => {
    it('Should render the default text in the button', () => {
      const component = render(<Sidebar sdk={sdkMock} />);

      expect(component.getByTestId(triggerButtonTestId)).toHaveTextContent(
        defaultButtonText
      );
    });
  });

  describe('When the button text is configured', () => {
    beforeEach(() => {
      (sdkMock.parameters.installation as any).buttonText =
        'Custom button text';
    });
    afterEach(() => {
      (sdkMock.parameters.installation as any).buttonText = undefined;
    });
    it('Should render the text in the button', () => {
      const component = render(<Sidebar sdk={sdkMock} />);

      expect(component.getByTestId(triggerButtonTestId)).toHaveTextContent(
        'Custom button text'
      );
    });
  });

  describe('When the webhook URL is not configured', () => {
    it('Should show a warning', () => {
      const component = render(<Sidebar sdk={sdkMock} />);

      expect(component.getByTestId('no-webhook-note')).toBeVisible();
    });
  });

  describe('When the webhook URL is configured', () => {
    beforeEach(() => {
      (sdkMock.parameters.installation as any).webhookUrl =
        'https://www.google.com';
    });
    afterEach(() => {
      (sdkMock.parameters.installation as any).webhookUrl = undefined;
    });
    it('Should not show a warning', () => {
      const component = render(<Sidebar sdk={sdkMock} />);

      expect(
        component.queryByTestId('no-webhook-note')
      ).not.toBeInTheDocument();
    });

    describe('When the deploy button is clicked', () => {
      describe('And calling the webhook succeeds', () => {
        beforeEach(() => {
          global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: true,
            })
          ) as any;
        });
        it('Should show a success note', async () => {
          render(<Sidebar sdk={sdkMock} />);
          fireEvent.click(screen.getByTestId(triggerButtonTestId));

          await waitFor(() => {
            expect(screen.getByTestId('success-note')).toBeVisible();
          });
        });
      });

      describe('And calling the webhook fails', () => {
        beforeEach(() => {
          global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: false,
            })
          ) as any;
        });
        it('Should show a failure note', async () => {
          render(<Sidebar sdk={sdkMock} />);
          fireEvent.click(screen.getByTestId(triggerButtonTestId));

          await waitFor(() => {
            expect(screen.getByTestId('failure-note')).toBeVisible();
          });
        });
      });
    });
  });
});
