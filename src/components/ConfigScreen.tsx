import React, { Component } from 'react';
import styled from '@emotion/styled';
import tokens from '@contentful/forma-36-tokens';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import {
  Button,
  Heading,
  Form,
  TextField,
  TextLink,
  Workbench,
} from '@contentful/forma-36-react-components';

import { ContentType, Parameters } from '../lib/types';
import Row from './Row';

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  parameters: Parameters;
  targetState?: {
    EditorInterface: { [key: string]: { sidebar: { position: number } } };
  };
}

const WebhookContainer = styled.div`
  margin-bottom: ${tokens.spacingXl};
`;

const StyledTextLink = styled(TextLink)`
  margin-bottom: ${tokens.spacingS};
  margin-left: auto;
`;

class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = { parameters: {} };

    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount(): Promise<void> {
    const parameters: Parameters | null = await this.props.sdk.app.getParameters();

    this.setState(parameters ? { parameters } : this.state, () => {
      this.props.sdk.app.setReady();
    });
  }

  onConfigure = async (): Promise<ConfigState> => {
    const {
      items: contentTypes,
    }: { items: ContentType[] } = await this.props.sdk.space.getContentTypes();

    const contentTypeIds = contentTypes.map(
      (contentType) => contentType.sys.id
    );
    const EditorInterface = contentTypeIds.reduce((result, id) => {
      return { ...result, [id]: { sidebar: { position: 0 } } };
    }, {});

    return {
      parameters: this.state.parameters,
      targetState: { EditorInterface },
    };
  };

  setWebhookParameter(index: number, name: string, value: string): void {
    const { parameters } = this.state;

    if (!parameters?.webhooks) {
      return;
    }

    this.setState({
      parameters: {
        ...parameters,
        webhooks: [
          ...parameters.webhooks.slice(0, index),
          {
            ...parameters.webhooks[index],
            [name]: value,
          },
          ...parameters.webhooks.slice(index + 1),
        ],
      },
    });
  }

  addWebhook = (): void => {
    const { parameters } = this.state;

    this.setState({
      parameters: {
        ...parameters,
        webhooks: [
          ...(parameters.webhooks || []),
          {
            buttonText: undefined,
            name: undefined,
            webhookUrl: undefined,
          },
        ],
      },
    });
  };

  removeWebhook = (index: number): void => {
    const { parameters } = this.state;

    if (!parameters?.webhooks) {
      return;
    }

    if (this.state.parameters.webhooks?.length === 1) {
      this.setState({
        parameters: {
          ...parameters,
          webhooks: undefined,
        },
      });
      return;
    }

    this.setState({
      parameters: {
        ...parameters,
        webhooks: [
          ...parameters.webhooks.slice(0, index),
          ...parameters.webhooks.slice(index + 1),
        ],
      },
    });
  };

  render(): React.ReactElement {
    const { parameters } = this.state;
    const { webhooks } = parameters;

    return (
      <Workbench testId="container">
        <Workbench.Content>
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
                        this.setWebhookParameter(
                          index,
                          target.name,
                          target.value
                        );
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
                        this.setWebhookParameter(
                          index,
                          target.name,
                          target.value
                        );
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
                        this.setWebhookParameter(
                          index,
                          target.name,
                          target.value
                        );
                      }}
                      testId={`button-text-input-${index}`}
                    />
                  </Row>
                  <Row>
                    <StyledTextLink
                      linkType="negative"
                      onClick={() => this.removeWebhook(index)}
                      testId={`delete-webhook-button-${index}`}
                    >
                      Delete webhook
                    </StyledTextLink>
                  </Row>
                </WebhookContainer>
              );
            })}
            <Button onClick={this.addWebhook} testId="add-webhook-button">
              Add Webhook
            </Button>
          </Form>
        </Workbench.Content>
      </Workbench>
    );
  }
}

export default Config;
