/**
  * well, im the developer.
  * I just want you enjoy my addon. but don't take all that
  * make as yours.
  * So if want to make content with this addon or use it 
  * in a mod pack, plz mension me as creator
  *
  * By Hesham aka Haste
  */

import {
  world,
  Player,
  Entity,
  ItemStack,
  Vector,
  system,
} from "@minecraft/server";
import {
  ActionFormData
} from "@minecraft/server-ui";
import resetWorldSpawn from "./utils.js";
import "./transfer.js";
import "./lodestone.js";

world.afterEvents.entityDie.subscribe(ev => {
  /** @type {Entity} */
  const entity = ev.deadEntity;

  if (entity.typeId !== "minecraft:player") return;
  entity.setDynamicProperty("death_dimention", entity.dimension.id);
  entity.setDynamicProperty("death_pos", entity.location);
});

world.afterEvents.itemUse.subscribe(({ itemStack: item, source }) => {
  if (item.typeId === "haste:recall_paper") {
    home(source);
  } else if (item.typeId === "haste:paper_of_suffering") {
    nether(source);
  } else if (item.typeId === "haste:paper_of_ending") {
    theEnd(source);
  } else if (item.typeId === "minecraft:recovery_compass") {
    lastDeath(source);
  } else if (item.typeId === "minecraft:compass") {
        if (!source.isSneaking) return;
    defaultSpawn(source);
  } else if (item.typeId === "haste:dimensional_phone") {
    const form = new ActionFormData()
      .title("Dimentional Phone")
      .body("Select option")
      .button("Home", "textures/items/recall_scroll")
      .button("Spawn", "textures/items/bed_purple")
      .button("World spawn", "textures/items/compass_item")
      .button("Last death body", "textures/items/recovery_compass_item")
      .button("Nether", "textures/items/scroll_of_pain")
      .button("The end", "textures/items/the_end_scroll")
      .show(source);
    form
      .then((res) => {
        if (res.canceled) return;

        switch (res.selection) {
          case 0:
            home(source);
            break;
          case 1:
            try {
                let loc = source.getSpawnPoint();
              source.teleport({
                                x: loc.x, y: loc.y, z: loc.z
                            }, { dimension: loc.dimension})
            } catch (e) {
              console.error(e);
            }
            break;
          case 2:
            defaultSpawn(source)
            break;
          case 3:
            lastDeath(source);
            break;
          case 4:
            nether(source);
            break;
          case 5:
            theEnd(source);
            break;
        }
      })
      .catch(_ => console.error(_));
  }
});


/**
  * @param {Player} source
  */
function defaultSpawn(source) {
  try {
    source.teleport(
      resetWorldSpawn(world),
      { dimension: world.getDimension("overworld") }
    );
  } catch (e) {
    source.teleport(
      world.getDefaultSpawnLocation(),
      { dimension: world.getDimension("overworld") }
    )
    source.teleport(
      resetWorldSpawn(world),
      { dimension: world.getDimension("overworld") }
    );
  }
}

/**
  * @param {Player} source
  */
function home(source) {
  if (source.isSneaking) {
    if (source.dimension.id != "minecraft:overworld") {
      source.sendMessage(`Recall Scroll only works in overworld dimention`);
      return;
    }

    // source.setDynamicProperty("home_pos", toFString(source.location));
    source.setDynamicProperty("home_pos", source.location);
    source.setDynamicProperty("home_dimention", source.dimension.id);
    world.playSound("beacon.activate", source.location);
  } else {
    if (!source.getDynamicProperty("home_pos")) {
      try {
        source.teleport(source.getSpawnPosition(), { dimension: world.getDimension("overworld") });
      } catch (e) {
        defaultSpawn(source);
      }
      return;
    }
    source.teleport(
      source.getDynamicProperty("home_pos"),
      { dimension: world.getDimension(source.getDynamicProperty("home_dimention")) }
    );
  }
}

/**
  * @param {Player} source
  */
function lastDeath(source) {
  const deathPos = source.getDynamicProperty("death_pos");
  if (deathPos) {
    source.teleport(
      deathPos,
      { dimension: world.getDimension(source.getDynamicProperty("death_dimention")) }
    );
    return;
  }
  source.sendMessage("You didn't die yet... " + source.name);
}

/**
  * @param {Player} source
  */
function nether(source) {
    let loc = world.getDefaultSpawnLocation();
    const nether = world.getDimension("minecraft:nether");
    loc.y = 50;

    source.addEffect("fire_resistance", 20 * 10, { showParticles: false });
    source.teleport(
        loc,
        { dimension: nether }
    );
    nether.fillBlocks({
        x: source.location.x - 5,
        y: source.location.y - 1,
        z: source.location.z - 5
    }, {
        x: source.location.x + 5,
        y: source.location.y - 1,
        z: source.location.z + 5
    }, "minecraft:polished_blackstone_bricks");
    nether.fillBlocks({
        x: source.location.x - 5,
        y: source.location.y,
        z: source.location.z - 5
    }, {
        x: source.location.x + 5,
        y: source.location.y + 10,
        z: source.location.z + 5
    }, "minecraft:air");
}

/**
  * @param {Player} source
  */
function theEnd(source) {
  if (source.dimension.id === "minecraft:the_end") return;

  source.teleport(
    {
      x: 0,
      y: 65,
      z: 0
    },
    { dimension: world.getDimension("minecraft:the_end") }
  );
}

