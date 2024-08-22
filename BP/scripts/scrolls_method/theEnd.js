import { world } from "@minecraft/server";
export default function theEnd(source) {
    if (source.dimension.id === "minecraft:the_end")
        return;
    source.teleport({
        x: 0,
        y: 65,
        z: 0,
    }, { dimension: world.getDimension("minecraft:the_end") });
}
