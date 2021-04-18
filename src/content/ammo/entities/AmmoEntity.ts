import { BaseEntity, Collection, EntitySchema } from '@mikro-orm/core';
import { generateId } from '@root/utils';
import { RuleEntity } from '../../common/entities/RuleEntity';

export class AmmoEntity extends BaseEntity<RuleEntity, 'id'> {
  id!: string;
  name!: string;
  link?: string | null;
  combinedAmmo = new Collection<AmmoEntity>(this);
}

export const ammoSchema = new EntitySchema({
  class: AmmoEntity,
  extends: 'BaseEntity',
  tableName: 'ammo',
  properties: {
    id: { type: 'string', onCreate: () => generateId(), primary: true },
    name: { type: 'string' },
    link: { type: 'string', nullable: true },
    combinedAmmo: {
      reference: 'm:n',
      entity: () => AmmoEntity,
    },
  },
});
