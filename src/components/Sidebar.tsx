import React, { useState } from 'react';
import styled from '@emotion/styled';
import tokens from '@contentful/forma-36-tokens';
import { Button, Note } from '@contentful/forma-36-react-components';
import { SidebarExtensionSDK } from 'contentful-ui-extensions-sdk';

import { Parameters } from '../lib/types';

const copy = {
  noWebhookUrl: 'No webhook URL is set in App configuration',
  triggerFailed: 'Trigger failed',
  triggerSucceeded: 'Trigger succeeded',
  triggerWebhook: 'Trigger webhook',
};

const StyledNote = styled(Note)`
  margin-top: ${tokens.spacingM};
`;

interface SidebarProps {
  sdk: SidebarExtensionSDK;
}

function Sidebar({ sdk }: SidebarProps) {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const appParameters: Parameters = sdk.parameters.installation;
  const noWebhookUrl = !appParameters.webhookUrl;
  const webhookUrl = appParameters.webhookUrl || '';

  async function handleClick() {
    setError(false);
    setLoading(true);
    setSuccess(false);

    const response = await fetch(webhookUrl, {
      method: 'POST',
    });

    setLoading(false);

    if (!response.ok) {
      setError(true);
      return;
    }

    setSuccess(true);
  }

  return (
    <>
      <Button
        testId="trigger-webhook-button"
        onClick={handleClick}
        disabled={noWebhookUrl || loading}
        loading={loading}
        isFullWidth
      >
        {appParameters.buttonText || copy.triggerWebhook}
      </Button>
      {success && (
        <StyledNote noteType="positive" testId="success-note">
          {copy.triggerSucceeded}
        </StyledNote>
      )}
      {noWebhookUrl && (
        <StyledNote noteType="warning" testId="no-webhook-note">
          {copy.noWebhookUrl}
        </StyledNote>
      )}
      {error && (
        <StyledNote noteType="negative" testId="failure-note">
          {copy.triggerFailed}
        </StyledNote>
      )}
    </>
  );
}

export default Sidebar;
