import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetails } from './entities/user-details.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ContentHistory } from '../content-history/entities/content-history.entity';
import { Posts } from '../posts/entities/posts.entity';
import { PostedPlatforms } from '../posts/entities/posted-platforms.entity';
import { UserVerifiedPlatform } from '../userVerifiedPlatforms/entity/user-verified-platform.entity';
import { UserSocialMediaCredential } from '../social-medias/DTOs/user-social-media-credential.entity';

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
    gender: 'Male', // Assuming you want to add gender
    dateOfBirth: new Date('2012-12-12'), // Correctly use a Date object
    mobileNumber: '1234567890', // Adding mobileNumber as well
    createdOn: new Date(), // Mock the created date
    modifiedOn: new Date(), // Mock the modified date
    users: {} as Users, // This should be populated with a mock Users object if needed
  };
  

  const mockUser: Users = {
    id: 1,
    userName: 'john_doe',
    email: 'john.doe@example.com',
    password: 'hashed_password',
    isVerified: true,
    createdOn: new Date('2023-01-01T10:00:00Z'),
    modifiedOn: new Date('2023-01-05T15:00:00Z'),
    userDetails: mockUserDetails, // Use valid UserDetails object
    contentHistory: [], // Assuming it's an array
    posts: [], // Assuming it's an array
    postedPlatforms: [], // Assuming it's an array
    verifiedPlatforms: [], // Assuming it's an array
    socialMediaCredentials: [], // Assuming it's an array
  };

  const mockUsersRepository = {
    findOne: jest.fn(), // Correct method for single user
  };

  const mockUserDetailsRepository = {
    // Add mock methods as needed
  };

  const mockCloudinaryService = {
    upload: jest.fn(), // Cloudinary methods
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
        },
        {
          provide: getRepositoryToken(ContentHistory),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(Posts),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(PostedPlatforms),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(UserVerifiedPlatform),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(UserSocialMediaCredential),
          useValue: mockUsersRepository,
        },
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
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser); // Mock findOne

      const result = await userService.findById(mockUser.id); // Call method
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        relations: { userDetails: true }, // Expect correct relations
      });
      expect(result).toEqual(mockUser); // Expect correct result
    });
  });
});
