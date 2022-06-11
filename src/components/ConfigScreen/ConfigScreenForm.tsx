import React from 'react';
import styled from '@emotion/styled';
import tokens from '@contentful/forma-36-tokens';
import {
  Button,
  Heading,
  Form,
  TextField,
  TextLink,
  SelectField,
  Option,
} from '@contentful/forma-36-react-components';

import { Webhook } from '../../lib/types';
import Row from '../Row';

const requestMethods = ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'];

const WebhookContainer = styled.div`
  margin-bottom: ${tokens.spacingXl};
`;

const StyledTextLink = styled(TextLink)`
  margin-bottom: ${tokens.spacingS};
  margin-left: auto;
`;

type TProps = {
  addWebhook: () => void;
  fieldErrors: { [name: string]: string }[];
  removeWebhook: (index: number) => void;
  setFieldError: (index: number, name: string, error: string | null) => void;
  setWebhookParameter: (index: number, name: string, value: string) => void;
  webhooks: Webhook[] | undefined;
};

export function ConfigScreenForm({
  addWebhook,
  fieldErrors,
  removeWebhook,
  setFieldError,
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
                  const target = event.target;
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
                  const target = event.target;
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
                  const target = event.target;
                  setWebhookParameter(index, target.name, target.value);
                }}
                testId={`button-text-input-${index}`}
              />
            </Row>
            <Row>
              <SelectField
                name="requestMethod"
                id="requestMethod"
                labelText="Request method"
                helpText="The method of the request sent."
                value={webhook.requestMethod || ''}
                onChange={(event) => {
                  const target = event.target;
                  setWebhookParameter(index, target.name, target.value);
                }}
                testId={`request-method-input-${index}`}
              >
                {requestMethods.map((requestMethod) => (
                  <Option key={requestMethod} value={requestMethod}>
                    {requestMethod}
                  </Option>
                ))}
              </SelectField>
            </Row>
            <Row>
              <TextField
                name="requestBody"
                id="requestBody"
                labelText="Request body"
                helpText="JSON for the body of the request sent (if applicable, this field will throw an error for a GET request for instance)."
                value={webhook.requestBody || ''}
                onChange={(event) => {
                  const target = event.target;
                  setWebhookParameter(index, target.name, target.value);

                  if (!target.value?.length) {
                    setFieldError(index, target.name, null);
                    return;
                  }

                  try {
                    JSON.parse(target.value);
                    setFieldError(index, target.name, null);
                  } catch (e) {
                    setFieldError(index, target.name, 'Invalid JSON');
                  }
                }}
                testId={`request-body-input-${index}`}
                validationMessage={fieldErrors[index]?.requestBody}
                textarea
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
