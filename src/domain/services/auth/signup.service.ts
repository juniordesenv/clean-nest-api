import { AddUserRepository } from '~/data/interfaces/db/user/add-user-repository.interface';
import { DbAddUser } from '~/data/usecases/user/db-add-user';
import { AddUserDto } from '~/domain/dto/user/add-user.dto';
import { Hasher } from '~/data/interfaces/cryptography/hasher.interface';
import { SenderMail } from '~/data/interfaces/mailer/sender-mail.interface';
import { Config } from '~/data/interfaces/config/config.interface';

export class SignupService {
  async add(
    addUserDto: AddUserDto,
    addUserRepository: AddUserRepository,
    hasher: Hasher,
    uuid: UuidV4,
    config: Config,
    senderMail: SenderMail,
  ) {
    const dbAddUser = new DbAddUser(hasher, addUserRepository, uuid);
    const user = await dbAddUser.add(addUserDto);
    try {
      await senderMail.sendMail({
        to: addUserDto.email,
        from: config.get<string>('EMAIL_SMTP_DEFAULT'),
        subject: 'Cadastro efetuado com sucesso ✔',
        template: 'welcome',
        context: {
          name: addUserDto.name,
          confirmToken: user.confirmToken,
          frontEndUrl: config.get<string>('FRONT_END_URL'),
        },
      });
    } catch (e) {
      await user.remove();
      throw e;
    }
  }
}
