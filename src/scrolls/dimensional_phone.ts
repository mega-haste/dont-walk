import { ItemComponentUseEvent, ItemCustomComponent } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import home from "../scrolls_method/home";
import { Vec3 as Vector } from "../mcQuery/math";
import defaultSpawn from "../scrolls_method/defaultSpawn";
import lastDeath from "../scrolls_method/lastDeath";
import nether from "../scrolls_method/nether";
import theEnd from "../scrolls_method/theEnd";

export class DimentionalPhone implements ItemCustomComponent {
    onUse({ source }: ItemComponentUseEvent): void {
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
        form.then((res) => {
            if (res.canceled) return;

            switch (res.selection) {
                case 0:
                    home(source);
                    break;
                case 1:
                    try {
                        const loc = source.getSpawnPoint();
                        if (!loc) return;
                        source.teleport(
                            new Vector(
                                loc?.x as number,
                                loc?.y as number,
                                loc?.z as number
                            ),
                            { dimension: loc?.dimension }
                        );
                    } catch (e) {
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
        }).catch((_) => console.error(_));
    }
}