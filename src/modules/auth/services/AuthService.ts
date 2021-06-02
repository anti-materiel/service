import { EntityRepository } from '@mikro-orm/postgresql';
import { LoginRequest } from '@root/__generatedTypes__';
import { UserEntity } from '@users/entities/UserEntity';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { NotAuthorized } from '@error/exceptions/NotAuthorized';
import resetPasswordRequestSchema from '../validation/resetPasswordRequestSchema';
import resetPasswordSchema from '../validation/resetPasswordSchema';

const ONE_HOUR = 3600000;

export class AuthService {
  constructor(private userRepository: EntityRepository<UserEntity>) {}

  async login(request: LoginRequest): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOne({
      username: request.username,
      active: true,
    });

    if (!userEntity || !userEntity.password) {
      throw new NotAuthorized();
    }

    const isValid = await bcrypt.compare(request.password, userEntity.password);

    if (!isValid) {
      throw new NotAuthorized();
    }

    return userEntity;
  }

  async resetPasswordRequest(email: string): Promise<void> {
    await resetPasswordRequestSchema.validate({ email });

    const userEntity = await this.userRepository.findOne({
      email,
      active: true,
    });

    if (userEntity) {
      const resetId = uuid();

      userEntity.assign(
        {
          reset: {
            resetExpiration: `${Date.now() + ONE_HOUR}`,
            resetId,
          },
        },
        { mergeObjects: true },
      );

      // TODO send email with reset

      await this.userRepository.persistAndFlush(userEntity);
    }
  }

  async resetPassword(resetId: string, password: string): Promise<UserEntity> {
    await resetPasswordSchema.validate({ password });

    const userEntity = await this.userRepository.findOne({
      reset: {
        resetId,
      },
      active: true,
    });

    const resetExpiration = userEntity?.reset.resetExpiration
      ? Number(userEntity?.reset.resetExpiration)
      : 0;

    if (!userEntity || resetExpiration < Date.now()) {
      throw new NotAuthorized();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    userEntity.assign({ password: hashedPassword });

    await this.userRepository.persistAndFlush(userEntity);

    return userEntity;
  }
}
