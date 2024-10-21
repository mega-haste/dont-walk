import { ItemComponentUseEvent, ItemCustomComponent } from "@minecraft/server";
import theEnd from "../scrolls_method/theEnd";

export class PaperOfEnding implements ItemCustomComponent {
    constructor() {}
    public onUse(arg: ItemComponentUseEvent): void {
        theEnd(arg.source);
    }
}