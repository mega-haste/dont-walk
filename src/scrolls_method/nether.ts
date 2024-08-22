import { Player, world } from "@minecraft/server";

export default function nether(source: Player) {
    const loc = world.getDefaultSpawnLocation();
    const nether = world.getDimension("minecraft:nether");
    loc.y = 50;

    source.addEffect("fire_resistance", 20 * 10, { showParticles: false });
    source.teleport(loc, { dimension: nether });
    const { x, y, z } = source.location;
    nether.runCommand(
        `fill ${x - 5} ${y - 1} ${z - 5} ${x + 5} ${y - 1} ${
            x + 5
        } minecraft:polished_blackstone_bricks`
    );
    nether.runCommand(
        `fill ${x - 5} ${y} ${z - 5} ${x + 5} ${y + 10} ${x + 5} minecraft:air`
    );
}
