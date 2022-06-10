import React, { Component } from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import { Workbench } from '@contentful/forma-36-react-components';

import { ContentType, Parameters } from '../../lib/types';
import { ConfigScreenForm } from './ConfigScreenForm';

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  parameters: Parameters;
  targetState?: {
    EditorInterface: { [key: string]: { sidebar: { position: number } } };
  };
}

class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = { parameters: {} };

    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount(): Promise<void> {
    const parameters: Parameters | null =
      await this.props.sdk.app.getParameters();

    this.setState(parameters ? { parameters } : this.state, () => {
      this.props.sdk.app.setReady();
    });
  }

  onConfigure = async (): Promise<ConfigState> => {
    const { items: contentTypes }: { items: ContentType[] } =
      await this.props.sdk.space.getContentTypes();

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
          <ConfigScreenForm
            addWebhook={this.addWebhook}
            removeWebhook={this.removeWebhook}
            webhooks={webhooks}
            setWebhookParameter={this.setWebhookParameter}
          />
        </Workbench.Content>
      </Workbench>
    );
  }
}

export default Config;
