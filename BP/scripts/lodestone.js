import {
    EntityInventoryComponent,
    Vector,
    world
} from "@minecraft/server";

world.afterEvents.itemUseOn.subscribe(({ block, source, itemStack: item })=>{
    if (block.typeId === "minecraft:lodestone" && item.typeId === "minecraft:lodestone_compass")
    {
        /** @type {EntityInventoryComponent} */
        const invComponent = source.getComponent(EntityInventoryComponent.componentId);
        item.setLore([
            `${block.x} ${block.y + 1} ${block.z}`,
            `${block.dimension.id}`
        ]);
        invComponent.container.setItem(source.selectedSlot, item);
    }
});

world.afterEvents.itemUse.subscribe(({ itemStack: item, source })=>{
    if (item.typeId !== "minecraft:lodestone_compass" || !source.isSneaking) return;
    const lores = item.getLore();
    if (lores.length != 2) return;
    const po = lores[0].split(' ');
    const pos = new Vector(
        parseFloat(po[0]) + 0.5,
        parseFloat(po[1]),
        parseFloat(po[2]) + 0.5
    );
    const dimension = world.getDimension(lores[1]);

    source.tryTeleport(pos, {
        dimension
    });
    pos.y -= 1;
    if (dimension.getBlock(pos).typeId !== "minecraft:lodestone") {
        /** @type {EntityInventoryComponent} */
        const invComponent = source.getComponent(EntityInventoryComponent.componentId);
        item.setLore([]);
        invComponent.container.setItem(source.selectedSlot, item);
        return;
    }
});

