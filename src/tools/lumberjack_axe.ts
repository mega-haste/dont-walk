import {
    Block,
    BlockType,
    Dimension,
    ItemStack,
    system,
    world,
} from "@minecraft/server";
import { doVienMine } from "../utils";

world.beforeEvents.playerBreakBlock.subscribe(
    ({ block, dimension, itemStack }) => {
        if (!itemStack) return;
        if (itemStack?.typeId !== "haste:lumberjack_axe") return;
        if (block.hasTag("log")) {
            const blockType = block.type;
            system.run(() =>
                doVienMine(blockType, block, itemStack, dimension, 100, true)
            );
        }
    }
);

// function doVienMine(
//     blockType: BlockType,
//     block: Block,
//     item: ItemStack,
//     dimension: Dimension,
//     max: number = 10
// ) {
//     for (
//         let above = block.above(1);
//         above?.typeId === blockType.id;
//         above = above.above(1)
//     ) {
//         breakBlock(dimension, above.location);
//     }
// }
