import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SidebarExtensionSDK } from 'contentful-ui-extensions-sdk';

import { Parameters } from '../../lib/types';
import Sidebar from '.';

const startAutoResizerMock = jest.fn();

const sdkMock = {
  parameters: {
    installation: {
      webhooks: undefined,
    } as Parameters,
  },
  window: {
    startAutoResizer: startAutoResizerMock,
  } as any,
} as SidebarExtensionSDK;

const defaultButtonText = 'Trigger webhook';
const triggerButtonTestId = 'trigger-webhook-button';

describe('Sidebar', () => {
  it('Should call startAutoResizer', () => {
    render(<Sidebar sdk={sdkMock} />);

    expect(startAutoResizerMock).toHaveBeenCalledTimes(1);
  });

  describe('When there are no webhooks configured', () => {
    it('Should show a no-webhookds warning', () => {
      render(<Sidebar sdk={sdkMock} />);

      expect(screen.getByTestId('no-webhooks-note')).toBeVisible();
    });
  });

  describe('When there is one webhook configured', () => {
    beforeEach(() => {
      (sdkMock.parameters.installation as any).webhooks = [
        {
          name: '',
          webhookUrl: '',
          buttonText: '',
        },
      ];
    });
    it('Should show a no-url warning', () => {
      render(<Sidebar sdk={sdkMock} />);

      expect(screen.getByTestId('no-webhook-url-note')).toBeVisible();
    });
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
        (sdkMock.parameters.installation as any).webhooks = [
          {
            name: '',
            webhookUrl: '',
            buttonText: 'Custom button text',
          },
        ];
      });
      it('Should render the text in the button', () => {
        const component = render(<Sidebar sdk={sdkMock} />);

        expect(component.getByTestId(triggerButtonTestId)).toHaveTextContent(
          'Custom button text'
        );
      });

      describe('When the webhook URL is configured', () => {
        beforeEach(() => {
          (sdkMock.parameters.installation as any).webhooks = [
            {
              name: '',
              webhookUrl: 'https://www.google.com',
              buttonText: 'Custom button text',
            },
          ];
        });
        it('Should not show a warning', () => {
          const component = render(<Sidebar sdk={sdkMock} />);

          expect(
            component.queryByTestId('no-webhook-url-note')
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
            it('Should do a POST request to the webhook URL', async () => {
              render(<Sidebar sdk={sdkMock} />);
              fireEvent.click(screen.getByTestId('trigger-webhook-button'));

              await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                  'https://www.google.com',
                  {
                    method: 'POST',
                    body: undefined,
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                );
              });
            });
            describe('And the requestMethod and requestBody properties were set', () => {
              beforeEach(() => {
                (sdkMock.parameters.installation as any).webhooks = [
                  {
                    name: '',
                    webhookUrl: 'https://www.google.com',
                    buttonText: 'Custom button text',
                    requestMethod: 'PATCH',
                    requestBody: '{"testing": 123}',
                  },
                ];

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
              it('Should do a POST request to the webhook URL with the specified method and body', async () => {
                render(<Sidebar sdk={sdkMock} />);
                fireEvent.click(screen.getByTestId('trigger-webhook-button'));

                await waitFor(() => {
                  expect(global.fetch).toHaveBeenCalledWith(
                    'https://www.google.com',
                    {
                      method: 'PATCH',
                      body: '{"testing": 123}',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    }
                  );
                });
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
  });

  describe('When there are multiple webhooks configured', () => {
    beforeEach(() => {
      (sdkMock.parameters.installation as any).webhooks = [
        {
          name: 'Test 1',
          webhookUrl: 'https://www.google.com/search?q=1',
          buttonText: 'Button text 1',
        },
        {
          name: 'Test 2',
          webhookUrl: 'https://www.google.com/search?q=2',
          buttonText: 'Button text 2',
        },
        {
          name: 'Test 2',
          webhookUrl: 'https://www.google.com/search?q=3',
          buttonText: 'Button text 3',
        },
      ];
    });
    it('Should render a webhook select', () => {
      render(<Sidebar sdk={sdkMock} />);

      expect(screen.getByTestId('webhook-select')).toBeVisible();
    });
    it('Should show the button text of the first webhook', () => {
      render(<Sidebar sdk={sdkMock} />);

      expect(screen.getByTestId('trigger-webhook-button')).toHaveTextContent(
        'Button text 1'
      );
    });
    describe('When the trigger button is clicked', () => {
      beforeEach(() => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
          })
        ) as any;
      });
      it('Should do a POST request to the first webhook URL', async () => {
        render(<Sidebar sdk={sdkMock} />);

        fireEvent.click(screen.getByTestId('trigger-webhook-button'));

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(
            'https://www.google.com/search?q=1',
            {
              method: 'POST',
              body: undefined,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        });
      });
    });
    describe('Describe when the second webhook is selected', () => {
      beforeEach(() => {
        render(<Sidebar sdk={sdkMock} />);

        fireEvent.change(screen.getByTestId('webhook-select'), {
          target: { value: 1 },
        });
      });
      it('Should show the button text of the second webhook', () => {
        expect(screen.getByTestId('trigger-webhook-button')).toHaveTextContent(
          'Button text 2'
        );
      });
      describe('When the trigger button is clicked', () => {
        beforeEach(() => {
          global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: true,
            })
          ) as any;
        });
        it('Should do a POST request to the second webhook URL', async () => {
          fireEvent.click(screen.getByTestId('trigger-webhook-button'));

          await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
              'https://www.google.com/search?q=2',
              {
                method: 'POST',
                body: undefined,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
          });
        });
      });
    });
  });
});
