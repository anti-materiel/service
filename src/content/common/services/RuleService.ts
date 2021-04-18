import { RuleEntity } from '@content/common/entities/RuleEntity';
import { QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Page, paginateEntites } from '@root/utils';
import { RuleRequest } from '@root/__generatedTypes__';

export class RuleService {
  constructor(private ruleRepository: EntityRepository<RuleEntity>) {}

  async createRule(request: RuleRequest): Promise<RuleEntity> {
    const ruleEntity = this.ruleRepository.create({
      name: request.name,
      link: request.link,
    });

    await this.ruleRepository.persistAndFlush(ruleEntity);

    return ruleEntity;
  }

  async updateRule(ruleId: string, request: RuleRequest): Promise<RuleEntity> {
    const ruleEntity = await this.ruleRepository.findOneOrFail({ id: ruleId });

    ruleEntity.assign({
      name: request.name,
      link: request.link,
    });

    this.ruleRepository.persistAndFlush(ruleEntity);

    return ruleEntity;
  }

  async findRuleById(ruleId: string): Promise<RuleEntity | null> {
    return await this.ruleRepository.findOne({ id: ruleId });
  }

  async findRulesByName(
    name: string,
    page?: number,
    limit?: number,
  ): Promise<Page<RuleEntity>> {
    const [ruleEntities, count] = await this.ruleRepository.findAndCount(
      { name },
      {
        orderBy: { name: QueryOrder.ASC },
        limit,
        offset: page,
      },
    );

    return paginateEntites(ruleEntities, count, page, limit);
  }

  async findAllRules(page?: number, limit?: number): Promise<Page<RuleEntity>> {
    const ruleEntities = await this.ruleRepository.findAll({
      orderBy: { name: QueryOrder.ASC },
      limit,
      offset: page,
    });
    const count = await this.ruleRepository.count();

    return paginateEntites(ruleEntities, count, page, limit);
  }
}
