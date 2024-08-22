import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Vector } from "./utils.js";
import defaultSpawn from "./scrolls_method/defaultSpawn.js";
import lastDeath from "./scrolls_method/lastDeath.js";
import home from "./scrolls_method/home.js";
import nether from "./scrolls_method/nether.js";
import theEnd from "./scrolls_method/theEnd.js";
import "./transfer.js";
import "./lodestone.js";
import "./compass/main.js";
import "./tools/lumberjack_axe.js";
world.beforeEvents.explosion.subscribe((ev) => {
    if (ev.source?.typeId === "minecraft:creeper") {
        ev.setImpactedBlocks([]);
    }
});
world.afterEvents.entityDie.subscribe((ev) => {
    const entity = ev.deadEntity;
    if (entity.typeId !== "minecraft:player")
        return;
    entity.setDynamicProperty("death_dimention", entity.dimension.id);
    entity.setDynamicProperty("death_pos", entity.location);
});
world.afterEvents.itemCompleteUse.subscribe((ev) => {
    if (ev.itemStack.typeId !== "minecraft:goat_horn")
        return;
    ev.source.addEffect("bad_omen", 9999999, {
        showParticles: false,
        amplifier: 3,
    });
});
world.afterEvents.itemUse.subscribe(({ itemStack: item, source }) => {
    switch (item.typeId) {
        case "haste:recall_paper":
            home(source);
            break;
        case "haste:paper_of_suffering":
            nether(source);
            break;
        case "haste:paper_of_ending":
            theEnd(source);
            break;
        case "minecraft:recovery_compass":
            lastDeath(source);
            break;
        case "minecraft:compass":
            if (!source.isSneaking)
                break;
            defaultSpawn(source);
            break;
        case "haste:dimensional_phone":
            dimensionalPhone(source);
            break;
        default:
            break;
    }
});
function dimensionalPhone(source) {
    const form = new ActionFormData()
        .title("Dimentional Phone")
        .body("Select option")
        .button("Home", "textures/items/recall_scroll")
        .button("Spawn", "textures/items/bed_purple")
        .button("World spawn", "textures/items/compass_item")
        .button("Last death body", "textures/items/recovery_compass_item")
        .button("Nether", "textures/items/scroll_of_pain")
        .button("The end", "textures/items/the_end_scroll")
        .show(source);
    form.then((res) => {
        if (res.canceled)
            return;
        switch (res.selection) {
            case 0:
                home(source);
                break;
            case 1:
                try {
                    const loc = source.getSpawnPoint();
                    if (!loc)
                        return;
                    source.teleport(new Vector(loc?.x, loc?.y, loc?.z), { dimension: loc?.dimension });
                }
                catch (e) {
                    console.error(e);
                }
                break;
            case 2:
                defaultSpawn(source);
                break;
            case 3:
                lastDeath(source);
                break;
            case 4:
                nether(source);
                break;
            case 5:
                theEnd(source);
                break;
        }
    }).catch((_) => console.error(_));
}
