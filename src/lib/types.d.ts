interface Webhook {
  name?: string;
  buttonText?: string;
  webhookUrl?: string;
}

export interface Parameters {
  webhooks?: Webhook[];
}
