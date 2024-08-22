import { Dimension, world } from "@minecraft/server";

world.afterEvents.itemUse.subscribe(({ itemStack: item, source }) => {
    switch (item.typeId) {
        case "haste:comperfort":
            const dimention = source.dimension;
            if (dimention.id !== "minecraft:nether") return;
            dimention.runCommand(`locate structure fortress`);
            break;
    }
});
