[![Test Action Status](https://github.com/yn5/webhook-contentful-app/workflows/Test/badge.svg)](https://github.com/yn5/webhook-contentful-app/actions)

# Webhook Contentful app

> A Contentful app extension to trigger a webhook from the sidebar.

This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

## Usage

1. Serve a build of the app. (See [deployment instructions](#deployment) on how to deploy.)

2. Create an app in a Contentful organisation's Apps settings using the URL where the app is served.

3. Install the app in one of the organisation's spaces in the space's Apps settings.

4. Add the app's sidebar view to one or more content type's custom sidebar in the content type's sidebar configuratin.

### Deployment

This project is deployed on Vercel at https://webhook-contentful-app.vercel.app. **While anyone is free to make use of that deployment please beware that USAGE IS AT OWN RISK! This repository and thus the deployment it's tightly coupled to is subject to change and there is no guarantee backwards incompatible changes won't happen!**

It would be best to fork this repository and host it yourself:

0. (Make sure the repository is cloned and the dependencies are installed. See [getting-started](#getting-started) instructions.)

1. Build the project:

```bash
npm run build
```

2. Serve the resulting `build` folder.

## Development

### Prerequisites

The following dependencies should be installed:

- [node](https://nodejs.org/en/) ^12.16.3
- [npm](https://www.npmjs.com/) ^6.14.4

### Getting started

1. Run the following commands in your console.

```bash
git clone git@github.com:yn5/webhook-contentful-app.git
cd webhook-contentful-app
npm ci
```

2. Start the development server

```bash
npm run start
```

Creates or update your app definition in contentful, and runs the app in development mode on http://localhost:3000.
Open your app to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### Styling

For styling [@emotion/styled-components](https://emotion.sh/docs/styled) is used. In general styling inside a component should not contain styling for positioning, margins, specific one off styles and other concerns that belong to a parent component that uses it.

For positioning a component [emotion's "Styling any component" functionality](https://emotion.sh/docs/styled#styling-any-component) for extending styles should be used:

```javascript
import styled from '@emotion/styled';
import Menu from 'components/menu';

const StyledMenu = styled(Menu)`
  top: 96px;
  left: 96px;
  margin-bottom: 16px;
`;

export default functin Example() {
  return (
    <StyledMenu />
  );
}
```

### Committing

[Husky](https://github.com/typicode/husky) is used to run the `format` and `test` scripts before every commit and only allows the commit if all scripts pass successfully.

For commit messages, [conventional commits](https://www.conventionalcommits.org/) is used.

The Git workflow is lightly based on [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

Please branch a new feature branch of the [`develop`](https://github.com/edenspiekermann-amsterdam/elsevier-health-student-hub.git) branch for every new feature with the following title: `feature/name-of-the-new-feature`.

All bugfixes should be developed inside a new `bugfix/name-of-the-bug` branch.

All (npm) dependency additions / installs and removals / uninstalls should be in a separate commit.

**Please rebase your feature branch on the most recent version of `develop` in order to update your `feature/` or `bugfix/` branch with the latest `develop` and before creating a pull request.**

### Tests

> Write tests. Not too many. Mostly integration.
>
> [Guillermo Rauch](https://twitter.com/rauchg/status/807626710350839808)

For testing [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) and [jest-dom](https://github.com/testing-library/jest-dom/) are used. The tests can be found in the [src/\_\_tests\_\_/](src/__tests__/) folder. The filename of a test file should end with `.spec.ts(x)`.

To run the tests:

```bash
npm run test
```

To run the test in watch mode:

```bash
npm run test:watch
```

### Built with

Please review the documentation of these libraries before you start developing:

- [React](https://reactjs.org/)
- [Create Contentful App](https://github.com/contentful/create-contentful-app)
- [Contentful UI Extensions SDK reference](https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/)
- [@contentful/forma-36-react-components](https://github.com/contentful/forma-36) - React components for [Contenful's design system](https://f36.contentful.com/).
- [@emotion/styled](https://emotion.sh/docs/styled)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [jest-dom](https://github.com/testing-library/jest-dom/)

These are the most fundamental dependencies. For a complete list of dependencies see [package.json](package.json)

## Learn More

[Read more](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/) and check out the video on how to use the CLI.

Create Contentful App uses [Create React App](https://create-react-app.dev/). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) and how to further customize your app.

## License

MIT, see [LICENSE](LICENSE) for details.
