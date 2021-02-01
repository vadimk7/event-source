import {Observable, Subscriber} from 'rxjs';
import {NgMessageEvent} from '../interfaces/message-event';

export class NgEventSource<T> extends Observable<NgMessageEvent<T>> {
    private eventSource = new EventSource(this.url, this.eventSourceInit);
    private subscribers = new Set<Subscriber<Event>>();

    constructor(private url: string, private eventSourceInit?: EventSourceInit) {
        super(subscriber => {
            if (this.eventSource.readyState === EventSource.CLOSED) {
                // todo: move this creation logic (to the factory?)
                this.eventSource = new EventSource(this.url, this.eventSourceInit);
                this.eventSource.onopen = event =>
                    this.subscribers.forEach(subscriber => subscriber.next(event));
                this.eventSource.onmessage = event =>
                    this.subscribers.forEach(subscriber => subscriber.next(event));
                this.eventSource.onerror = event =>
                    this.subscribers.forEach(subscriber => subscriber.error(event));
            }

            this.subscribers.add(subscriber);

            return () => {
                this.subscribers.delete(subscriber);
            };
        });
    }
}
