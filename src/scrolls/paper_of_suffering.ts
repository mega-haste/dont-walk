import { ItemComponentUseEvent, ItemCustomComponent } from "@minecraft/server";
import nether from "../scrolls_method/nether";

export class PaperOfSuffering implements ItemCustomComponent {
    public onUse(arg: ItemComponentUseEvent): void {
        nether(arg.source);
    }
}