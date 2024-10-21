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
import { Vec3 } from "./mcQuery/math";

export function toVector(l: DimensionLocation): Vec3 {
    return new Vec3(l.x, l.y, l.z);
}

export function locationToString(loc: Vec3 | Vector3) {
    return `${loc.x} ${loc.y} ${loc.z}`;
}

class VienBlock {
    constructor(public pos: Vec3 | Vector3, public distance: number) {}
}
function getValidNeighbors(blockPos: Vec3, distance: number): VienBlock[] {
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
    let cordinates = getValidNeighbors(Vec3.fromVector3(block.location), 1);
    let blocks = 1;
    for (let { distance, pos: blockPos } of cordinates) {
        if (!noLimit && blocks >= maxBlocks) break;
        if (breakBlockFromLocIf(blockType, dimension, blockPos)) {
            if (!noLimit && distance >= maxDistance) break;
            cordinates.push(
                ...getValidNeighbors(Vec3.fromVector3(blockPos), distance + 1)
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
    location: Vec3 | Vector3
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
    location: Vec3 | Vector3
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

export default function (world: World): Vec3 {
    const defaultWorldSpawn: Vec3 = world.getDefaultSpawnLocation() as Vec3;
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

    return world.getDefaultSpawnLocation() as Vec3;
}
