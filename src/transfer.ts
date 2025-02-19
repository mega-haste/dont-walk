import {
    EntityInventoryComponent,
    ItemStack,
    Player,
    world
} from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

class ItemI {
    item: ItemStack;
    index: number;
    constructor(item: ItemStack, index: number) {
        this.item = item;
        this.index = index;
    }
}

world.afterEvents.itemUse.subscribe(async ({ source, itemStack: item }) => {
    if (item.typeId !== "haste:magic_mirror") return;
        const players = world.getPlayers({
            excludeNames: [source.name]
        });
        if (!players.length) { // Some jokes :D
            new MessageFormData()
                .title("Amigo!!")
                .body("look..\nYou Have NO friends and you wanna transfer dome item to NOBODY!!\nGET A LIFE!!")
                .show(source as any);
            return;
        }
    // Set up some variables
        const itemList: ItemI[] = [];
        const player_inventory: EntityInventoryComponent = source.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
        const player_inventory_size = player_inventory.inventorySize;
        const player_container = player_inventory.container;
        for (let i=0; i < player_inventory_size; i++) {
            const t = player_container?.getItem(i);
            if (t)
                itemList.push(new ItemI(t, i));
        }
    // Players selection form
        const resever_form = new ActionFormData();
        resever_form.title("Transfer to ...");
        for (const i of players) {
            resever_form.button(i.name);
        }
        const resever = await resever_form.show(source as any);
        if (resever.canceled) return;
        const resever_p: Player = players[resever.selection as number];

    // Item selection
        const item_transfer = new ActionFormData();
        item_transfer.title("Select item");
        for (const i of itemList) {
            item_transfer.button(
                i.item.type.id.split(":")[1],
                `textures/items/${i.item.typeId.split(":")[1]}`
            );
        }
        const res = await item_transfer.show(source as any);
        if (res.canceled) return;
        const item_t: ItemI = itemList[res.selection as number];

    // How many selction
        const amount_ = (await (
            new ModalFormData()
                .title(`${item_t.item.typeId.split(':')[1]} (${item_t.item.amount})`)
                .textField("Amount", `from 1 to ${item_t.item.amount}`, "1")
                    .show(source as any)));
        if (amount_.canceled) return;
        const a = (amount_.formValues as (string | number | boolean)[])[0] as string;
        if (!(/\d+/).test(a)) {
            source.sendMessage(`\`${a}\` as an input is invalid`);
            return;
        }
        const amount = parseInt(a);
        if (amount > item_t.item.amount) {
            source.sendMessage(`Can't transfer ${amount} of ${item_t.item.typeId} to ${resever_p.name}`)
            return;
        }
        const resever_inv = resever_p.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent; 
        if (!resever_inv.container?.emptySlotsCount) {
            resever_p.sendMessage("Your have to get your inventory clean to get the item!!");
            source.sendMessage("can't give them the item :(");
        }

    // Transfering the item
    {
        const i = item_t.item.clone();
        i.amount = amount;
        resever_inv.container?.addItem(i);
    }
    if (item_t.item.amount === amount) {
        player_inventory.container?.setItem(item_t.index);
        return;
    }
    item_t.item.amount -= amount;
    player_inventory.container?.setItem(
        item_t.index,
        item_t.item
    );
});

