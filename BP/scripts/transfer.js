import {
    EntityInventoryComponent,
    ItemStack,
    Player,
    world
} from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

class ItemI {
    /**
     * @param {ItemStack} item 
     * @param {number} index
     */
    constructor(item, index) {
        this.item = item;
        this.index = index;
    }
}

world.afterEvents.itemUse.subscribe(async ({ source, itemStack: item }) => {
    if (item.typeId !== "haste:magic_mirror") return;
            const players = world.getPlayers({
                excludeNames: [source.name]
            });
            if (!players.length) {
                new MessageFormData()
                    .title("Amigo!!")
                    .body("look..\nYou Have NO friends and you wanna transfer dome item to NOBODY!!\nGET A LIFE!!")
                    .show(source);
                return;
            }
            /** @type {ItemI[]} */
            const itemList = [];
            /** @type {EntityInventoryComponent} */
            const player_inventory = source.getComponent(EntityInventoryComponent.componentId);
            const player_inventory_size = player_inventory.inventorySize;
            const player_container = player_inventory.container;
            for (let i=0; i < player_inventory_size; i++) {
                const t = player_container.getItem(i);
                if (t)
                    itemList.push(new ItemI(t, i));
            }
            const resever_form = new ActionFormData();
            resever_form.title("Transfer to ...");
            for (let i of players) {
                //if (i.name === source.name) continue;
                resever_form.button(i.name);
            }
            const resever = await resever_form.show(source);
            if (resever.canceled) return;
            /** @type {Player} */
            const resever_p = players[resever.selection];

            const item_transfer = new ActionFormData();
            item_transfer.title("Select item");
            //item_transfer.slider("Amount", 1, 64, 1, 32);
            for (let i of itemList) {
                item_transfer.button(
                    i.item.type.id.split(":")[1],
                    `textures/items/${i.item.typeId.split(":")[1]}`
                );
            }
            const res = await item_transfer.show(source);
            if (res.canceled) return;
            /** @type {ItemI} */
            const item_t = itemList[res.selection];
            /** @type {number} */
            const amount = (await (new ModalFormData()
                    .title("how many?")
                    .slider("Amount", 0, 64, 1, 32)).show(source))
                .formValues[0];
            if (amount > item_t.item.amount) {
                source.sendMessage(`Can't transfer ${amount} of ${item_t.item.typeId} to ${resever_p.name}`)
                return;
            }
            /** @type {EntityInventoryComponent} */
            const resever_inv = resever_p.getComponent(EntityInventoryComponent.componentId); 
            if (!resever_inv.container.emptySlotsCount) {
                resever_p.sendMessage("Your have to get your inventory clean to get the item!!");
                source.sendMessage("can't give them the item :(");
            }
            resever_inv.container.addItem(new ItemStack(item_t.item.typeId, amount));
            item_t.item.amount -= amount;
            player_inventory.container.setItem(
                item_t.index,
                item_t.item
            );
});

