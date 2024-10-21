import {
    system,
    world,
    Vector3
} from "@minecraft/server";
import { doVienMine } from "../utils";
import { Blocks } from "../mcQuery/blocks";
import { Vector3Builder } from "@minecraft/math";

world.beforeEvents.playerBreakBlock.subscribe(
    ({ block, dimension, itemStack }) => {
        if (!itemStack) return;
        if (itemStack?.typeId !== "haste:lumberjack_axe") return;
        if (Blocks.isLog(block)) {
            const blockType = block.type;
            system.run(() =>
                doVienMine(blockType, block, itemStack, dimension, 100, true)
            );
        }
    }
);