import config from '@iobroker/eslint-config';

export default [
    ...config,
    {
        ignores: ['main.js', 'scripts/**'],
    },
];
