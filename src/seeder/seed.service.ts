import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(private dataSource: DataSource) {}

  async seedMenu() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.release();

    return { message: 'Seeding completo' };
  }
}
