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
import { ActionFormData, } from "@minecraft/server-ui";
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
export default ActionForm;
