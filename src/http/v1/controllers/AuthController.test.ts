import { v1_AuthController } from '.';
import { Request, Response } from 'express';
import { hash } from '../../../libs/encrypt';
import UsersRepository from '../../../repositories/UsersRepository';
import { faker } from '@faker-js/faker';
import ValidationException from '../../../exceptions/ValidationException';
import AuthException from '../../../exceptions/AuthException';
import UniqueEmailException from '../../../exceptions/UniqueEmailException';

jest.mock('../../../repositories/UsersRepository');

const mockCredentials = {
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  password: '12345678',
};

const mockUserRepository = UsersRepository as jest.Mock;

const mockResponse: Partial<Response> = {
  status: function () {
    return this;
  },
  send: function (data: any) {
    return data;
  },
};

const mockNext = jest.fn();

describe('AuthController', () => {
  beforeEach(async () => {
    const hashPassword = await hash(mockCredentials.password);

    mockUserRepository.mockImplementation(() => {
      return {
        add: () => mockCredentials,
        getByEmail: () => ({
          ...mockCredentials,
          ...{
            password: hashPassword,
          },
        }),
      };
    });
  });

  it('should register user successfully', async () => {
    const payload = {
      body: mockCredentials,
    } as Request;

    const response = await v1_AuthController.register(payload, mockResponse as Response, mockNext);

    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('email');
  });

  it('should auth user successfully', async () => {
    const payload = {
      body: mockCredentials,
    } as Request;

    const response = await v1_AuthController.auth(payload, mockResponse as Response, mockNext);

    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('email');
  });

  it('should throw ValidationException when the user try auth with empty email/password', async () => {
    const payload = {
      body: {
        email: '',
        password: '',
      },
    } as Request;

    await v1_AuthController.auth(payload, mockResponse as Response, mockNext);

    const validationException = () => {
      throw new ValidationException([]);
    };

    expect(validationException).toThrow(ValidationException);
  });

  it('should throw ValidationException when the user try register with empty email/password', async () => {
    const payload = {
      body: {
        email: '',
        password: '',
      },
    } as Request;

    await v1_AuthController.register(payload, mockResponse as Response, mockNext);

    const validationException = () => {
      throw new ValidationException([]);
    };

    expect(validationException).toThrow(ValidationException);
  });

  it('should throw AuthException when not found user', async () => {
    mockUserRepository.mockImplementation(() => {
      return {
        getByEmail: () => {
          return null;
        },
      };
    });

    const payload = {
      body: {
        email: 'abcefg@test.com',
        password: '12345678',
      },
    } as Request;

    await v1_AuthController.auth(payload, mockResponse as Response, mockNext);

    const authException = () => {
      throw new AuthException(payload);
    };

    expect(authException).toThrow(AuthException);
  });

  it('should throw AuthException when password not match', async () => {
    mockUserRepository.mockImplementation(() => {
      return {
        getByEmail: () => ({
          ...mockCredentials,
          ...{
            password: 'passwordNotMatch',
          },
        }),
      };
    });

    const payload = {
      body: {
        email: 'abcefg@test.com',
        password: '12345678',
      },
    } as Request;

    await v1_AuthController.auth(payload, mockResponse as Response, mockNext);

    const authException = () => {
      throw new AuthException(payload);
    };

    expect(authException).toThrow(AuthException);
  });

  it('should throw UniqueEmailException when register with email that already exist', async () => {
    mockUserRepository.mockImplementation(() => {
      return {
        getByEmail: () => {
          return new UniqueEmailException('Unique constraint failed', {});
        },
      };
    });

    const payload = {
      body: {
        email: 'abcefg@test.com',
        password: '12345678',
      },
    } as Request;

    await v1_AuthController.register(payload, mockResponse as Response, mockNext);

    const uniqueException = () => {
      throw new UniqueEmailException('Unique constraint failed', []);
    };

    expect(uniqueException).toThrow(UniqueEmailException);
  });
});
