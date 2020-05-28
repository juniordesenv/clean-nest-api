import { AddUserRepository } from '~/data/interfaces/db/user/add-user-repository.interface';
import { DbAddUser } from '~/data/usecases/user/db-add-user';
import { Hasher } from '~/data/interfaces/cryptography/hasher.interface';
import { SenderMail } from '~/data/interfaces/mailer/sender-mail.interface';
import { Config } from '~/data/interfaces/config/config.interface';
import { AddUserModel } from '~/domain/usecases/user/add-user.interface';
import { DeleteUserByIdRepository } from '~/data/interfaces/db/user/delete-user-by-id-repository';

export class SignupService {
  async add(
    addUserData: AddUserModel,
    addUserRepository: AddUserRepository,
    hasher: Hasher,
    uuid: UuidV4,
    config: Config,
    senderMail: SenderMail,
    deleteUserByIdRepository: DeleteUserByIdRepository,
  ) {
    const dbAddUser = new DbAddUser(hasher, addUserRepository, uuid);
    const user = await dbAddUser.add(addUserData);
    try {
      await senderMail.sendMail({
        to: addUserData.email,
        from: config.get<string>('EMAIL_SMTP_DEFAULT'),
        subject: 'Cadastro efetuado com sucesso ✔',
        template: 'welcome',
        context: {
          name: addUserData.name,
          confirmToken: user.confirmToken,
          frontEndUrl: config.get<string>('FRONT_END_URL'),
        },
      });
    } catch (e) {
      await deleteUserByIdRepository.deleteById(user._id);
      throw e;
    }
  }
}
