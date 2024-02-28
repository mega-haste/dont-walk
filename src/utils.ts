import {
    Dimension,
    DimensionLocation,
    Vector,
    World,
} from "@minecraft/server";

export function toVector(l: DimensionLocation): Vector {
    return new Vector(l.x, l.y, l.z);
}

export default function(world: World): Vector {
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

  return (world.getDefaultSpawnLocation() as Vector);
}
