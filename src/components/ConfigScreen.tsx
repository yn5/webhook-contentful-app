import React, { useEffect, useState } from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import {
  Heading,
  Form,
  TextField,
  Workbench,
} from '@contentful/forma-36-react-components';

import { Parameters } from '../lib/types';

function Config({ sdk }: { sdk: AppExtensionSDK }) {
  const [appParameters, setAppParameters] = useState<Parameters>({});

  useEffect(() => {
    (async () => {
      const { app } = sdk;
      app.setReady();

      const parameters = await app.getParameters();
      setAppParameters(parameters || {});
    })();
  }, [sdk]);

  useEffect(() => {
    const { app } = sdk;

    app.onConfigure(async () => {
      return { parameters: appParameters };
    });
  });

  function setAppParameter(name: string, value: string) {
    setAppParameters({
      ...appParameters,
      [name]: value,
    });
  }

  return (
    <Workbench>
      <Workbench.Content>
        <Form>
          <Heading>Webhook</Heading>
          <TextField
            name="webhookUrl"
            id="webhookUrl"
            labelText="Webhook URL"
            value={appParameters.webhookUrl || ''}
            onChange={(event) => {
              const target = event.target as HTMLInputElement;
              setAppParameter(target.name, target.value);
            }}
            testId="webhook-url-input"
            required
          />

          <TextField
            name="buttonText"
            id="buttonText"
            labelText="Button text"
            helpText="The text that will be shown in the button that triggers the webhook"
            value={appParameters.buttonText || ''}
            onChange={(event) => {
              const target = event.target as HTMLInputElement;
              setAppParameter(target.name, target.value);
            }}
            testId="button-text-input"
          />
        </Form>
      </Workbench.Content>
    </Workbench>
  );
}

export default Config;
