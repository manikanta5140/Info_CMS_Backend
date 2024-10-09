import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetails } from './entities/user-details.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: Repository<Users>;
  let userDetailsRepository: Repository<UserDetails>;
  let cloudinaryService: CloudinaryService;

  const mockUserDetails: UserDetails = {
    id: 1,
    userId: 1,
    profilePhoto: 'http://example.com/photo.jpg',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'Male', 
    dateOfBirth: new Date('2012-12-12'), 
    mobileNumber: '1234567890', 
    createdOn: new Date(), 
    modifiedOn: new Date(), 
    users: {} as Users
  };
  

  const mockUser: Users = {
    id: 1,
    userName: 'john_doe',
    email: 'john.doe@example.com',
    password: 'hashed_password',
    isVerified: true,
    createdOn: new Date('2023-01-01T10:00:00Z'),
    modifiedOn: new Date('2023-01-05T15:00:00Z'),
    userDetails: mockUserDetails,
    contentHistory: [],
    posts: [],
    postedPlatforms: [],
    verifiedPlatforms: [], 
    socialMediaCredentials: [],
  };

  const mockUserArray: Users[] = [mockUser];

  const mockUsersRepository = {
    findOne: jest.fn(), 
    find: jest.fn(),
  };

  const mockUserDetailsRepository = {
    
  };

  const mockCloudinaryService = {
    upload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(UserDetails),
          useValue: mockUserDetailsRepository,
        },

        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        }
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    userDetailsRepository = module.get<Repository<UserDetails>>(
      getRepositoryToken(UserDetails),
    );
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  describe('findById', () => {
    it('should return a user by ID with relations', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser); 

      const result = await userService.findById(mockUser.id); 
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        relations: { userDetails: true },
      });
      expect(result).toEqual(mockUser);                                         
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockUserArray);

      const result = await userService.findAll();
      expect(userRepository.find).toHaveBeenCalled;
      expect(result).toEqual(mockUserArray);
    })
  });

  describe('findByEmail', () => {
    it('should return a user by email with relations', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser); 

      const result = await userService.findByEmail(mockUser.email); 
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
        relations: { userDetails: true },
      });
      expect(result).toEqual(mockUser);                                         
    });

  });
});
