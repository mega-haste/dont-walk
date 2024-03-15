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
  Vector,
  ItemStack,
  EntityInventoryComponent,
  RawMessage,
} from "@minecraft/server";
import {
  ActionFormData, ActionFormResponse, FormCancelationReason,
} from "@minecraft/server-ui";
import resetWorldSpawn from "./utils.js";
import "./transfer.js";
import "./lodestone.js";

function* range(end: number, start: number = 0, step: number = 1)
{
    while (start <= end) {
        yield start;
        start += step;
    }
}

type ActionFormOnSubmit = (i: number) => void;
type ActionFormOnCancel = (reason?: FormCancelationReason) => void;

class ActionForm {
    #onsubmit: ActionFormOnSubmit = () => {};
    #oncancel: ActionFormOnCancel = () => {};
    #form: ActionFormData;
    #index = 0;
    #buttonsEvents: Map<number, ActionFormOnSubmit> = new Map();
    public constructor(title: string, body?: string) {
        this.#form = new ActionFormData().title(title).body(body ?? "");
    }
    public addButton(text: string | RawMessage, icon?: string, onClick?: ActionFormOnSubmit) {
        this.#form.button(text, icon);
        if (onClick)
            this.#buttonsEvents.set(this.#index, onClick);
        this.#index++;
    }
    public onsubmit(ev: ActionFormOnSubmit) {
        this.#onsubmit = ev;
    }
    public oncancel(ev: ActionFormOnCancel) {
        this.#oncancel = ev;
    }
    public async show(player: Player): Promise<ActionFormResponse> {
        const res = await this.#form.show(player as any);
        if (res.canceled)
            this.#oncancel(res.cancelationReason);
        else if (res.selection !== undefined) {
            this.#onsubmit(res.selection);
            let e = this.#buttonsEvents.get(res.selection);
            if (e)
                e(res.selection);
        }
        return res;
    }
}

world.afterEvents.itemUse.subscribe(ev => {
    const {
        source,
        itemStack: item
    } = ev;
    if (item.typeId !== "minecraft:iron_sword") return;
    const invComponent = source.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
    const container = invComponent.container;
    const items: ItemStack[] = [];
    const insertingForm = new ActionForm("Storage", "Select an item to store");
    const bForm = new ActionForm("Storage", "Select an option");
    bForm.addButton("Get an item", undefined, ()=>{
        const t = new ActionFormData();
        for (let i of item.getDynamicPropertyIds()) {
            t.button(`${i}(${item.getDynamicProperty(i)})`);
        }
        t.show(source as any);
    });
    bForm.addButton("Store an item", undefined, ()=>{
        insertingForm.show(source);
    });
    insertingForm.onsubmit((i)=> {
        item.setDynamicProperty(
            items[i].typeId,
            (item.getDynamicProperty(items[i].typeId) ?? 0) as number + items[i].amount
        );
        container?.setItem(source.selectedSlot, item);
        source.sendMessage("== start ==========")
        item.getDynamicPropertyIds().forEach(j => {
            source.sendMessage(`${j}(${item.getDynamicProperty(j)})`);
        });
        source.sendMessage("== end ============")
    });
    for (let i of range((container?.size ?? 1) - 1)) {
        const j = container?.getItem(i);
        if (j) {
            items.push(j);
            insertingForm.addButton(j.typeId);
        }
    }
    bForm.show(source);
});

world.beforeEvents.explosion.subscribe(ev => {
    if (ev.source?.typeId === "minecraft:creeper") {
        ev.setImpactedBlocks([]);
    }
});

world.afterEvents.entityDie.subscribe(ev => {
  const entity: Entity = ev.deadEntity;

  if (entity.typeId !== "minecraft:player") return;
  entity.setDynamicProperty("death_dimention", entity.dimension.id);
  entity.setDynamicProperty("death_pos", entity.location);
});

world.afterEvents.itemCompleteUse.subscribe(ev => {
    if (ev.itemStack.typeId !== "minecraft:goat_horn") return;
    ev.source.addEffect("bad_omen", 9999999, {
        showParticles: false,
        amplifier: 3
    });
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
      .show(source as any);
    form
      .then((res) => {
        if (res.canceled) return;

        switch (res.selection) {
          case 0:
            home(source);
            break;
          case 1:
            try {
                const loc = source.getSpawnPoint();
                if (!loc) return;
              source.teleport(new Vector(
                                loc?.x as number,
                                loc?.y as number,
                                loc?.z as number
                            ), { dimension: loc?.dimension})
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


function defaultSpawn(source: Player) {
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

function home(source: Player) {
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
                const spawn = source.getSpawnPoint();
        source.teleport(new Vector(spawn?.x as number, spawn?.y as number, spawn?.z as number), { dimension: world.getDimension("overworld") });
      } catch (e) {
        defaultSpawn(source);
      }
      return;
    }
    source.teleport(
      source.getDynamicProperty("home_pos") as Vector,
      { dimension: world.getDimension(source.getDynamicProperty("home_dimention") as string) }
    );
  }
}

function lastDeath(source: Player) {
  const deathPos = source.getDynamicProperty("death_pos") as Vector;
  if (deathPos) {
    source.teleport(
      deathPos,
      { dimension: world.getDimension(source.getDynamicProperty("death_dimention") as string) }
    );
    return;
  }
  source.sendMessage("You didn't die yet... " + source.name);
}

function nether(source: Player) {
    const loc = world.getDefaultSpawnLocation();
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

function theEnd(source: Player) {
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

