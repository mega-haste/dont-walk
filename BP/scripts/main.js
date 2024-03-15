/**
  * well, im the developer.
  * I just want you enjoy my addon. but don't take all that
  * make as yours.
  * So if want to make content with this addon or use it
  * in a mod pack, plz mension me as creator
  *
  * By Hesham aka Haste
  */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ActionForm_onsubmit, _ActionForm_oncancel, _ActionForm_form, _ActionForm_index, _ActionForm_buttonsEvents;
import { world, Vector, EntityInventoryComponent, } from "@minecraft/server";
import { ActionFormData, } from "@minecraft/server-ui";
import resetWorldSpawn from "./utils.js";
import "./transfer.js";
import "./lodestone.js";
function* range(end, start = 0, step = 1) {
    while (start <= end) {
        yield start;
        start += step;
    }
}
class ActionForm {
    constructor(title, body) {
        _ActionForm_onsubmit.set(this, () => { });
        _ActionForm_oncancel.set(this, () => { });
        _ActionForm_form.set(this, void 0);
        _ActionForm_index.set(this, 0);
        _ActionForm_buttonsEvents.set(this, new Map());
        __classPrivateFieldSet(this, _ActionForm_form, new ActionFormData().title(title).body(body ?? ""), "f");
    }
    addButton(text, icon, onClick) {
        var _a;
        __classPrivateFieldGet(this, _ActionForm_form, "f").button(text, icon);
        if (onClick)
            __classPrivateFieldGet(this, _ActionForm_buttonsEvents, "f").set(__classPrivateFieldGet(this, _ActionForm_index, "f"), onClick);
        __classPrivateFieldSet(this, _ActionForm_index, (_a = __classPrivateFieldGet(this, _ActionForm_index, "f"), _a++, _a), "f");
    }
    onsubmit(ev) {
        __classPrivateFieldSet(this, _ActionForm_onsubmit, ev, "f");
    }
    oncancel(ev) {
        __classPrivateFieldSet(this, _ActionForm_oncancel, ev, "f");
    }
    async show(player) {
        const res = await __classPrivateFieldGet(this, _ActionForm_form, "f").show(player);
        if (res.canceled)
            __classPrivateFieldGet(this, _ActionForm_oncancel, "f").call(this, res.cancelationReason);
        else if (res.selection !== undefined) {
            __classPrivateFieldGet(this, _ActionForm_onsubmit, "f").call(this, res.selection);
            let e = __classPrivateFieldGet(this, _ActionForm_buttonsEvents, "f").get(res.selection);
            if (e)
                e(res.selection);
        }
        return res;
    }
}
_ActionForm_onsubmit = new WeakMap(), _ActionForm_oncancel = new WeakMap(), _ActionForm_form = new WeakMap(), _ActionForm_index = new WeakMap(), _ActionForm_buttonsEvents = new WeakMap();
world.afterEvents.itemUse.subscribe(ev => {
    const { source, itemStack: item } = ev;
    if (item.typeId !== "minecraft:iron_sword")
        return;
    const invComponent = source.getComponent(EntityInventoryComponent.componentId);
    const container = invComponent.container;
    const items = [];
    const insertingForm = new ActionForm("Storage", "Select an item to store");
    const bForm = new ActionForm("Storage", "Select an option");
    bForm.addButton("Get an item", undefined, () => {
        const t = new ActionFormData();
        for (let i of item.getDynamicPropertyIds()) {
            t.button(`${i}(${item.getDynamicProperty(i)})`);
        }
        t.show(source);
    });
    bForm.addButton("Store an item", undefined, () => {
        insertingForm.show(source);
    });
    insertingForm.onsubmit((i) => {
        item.setDynamicProperty(items[i].typeId, (item.getDynamicProperty(items[i].typeId) ?? 0) + items[i].amount);
        container?.setItem(source.selectedSlot, item);
        source.sendMessage("== start ==========");
        item.getDynamicPropertyIds().forEach(j => {
            source.sendMessage(`${j}(${item.getDynamicProperty(j)})`);
        });
        source.sendMessage("== end ============");
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
    const entity = ev.deadEntity;
    if (entity.typeId !== "minecraft:player")
        return;
    entity.setDynamicProperty("death_dimention", entity.dimension.id);
    entity.setDynamicProperty("death_pos", entity.location);
});
world.afterEvents.itemCompleteUse.subscribe(ev => {
    if (ev.itemStack.typeId !== "minecraft:goat_horn")
        return;
    ev.source.addEffect("bad_omen", 9999999, {
        showParticles: false,
        amplifier: 3
    });
});
world.afterEvents.itemUse.subscribe(({ itemStack: item, source }) => {
    if (item.typeId === "haste:recall_paper") {
        home(source);
    }
    else if (item.typeId === "haste:paper_of_suffering") {
        nether(source);
    }
    else if (item.typeId === "haste:paper_of_ending") {
        theEnd(source);
    }
    else if (item.typeId === "minecraft:recovery_compass") {
        lastDeath(source);
    }
    else if (item.typeId === "minecraft:compass") {
        if (!source.isSneaking)
            return;
        defaultSpawn(source);
    }
    else if (item.typeId === "haste:dimensional_phone") {
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
            if (res.canceled)
                return;
            switch (res.selection) {
                case 0:
                    home(source);
                    break;
                case 1:
                    try {
                        const loc = source.getSpawnPoint();
                        if (!loc)
                            return;
                        source.teleport(new Vector(loc?.x, loc?.y, loc?.z), { dimension: loc?.dimension });
                    }
                    catch (e) {
                        console.error(e);
                    }
                    break;
                case 2:
                    defaultSpawn(source);
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
function defaultSpawn(source) {
    try {
        source.teleport(resetWorldSpawn(world), { dimension: world.getDimension("overworld") });
    }
    catch (e) {
        source.teleport(world.getDefaultSpawnLocation(), { dimension: world.getDimension("overworld") });
        source.teleport(resetWorldSpawn(world), { dimension: world.getDimension("overworld") });
    }
}
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
    }
    else {
        if (!source.getDynamicProperty("home_pos")) {
            try {
                const spawn = source.getSpawnPoint();
                source.teleport(new Vector(spawn?.x, spawn?.y, spawn?.z), { dimension: world.getDimension("overworld") });
            }
            catch (e) {
                defaultSpawn(source);
            }
            return;
        }
        source.teleport(source.getDynamicProperty("home_pos"), { dimension: world.getDimension(source.getDynamicProperty("home_dimention")) });
    }
}
function lastDeath(source) {
    const deathPos = source.getDynamicProperty("death_pos");
    if (deathPos) {
        source.teleport(deathPos, { dimension: world.getDimension(source.getDynamicProperty("death_dimention")) });
        return;
    }
    source.sendMessage("You didn't die yet... " + source.name);
}
function nether(source) {
    const loc = world.getDefaultSpawnLocation();
    const nether = world.getDimension("minecraft:nether");
    loc.y = 50;
    source.addEffect("fire_resistance", 20 * 10, { showParticles: false });
    source.teleport(loc, { dimension: nether });
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
function theEnd(source) {
    if (source.dimension.id === "minecraft:the_end")
        return;
    source.teleport({
        x: 0,
        y: 65,
        z: 0
    }, { dimension: world.getDimension("minecraft:the_end") });
}
