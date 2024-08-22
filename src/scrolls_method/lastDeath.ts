import { Player, world } from "@minecraft/server";
import { Vector } from "../utils.js";

export default function lastDeath(source: Player) {
    const deathPos = source.getDynamicProperty("death_pos") as Vector;
    if (deathPos) {
        source.teleport(deathPos, {
            dimension: world.getDimension(
                source.getDynamicProperty("death_dimention") as string
            ),
        });
        return;
    }
    source.sendMessage("You didn't die yet... " + source.name);
}
