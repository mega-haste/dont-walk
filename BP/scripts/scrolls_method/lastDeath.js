import { world } from "@minecraft/server";
export default function lastDeath(source) {
    const deathPos = source.getDynamicProperty("death_pos");
    if (deathPos) {
        source.teleport(deathPos, {
            dimension: world.getDimension(source.getDynamicProperty("death_dimention")),
        });
        return;
    }
    source.sendMessage("You didn't die yet... " + source.name);
}
