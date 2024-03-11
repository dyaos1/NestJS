import { DataSource } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  track?: boolean;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);

    await repository.insert([
      {
        username: 'username1',
        name: 'hong gil-dong',
        password: 'password1',
      },
    ]);
  }
}
