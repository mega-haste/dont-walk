import { ItemComponentUseEvent, ItemCustomComponent } from "@minecraft/server";

export class Comperfort implements ItemCustomComponent {
    onUse({ source, itemStack }: ItemComponentUseEvent): void {
        // source.applyImpulse(Vector3);
    }
}