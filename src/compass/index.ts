import { WorldInitializeBeforeEvent } from "@minecraft/server";
import { Comperfort } from "./comperfort";

export function regesterAll(ev: WorldInitializeBeforeEvent): void {
    ev.itemComponentRegistry.registerCustomComponent("haste:comperfort", new Comperfort());
}