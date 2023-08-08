import loadEnvs from './config/envs';

loadEnvs();

jest.setTimeout(10000);

jest.mock('../src/config/typeorm');

beforeEach(() => {
  jest.useFakeTimers();
});
