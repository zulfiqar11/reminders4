import { Subscription } from "rxjs";

export class SubscriptionsContainer {
  private subs = new Subscription();

  set add (s: Subscription) {
    this.subs.add(s);
  }

  dispose() {
    this.subs.unsubscribe();
  }
}
