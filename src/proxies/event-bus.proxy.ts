import { BusEvent } from "@/common/constants/enums/BusEvent.enum";
import mitt, { Emitter } from "mitt";

class EventBusProxy {
  eventBus: Emitter<Record<string, unknown>>;

  constructor() {
    this.eventBus = mitt<Record<string, unknown>>();
  }

  /**
   * Starts event listening subscription.
   * @param event typeof BusEvent
   * @param callback
   */
  on(event: BusEvent, callback: (n: unknown) => any): any {
    this.eventBus.on(event, callback);
  }

  /**
   * Stops instance-specific event listening subscription.
   */
  off(event: BusEvent, callback: (n: unknown) => any): any {
    this.eventBus.off(event, callback);
  }

  /**
   * Stops all listening subscriptions for event.
   * @param event typeof BusEvent
   */
  end(event: BusEvent): any {
    this.eventBus.off(event);
  }

  /**
   * Broadcast to all subscribers.
   * */
  emit(event: BusEvent, payload: unknown = null) {
    this.eventBus.emit(event, payload);
  }

  /**
   * Log all event listener subscriptions
   */
  logSubs(): void {
    console.log("eventBus subscriptions", this.eventBus.all);
  }
}

export const eventBus = new EventBusProxy();
