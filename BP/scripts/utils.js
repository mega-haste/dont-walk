export class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
export function toVector(l) {
    return new Vector(l.x, l.y, l.z);
}
export default function (world) {
    const defaultWorldSpawn = world.getDefaultSpawnLocation();
    if (defaultWorldSpawn.y < 319)
        return defaultWorldSpawn;
    defaultWorldSpawn.y = 319;
    const overworld = world.getDimension("overworld");
    overworld.runCommandAsync("say fixing a big bug... :D");
    while (true) {
        if (overworld.getBlock(defaultWorldSpawn)?.isAir) {
            defaultWorldSpawn.y--;
            if (!overworld.getBlock(defaultWorldSpawn)?.isAir) {
                defaultWorldSpawn.y++;
                world.setDefaultSpawnLocation(defaultWorldSpawn);
                overworld.runCommandAsync("say finneshed");
                return defaultWorldSpawn;
            }
        }
        else if (defaultWorldSpawn.y <= -64) {
            break;
        }
    }
    return world.getDefaultSpawnLocation();
}
