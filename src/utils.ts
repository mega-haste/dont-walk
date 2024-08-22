import {
    Block,
    BlockType,
    Dimension,
    DimensionLocation,
    ItemDurabilityComponent,
    ItemStack,
    Vector3,
    World,
} from "@minecraft/server";

export class Vector implements Vector3 {
    constructor(public x: number, public y: number, public z: number) {}
    public static fromVector3(v3: Vector3): Vector {
        return new Vector(v3.x, v3.y, v3.z);
    }
    public above(steps: number = 1): Vector {
        return new Vector(this.x, this.y + steps, this.z);
    }
    public below(steps: number = 1): Vector {
        return new Vector(this.x, this.y - steps, this.z);
    }
    public east(steps: number = 1): Vector {
        return new Vector(this.x + steps, this.y, this.z);
    }
    public west(steps: number = 1): Vector {
        return new Vector(this.x - steps, this.y, this.z);
    }
    public south(steps: number = 1): Vector {
        return new Vector(this.x, this.y, this.z + 1);
    }
    public north(steps: number = 1): Vector {
        return new Vector(this.x, this.y, this.z - 1);
    }
}

export function toVector(l: DimensionLocation): Vector {
    return new Vector(l.x, l.y, l.z);
}

export function locationToString(loc: Vector | Vector3) {
    return `${loc.x} ${loc.y} ${loc.z}`;
}

class VienBlock {
    constructor(public pos: Vector | Vector3, public distance: number) {}
}
function getValidNeighbors(blockPos: Vector, distance: number): VienBlock[] {
    const result: VienBlock[] = [];
    const up = blockPos.above();
    const down = blockPos.below();
    result.push(new VienBlock(up, distance), new VienBlock(down, distance));
    const blockPositions = [up, down, blockPos];
    for (const blockPosition of blockPositions) {
        result.push(
            new VienBlock(blockPosition.west(), distance),
            new VienBlock(blockPosition.east(), distance),
            new VienBlock(blockPosition.north(), distance),
            new VienBlock(blockPosition.south(), distance),
            new VienBlock(blockPosition.north().east(), distance),
            new VienBlock(blockPosition.north().west(), distance),
            new VienBlock(blockPosition.south().east(), distance),
            new VienBlock(blockPosition.south().west(), distance)
        );
    }
    return result;
}

export function doVienMine(
    blockType: BlockType,
    block: Block,
    item: ItemStack,
    dimension: Dimension,
    maxBlocks: number = 10,
    noLimit: boolean = false
) {
    const maxDistance = 200;
    let cordinates = getValidNeighbors(Vector.fromVector3(block.location), 1);
    let blocks = 1;
    for (let { distance, pos: blockPos } of cordinates) {
        if (!noLimit && blocks >= maxBlocks) break;
        if (breakBlockFromLocIf(blockType, dimension, blockPos)) {
            if (!noLimit && distance >= maxDistance) break;
            cordinates.push(
                ...getValidNeighbors(Vector.fromVector3(blockPos), distance + 1)
            );
            blocks++;
        }
    }
}

export function damageItem(
    dura: ItemDurabilityComponent,
    damage: number = 1
): boolean {
    if (!dura.isValid()) return false;

    try {
        dura.damage += damage;
        return false;
    } catch {
        dura.damage = dura.maxDurability;
        return true;
    }
}

export function breakBlockFromLoc(
    dimension: Dimension,
    location: Vector | Vector3
): boolean {
    const targetBlock = dimension.getBlock(location);
    if (!targetBlock) return false;
    const targetLoc = locationToString(location);
    dimension.runCommand(`/fill ${targetLoc} ${targetLoc} air [] destroy`);
    return true;
}

export function breakBlockFromLocIf(
    blockType: BlockType,
    dimension: Dimension,
    location: Vector | Vector3
): boolean {
    const targetBlock = dimension.getBlock(location);
    if (!targetBlock) return false;
    if (blockType.id === targetBlock.typeId) {
        const targetLoc = locationToString(location);
        dimension.runCommand(`/fill ${targetLoc} ${targetLoc} air [] destroy`);
        return true;
    }
    return false;
}

export function breakBlockIf(
    blockType: BlockType,
    dimension: Dimension,
    targetBlock: Block | undefined
): boolean {
    if (!targetBlock) return false;
    if (blockType.id === targetBlock.typeId) {
        const targetLoc = locationToString(targetBlock.location);
        dimension.runCommand(`/fill ${targetLoc} ${targetLoc} air [] destroy`);
        return true;
    }
    return false;
}

export default function (world: World): Vector {
    const defaultWorldSpawn: Vector = world.getDefaultSpawnLocation() as Vector;
    if (defaultWorldSpawn.y < 319) return defaultWorldSpawn;
    defaultWorldSpawn.y = 319;
    const overworld: Dimension = world.getDimension("overworld");
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
        } else if (defaultWorldSpawn.y <= -64) {
            break;
        }
    }

    return world.getDefaultSpawnLocation() as Vector;
}
