export class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static fromVector3(v3) {
        return new Vector(v3.x, v3.y, v3.z);
    }
    above(steps = 1) {
        return new Vector(this.x, this.y + steps, this.z);
    }
    below(steps = 1) {
        return new Vector(this.x, this.y - steps, this.z);
    }
    east(steps = 1) {
        return new Vector(this.x + steps, this.y, this.z);
    }
    west(steps = 1) {
        return new Vector(this.x - steps, this.y, this.z);
    }
    south(steps = 1) {
        return new Vector(this.x, this.y, this.z + 1);
    }
    north(steps = 1) {
        return new Vector(this.x, this.y, this.z - 1);
    }
}
export function toVector(l) {
    return new Vector(l.x, l.y, l.z);
}
export function locationToString(loc) {
    return `${loc.x} ${loc.y} ${loc.z}`;
}
class VienBlock {
    constructor(pos, distance) {
        this.pos = pos;
        this.distance = distance;
    }
}
function getValidNeighbors(blockPos, distance) {
    const result = [];
    const up = blockPos.above();
    const down = blockPos.below();
    result.push(new VienBlock(up, distance), new VienBlock(down, distance));
    const blockPositions = [up, down, blockPos];
    for (const blockPosition of blockPositions) {
        result.push(new VienBlock(blockPosition.west(), distance), new VienBlock(blockPosition.east(), distance), new VienBlock(blockPosition.north(), distance), new VienBlock(blockPosition.south(), distance), new VienBlock(blockPosition.north().east(), distance), new VienBlock(blockPosition.north().west(), distance), new VienBlock(blockPosition.south().east(), distance), new VienBlock(blockPosition.south().west(), distance));
    }
    return result;
}
export function doVienMine(blockType, block, item, dimension, maxBlocks = 10, noLimit = false) {
    const maxDistance = 200;
    let cordinates = getValidNeighbors(Vector.fromVector3(block.location), 1);
    let blocks = 1;
    for (let { distance, pos: blockPos } of cordinates) {
        if (!noLimit && blocks >= maxBlocks)
            break;
        if (breakBlockFromLocIf(blockType, dimension, blockPos)) {
            if (!noLimit && distance >= maxDistance)
                break;
            cordinates.push(...getValidNeighbors(Vector.fromVector3(blockPos), distance + 1));
            blocks++;
        }
    }
}
export function damageItem(dura, damage = 1) {
    if (!dura.isValid())
        return false;
    try {
        dura.damage += damage;
        return false;
    }
    catch {
        dura.damage = dura.maxDurability;
        return true;
    }
}
export function breakBlockFromLoc(dimension, location) {
    const targetBlock = dimension.getBlock(location);
    if (!targetBlock)
        return false;
    const targetLoc = locationToString(location);
    dimension.runCommand(`/fill ${targetLoc} ${targetLoc} air [] destroy`);
    return true;
}
export function breakBlockFromLocIf(blockType, dimension, location) {
    const targetBlock = dimension.getBlock(location);
    if (!targetBlock)
        return false;
    if (blockType.id === targetBlock.typeId) {
        const targetLoc = locationToString(location);
        dimension.runCommand(`/fill ${targetLoc} ${targetLoc} air [] destroy`);
        return true;
    }
    return false;
}
export function breakBlockIf(blockType, dimension, targetBlock) {
    if (!targetBlock)
        return false;
    if (blockType.id === targetBlock.typeId) {
        const targetLoc = locationToString(targetBlock.location);
        dimension.runCommand(`/fill ${targetLoc} ${targetLoc} air [] destroy`);
        return true;
    }
    return false;
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
