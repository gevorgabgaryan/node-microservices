import Container, { Service } from 'typedi';
import { RegisterBody } from '../controllers/requests/auth/RegisterBody';
import { User } from './models/User';
import * as argon from 'argon2';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/UserRepository';
import { MailService } from './MailService';
import { UserStatus } from '../enums/UserStatuses';
import { LoginBody } from '../controllers/requests/auth/LoginBody';
import { BadRequestError } from 'routing-controllers';
import { Auth } from './models/Auth';
import config from '../../config';
import { AuthProviderRepository } from '../repositories/AuthProviderRepository';
import { AuthProvider } from './models/AuthProvider';
import { UserService } from './UserService';
import { WebSocketService } from '../../websocket';
import { BaseService } from './BaseService';
import { UserExistsError } from '../errors/UserExistsError';

interface JWTPayload {
  id: string;
}

@Service()
export class AuthService extends BaseService {
  constructor(
    private mailService: MailService,
    private userService: UserService,
  ) {
    super();
  }

  public async register(userData: RegisterBody): Promise<User> {
    try {
      return await this.transaction(async (unitOfWork) => {
        const passwordHash = await argon.hash(userData.password);
        const verificationToken = this.generateVerificationToken();
        const resetPasswordToken = this.generateVerificationToken();
        const user = new User();
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        user.email = userData.email;
        user.passwordHash = passwordHash;
        user.role = 'user';
        user.status = 'new';
        user.verificationToken = verificationToken;
        user.resetPasswordToken = resetPasswordToken;
        user.isEmailSent = false;
        const savedUser = await unitOfWork.userRepository.saveUser(user);

        const emailSent = await this.mailService.sendMail(
          user.email,
          verificationToken,
          'Verify your email',
          savedUser.id,
        );

        if (emailSent) {
          savedUser.isEmailSent = true;
          await unitOfWork.userRepository.update({ id: savedUser.id }, { isEmailSent: true });
        }

        return savedUser;
      });
    } catch (error: any) {
      if (error.code === '23505') {
        throw new UserExistsError() ;
      }
      throw error;
    }
  }

  public async confirmEmail(verificationToken: string): Promise<void> {
    const user = await UserRepository.findByVerificationToken(verificationToken);
    user.status = UserStatus.ACTIVE;
    await UserRepository.save(user);
  }

  async login(loginData: LoginBody): Promise<Auth> {
    return await this.transaction(async (unitOfWork) => {
      const user = await unitOfWork.userRepository.findByEmail(loginData.email);
      if (!user) throw new BadRequestError('invalid credential');

      if (user.status !== UserStatus.ACTIVE) {
        throw new BadRequestError('please confirm email');
      }

      const psMatches = await argon.verify(user.passwordHash, loginData.password);
      if (!psMatches) throw new BadRequestError('invalid credential');

      return await this.signToken(user.id, loginData.rememberMe);
    });
  }
  async signToken(userId: string, rememberMe?: boolean): Promise<Auth> {
    const payload = {
      id: userId,
    };
    const secret = config.JWTSecret;
    const expiresIn = config.JWTExpireIn;
    const expiresInLong = config.JWTExpireInLong;

    const token = jwt.sign(payload, secret, { expiresIn: rememberMe ? expiresInLong : expiresInLong });
    const result = new Auth();
    result.token = token;
    return result;
  }

  public async resetPassword(email: string): Promise<void> {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new BadRequestError('invalid credential');
    const emailSent = await this.mailService.sendMail(email, user.resetPasswordToken, 'Reset password', user.id);
    if (!emailSent) {
      throw new BadRequestError('unexpectedly error');
    }
  }

  public async newPassword(token: string, password: string): Promise<void> {
    const user = await UserRepository.findByResetPasswordToken(token);
    user.passwordHash = await argon.hash(password);
    await UserRepository.save(user);
  }

  public generateVerificationToken(): string {
    return uuidv4();
  }

  async socialLogin(id: string): Promise<Auth> {
    return await this.signToken(id);
  }
  public async findOrCreateUserWithProvider(userData: User, authProviderData: AuthProvider): Promise<User> {
    try {
      let user = await UserRepository.findByEmail(userData.email);
      if (!user) {
        userData.role = 'user';
        userData.status = UserStatus.ACTIVE;
        user = await UserRepository.saveUser(userData);
      }
      let existingAuthProvider = await AuthProviderRepository.findByProviderId(authProviderData.providerId);

      if (!existingAuthProvider) {
        authProviderData.userId = user.id;
        await AuthProviderRepository.save(authProviderData);
      } else {
        await AuthProviderRepository.update(
          { id: existingAuthProvider.id },
          { providerId: authProviderData.providerId },
        );
      }

      return user;
    } catch (error: any) {
      console.error('Error in findOrCreateUser:', error);
      throw new Error('Error creating or finding user');
    }
  }

  public async checkToken(token: string, roles?: string[]): Promise<string> {
    try {
      const payload = jwt.verify(token, config.JWTSecret) as JWTPayload;
      const user = await this.userService.getUser(payload.id);
      if (!user) {
        throw new BadRequestError('Invalid credentials');
      }

      if (roles && !roles.includes(user.role)) {
        throw new BadRequestError('Access denied');
      }

      return user.id;
    } catch (e) {
      console.error(e);
      throw new BadRequestError('Unexpected error');
    }
  }

  public async logout(userId: string): Promise<void> {
    const webSocketService = Container.get(WebSocketService);
    webSocketService.notifyLogout(userId);
  }
}
