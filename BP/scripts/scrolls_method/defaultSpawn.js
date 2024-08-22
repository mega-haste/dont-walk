import { world } from "@minecraft/server";
import resetWorldSpawn from "../utils.js";
export default function defaultSpawn(source) {
    try {
        source.teleport(resetWorldSpawn(world), {
            dimension: world.getDimension("overworld"),
        });
    }
    catch (e) {
        source.teleport(world.getDefaultSpawnLocation(), {
            dimension: world.getDimension("overworld"),
        });
        source.teleport(resetWorldSpawn(world), {
            dimension: world.getDimension("overworld"),
        });
    }
}
