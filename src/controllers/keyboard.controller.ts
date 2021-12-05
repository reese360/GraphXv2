import { eventBus } from "@/proxies/event-bus.proxy";
import { BusEvent } from "@/common/constants/enums/BusEvent.enum";

export default class KeyboardController {
  constructor() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  onKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case "Escape":
        eventBus.emit(BusEvent.DESELECT);
        break;
      case "Delete":
        eventBus.emit(BusEvent.DELETE);
        break;
    }
  }
}
