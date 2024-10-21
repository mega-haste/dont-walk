import { ItemComponentUseEvent, ItemCustomComponent } from "@minecraft/server";
import home from "../scrolls_method/home";

export class RecallPaper implements ItemCustomComponent {
    public onUse(arg: ItemComponentUseEvent): void {
        home(arg.source);
    }
}