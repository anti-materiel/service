import {
  Resolvers,
  MutationResolvers,
  WeaponModeResolvers,
} from '@root/__generatedTypes__';

const createWeaponMode: MutationResolvers['createWeaponMode'] = async (
  _,
  { weaponId, request },
  { weaponService, req },
) => {
  const weaponModeEntity = await weaponService.createWeaponMode(
    weaponId,
    request,
    req.session.user?.id,
  );

  return weaponModeEntity as never;
};

const updateWeaponMode: MutationResolvers['updateWeaponMode'] = async (
  _,
  { weaponId, weaponModeId, request },
  { weaponService, req },
) => {
  const weaponModeEntity = await weaponService.updateWeaponMode(
    weaponId,
    weaponModeId,
    request,
    req.session.user?.id,
  );

  return weaponModeEntity as never;
};

const removeWeaponMode: MutationResolvers['removeWeaponMode'] = async (
  _,
  { weaponId, weaponModeId },
  { weaponService, req },
) => {
  return await weaponService.removeWeaponMode(
    weaponId,
    weaponModeId,
    req.session.user?.id,
  );
};

const ammo: WeaponModeResolvers['ammo'] = async (
  weaponMode,
  _,
  { ammoLoader },
) => {
  const ammoEntities = await ammoLoader.load(weaponMode.id);

  return ammoEntities as never;
};

const traits: WeaponModeResolvers['traits'] = async (
  weaponMode,
  _,
  { traitsLoader },
) => {
  const traitsEntities = await traitsLoader.load(weaponMode.id);

  return traitsEntities as never;
};

export default {
  Mutation: { createWeaponMode, updateWeaponMode, removeWeaponMode },
  WeaponMode: { ammo, traits },
} as Resolvers;
