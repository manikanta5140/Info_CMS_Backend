import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { UserDetails } from './entities/user-details.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockUsersRepository = () => ({
  find: jest.fn() as jest.Mock,
  findOne: jest.fn() as jest.Mock,
  create: jest.fn() as jest.Mock,
  save: jest.fn() as jest.Mock,
  update: jest.fn() as jest.Mock,
});

const mockUserDetailsRepository = () => ({
  save: jest.fn() as jest.Mock,
});

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<Users>;
  let userDetailsRepository: Repository<UserDetails>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useFactory: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(UserDetails),
          useFactory: mockUserDetailsRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    userDetailsRepository = module.get<Repository<UserDetails>>(getRepositoryToken(UserDetails));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: 1, userName: 'test', email: 'test@test.com' }];
      (usersRepository.find as jest.Mock).mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(usersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@test.com';
      const mockUser = { id: 1, userName: 'test', email };
      (usersRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);
      expect(result).toEqual(mockUser);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email }, relations: { userDetails: true } });
    });

    it('should return null if user not found', async () => {
      (usersRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const id = 1;
      const mockUser = { id, userName: 'test', email: 'test@test.com' };
      (usersRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findById(id);
      expect(result).toEqual(mockUser);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id }, relations: { userDetails: true } });
    });

    it('should return null if user not found', async () => {
      (usersRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findById(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const userData = { userName: 'test', email: 'test@test.com' };
      const mockUser = { id: 1, ...userData };
      (usersRepository.create as jest.Mock).mockReturnValue(mockUser);
      (usersRepository.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create(userData);
      expect(result).toEqual(mockUser);
      expect(usersRepository.create).toHaveBeenCalledWith(userData);
      expect(usersRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('createUserDetails', () => {
    it('should create and return user details', async () => {
      const userDetailsData = { age: 30, address: '123 Street' };
      const mockUserDetails = { id: 1, ...userDetailsData };
      (userDetailsRepository.save as jest.Mock).mockResolvedValue(mockUserDetails);

      const result = await service.createUserDetails(userDetailsData);
      expect(result).toEqual(mockUserDetails);
      expect(userDetailsRepository.save).toHaveBeenCalledWith(userDetailsData);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = 1;
      const updatedUser = { userName: 'updatedTest' };
      (usersRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.update(id, updatedUser);
      expect(result.affected).toEqual(1);
      expect(usersRepository.update).toHaveBeenCalledWith(id, updatedUser);
    });

    it('should not update if user not found', async () => {
      (usersRepository.update as jest.Mock).mockResolvedValue({ affected: 0 });

      const result = await service.update(999, { userName: 'updatedTest' });
      expect(result.affected).toEqual(0);
    });
  });
});
