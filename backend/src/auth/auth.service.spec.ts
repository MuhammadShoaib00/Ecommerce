import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signup()', () => {
    it('hashes the password before storing', async () => {
      const dto = { email: 'test@test.com', name: 'Test', password: 'Password1' };
      mockUsersService.create.mockResolvedValue({
        _id: 'user-id',
        email: dto.email,
        name: dto.name,
        role: 'customer',
      });

      await service.signup(dto);

      const createCall = mockUsersService.create.mock.calls[0][0];
      expect(createCall).toHaveProperty('passwordHash');
      expect(createCall.passwordHash).not.toBe(dto.password);
      const valid = await bcrypt.compare(dto.password, createCall.passwordHash);
      expect(valid).toBe(true);
    });

    it('returns an accessToken and user object', async () => {
      const dto = { email: 'a@b.com', name: 'Alice', password: 'Secure123' };
      mockUsersService.create.mockResolvedValue({
        _id: 'uid',
        email: dto.email,
        name: dto.name,
        role: 'customer',
      });

      const result = await service.signup(dto);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(dto.email);
    });
  });

  describe('login()', () => {
    it('throws UnauthorizedException for unknown email', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'x@x.com', password: 'p' }))
        .rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const hash = await bcrypt.hash('correct-password', 1);
      mockUsersService.findByEmail.mockResolvedValue({
        _id: 'uid',
        email: 'x@x.com',
        name: 'X',
        role: 'customer',
        passwordHash: hash,
      });

      await expect(service.login({ email: 'x@x.com', password: 'wrong-password' }))
        .rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('returns token on valid credentials', async () => {
      const hash = await bcrypt.hash('correct', 1);
      mockUsersService.findByEmail.mockResolvedValue({
        _id: 'uid',
        email: 'a@b.com',
        name: 'A',
        role: 'customer',
        passwordHash: hash,
      });

      const result = await service.login({ email: 'a@b.com', password: 'correct' });
      expect(result.accessToken).toBe('mock-jwt-token');
    });
  });
});
