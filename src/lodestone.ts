import {
    DimensionLocation,
    EntityEquippableComponent,
    EntityInventoryComponent,
    EquipmentSlot,
    ItemStack,
    Player,
    world,
} from "@minecraft/server";
import { toVector } from "./utils";

function parseFromLores(item: ItemStack): DimensionLocation {
    const lores = item.getLore();
    if (lores.length < 2) {
        throw new Error();
    }
    const p = lores[0].split(" ");
    const result = {} as DimensionLocation;
    result.x = parseFloat(p[0]);
    result.y = parseFloat(p[1]);
    result.z = parseFloat(p[2]);
    result.dimension = world.getDimension(lores[1]);
    return result;
}

world.afterEvents.itemUseOn.subscribe(({ block, source, itemStack: item }) => {
    if (item.typeId !== "minecraft:lodestone_compass") return;
    if (block.typeId === "minecraft:lodestone") {
        const equippableComponent = source.getComponent(
            EntityEquippableComponent.componentId
        ) as EntityEquippableComponent;
        item.setLore([
            `${block.x} ${block.y + 1} ${block.z}`,
            `${block.dimension.id}`,
        ]);
        equippableComponent.setEquipment(EquipmentSlot.Mainhand, item);
    }
});

world.afterEvents.itemUse.subscribe(({ itemStack: item, source }) => {
    if (item.typeId !== "minecraft:lodestone_compass" || !source.isSneaking)
        return;
    const lores = item.getLore();
    if (lores.length != 2) return;
    const po = parseFromLores(item);
    const pos = toVector(po);

    source.tryTeleport(pos, {
        dimension: po.dimension,
    });
    pos.y -= 1;
    if (po.dimension.getBlock(pos)?.typeId !== "minecraft:lodestone") {
        const equippableComponent = source.getComponent(
            EntityEquippableComponent.componentId
        ) as EntityEquippableComponent;
        item.setLore([]);
        equippableComponent.setEquipment(EquipmentSlot.Mainhand, item);
        return;
    }
});
