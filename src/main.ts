import { world, Entity } from "@minecraft/server";
import defaultSpawn from "./scrolls_method/defaultSpawn";
import lastDeath from "./scrolls_method/lastDeath";

import "./transfer";
import "./lodestone";
import "./tools/lumberjack_axe";
import { PaperOfEnding } from "./scrolls/paper_of_ending";
import { PaperOfSuffering } from "./scrolls/paper_of_suffering";
import { RecallPaper } from "./scrolls/recall_paper";
import { DimentionalPhone } from "./scrolls/dimensional_phone";
import * as Compass from "./compass/index";

world.beforeEvents.worldInitialize.subscribe((ev) => {
    ev.itemComponentRegistry.registerCustomComponent("haste:paper_of_ending", new PaperOfEnding());
    ev.itemComponentRegistry.registerCustomComponent("haste:paper_of_suffering", new PaperOfSuffering());
    ev.itemComponentRegistry.registerCustomComponent("haste:recall_paper", new RecallPaper());
    ev.itemComponentRegistry.registerCustomComponent("haste:dimensional_phone", new DimentionalPhone());

    Compass.regesterAll(ev);
});

// Prevents Creeper from breaking blocks
world.beforeEvents.explosion.subscribe((ev) => {
    if (ev.source?.typeId === "minecraft:creeper") {
        ev.setImpactedBlocks([]);
    }
});

world.afterEvents.entityDie.subscribe((ev) => {
    const entity: Entity = ev.deadEntity;

    if (entity.typeId !== "minecraft:player") return;
    entity.setDynamicProperty("death_dimention", entity.dimension.id);
    entity.setDynamicProperty("death_pos", entity.location);
});

world.afterEvents.itemCompleteUse.subscribe((ev) => {
    if (ev.itemStack.typeId !== "minecraft:goat_horn") return;
    ev.source.addEffect("bad_omen", 9999999, {
        showParticles: false,
        amplifier: 3,
    });
});

world.afterEvents.itemUse.subscribe(({ itemStack: item, source }) => {
    switch (item.typeId) {
        case "minecraft:recovery_compass":
            lastDeath(source);
            break;
        case "minecraft:compass":
            if (!source.isSneaking) break;
            defaultSpawn(source);
            break;
    }
});