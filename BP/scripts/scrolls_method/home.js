import { world } from "@minecraft/server";
import defaultSpawn from "./defaultSpawn.js";
import { Vector } from "../utils.js";
export default function home(source) {
    if (source.isSneaking) {
        if (source.dimension.id != "minecraft:overworld") {
            source.sendMessage(`Recall Scroll only works in overworld dimention`);
            return;
        }
        // source.setDynamicProperty("home_pos", toFString(source.location));
        source.setDynamicProperty("home_pos", source.location);
        source.setDynamicProperty("home_dimention", source.dimension.id);
        world.playSound("beacon.activate", source.location);
    }
    else {
        if (!source.getDynamicProperty("home_pos")) {
            try {
                const spawn = source.getSpawnPoint();
                source.teleport(new Vector(spawn?.x, spawn?.y, spawn?.z), { dimension: world.getDimension("overworld") });
            }
            catch (e) {
                defaultSpawn(source);
            }
            return;
        }
        source.teleport(source.getDynamicProperty("home_pos"), {
            dimension: world.getDimension(source.getDynamicProperty("home_dimention")),
        });
    }
}
