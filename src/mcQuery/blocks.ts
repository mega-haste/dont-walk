import { Block } from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";

export namespace Blocks {
    const log = [
        MinecraftBlockTypes.OakLog,
        MinecraftBlockTypes.BirchLog,
        MinecraftBlockTypes.AcaciaLog,
        MinecraftBlockTypes.CherryLog,
        MinecraftBlockTypes.JungleLog,
        MinecraftBlockTypes.SpruceLog,
        MinecraftBlockTypes.DarkOakLog,
        MinecraftBlockTypes.MangroveLog,
        MinecraftBlockTypes.CrimsonStem,
        MinecraftBlockTypes.WarpedStem,
        MinecraftBlockTypes.StrippedOakLog,
        MinecraftBlockTypes.StrippedBirchLog,
        MinecraftBlockTypes.StrippedBirchLog,
        MinecraftBlockTypes.StrippedAcaciaLog,
        MinecraftBlockTypes.StrippedCherryLog,
        MinecraftBlockTypes.StrippedJungleLog,
        MinecraftBlockTypes.StrippedSpruceLog,
        MinecraftBlockTypes.StrippedDarkOakLog,
        MinecraftBlockTypes.StrippedMangroveLog,
        MinecraftBlockTypes.StrippedCrimsonStem,
        MinecraftBlockTypes.StrippedWarpedStem,
    ];
    export function isLog(block: Block): boolean {
        return block.hasTag("log") || log.includes(block.typeId as MinecraftBlockTypes);
    }
}