import { Player, RawMessage } from "@minecraft/server";
import {
    ActionFormData,
    ActionFormResponse,
    FormCancelationReason,
} from "@minecraft/server-ui";

export type ActionFormOnSubmit = (i: number) => void;
export type ActionFormOnCancel = (reason?: FormCancelationReason) => void;

export default class ActionForm {
    #onsubmit: ActionFormOnSubmit = () => {};
    #oncancel: ActionFormOnCancel = () => {};
    #form: ActionFormData;
    #index = 0;
    #buttonsEvents: Map<number, ActionFormOnSubmit> = new Map();
    public constructor(title: string, body?: string) {
        this.#form = new ActionFormData().title(title).body(body ?? "");
    }
    public addButton(
        text: string | RawMessage,
        icon?: string,
        onClick?: ActionFormOnSubmit
    ) {
        this.#form.button(text, icon);
        if (onClick) this.#buttonsEvents.set(this.#index, onClick);
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
        if (res.canceled) this.#oncancel(res.cancelationReason);
        else if (res.selection !== undefined) {
            this.#onsubmit(res.selection);
            let e = this.#buttonsEvents.get(res.selection);
            if (e) e(res.selection);
        }
        return res;
    }
}
