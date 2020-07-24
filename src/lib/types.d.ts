/**
 * Field interface is from shared-dam-app copied from here on 07/05/2020
 * https://github.com/contentful/apps/blob/0a1314ba3d8ae067b718e93a405c73ae62c4272d/lib/shared-dam-app/src/AppConfig/fields.ts
 */
interface Field {
  id: string;
  name: string;
  type: string;
}

export interface Parameters {
  buttonText?: string;
  webhookUrl?: string;
}
