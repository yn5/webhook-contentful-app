import React from 'react';
import styled from '@emotion/styled';
import tokens from '@contentful/forma-36-tokens';
import {
  Button,
  Heading,
  Form,
  TextField,
  TextLink,
} from '@contentful/forma-36-react-components';

import { Webhook } from '../../lib/types';
import Row from '../Row';

const WebhookContainer = styled.div`
  margin-bottom: ${tokens.spacingXl};
`;

const StyledTextLink = styled(TextLink)`
  margin-bottom: ${tokens.spacingS};
  margin-left: auto;
`;

type TProps = {
  addWebhook: () => void;
  removeWebhook: (index: number) => void;
  setWebhookParameter: (index: number, name: string, value: string) => void;
  webhooks: Webhook[] | undefined;
};

export function ConfigScreenForm({
  addWebhook,
  removeWebhook,
  setWebhookParameter,
  webhooks,
}: TProps) {
  return (
    <Form>
      {webhooks?.map((webhook, index) => {
        return (
          <WebhookContainer
            key={String(index)}
            data-test-id={`webhook-fields-${index}`}
          >
            <Row>
              <Heading>{webhook.name || `Webhook ${index + 1}`}</Heading>
            </Row>
            <Row>
              <TextField
                name="name"
                id="name"
                labelText="Name"
                value={webhook.name || ''}
                onChange={(event) => {
                  const target = event.target as HTMLInputElement;
                  setWebhookParameter(index, target.name, target.value);
                }}
                testId={`name-input-${index}`}
                required
              />
            </Row>
            <Row>
              <TextField
                name="webhookUrl"
                id="webhookUrl"
                labelText="Webhook URL"
                value={webhook.webhookUrl || ''}
                onChange={(event) => {
                  const target = event.target as HTMLInputElement;
                  setWebhookParameter(index, target.name, target.value);
                }}
                testId={`webhook-url-input-${index}`}
                required
              />
            </Row>
            <Row>
              <TextField
                name="buttonText"
                id="buttonText"
                labelText="Button text"
                helpText="The text that will be shown in the button that triggers the webhook"
                value={webhook.buttonText || ''}
                onChange={(event) => {
                  const target = event.target as HTMLInputElement;
                  setWebhookParameter(index, target.name, target.value);
                }}
                testId={`button-text-input-${index}`}
              />
            </Row>
            <Row>
              <StyledTextLink
                linkType="negative"
                onClick={() => removeWebhook(index)}
                testId={`delete-webhook-button-${index}`}
              >
                Delete webhook
              </StyledTextLink>
            </Row>
          </WebhookContainer>
        );
      })}
      <Button onClick={addWebhook} testId="add-webhook-button">
        Add Webhook
      </Button>
    </Form>
  );
}
