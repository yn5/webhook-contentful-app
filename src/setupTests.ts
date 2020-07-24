// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import {configure} from '@testing-library/react';

// Forma 36 uses data-test-id instead of react-testing-library's data-testid
configure({ testIdAttribute: 'data-test-id' });
