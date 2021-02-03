import {Observable, Subscriber} from 'rxjs';
import {NgMessageEvent} from '../interfaces/message-event';

export class NgEventSource<T> extends Observable<NgMessageEvent<T>> {
    private subscribers = new Set<Subscriber<Event>>();
    private eventSource: EventSource | null = null;

    constructor(private url: string, private eventSourceInit?: EventSourceInit) {
        super(subscriber => {
            this.subscribers.add(subscriber);

            if (this.eventSource === null) {
                this.connect();
            }

            return () => {
                this.subscribers.delete(subscriber);

                if (this.subscribers.size === 0) {
                    this.close();
                }
            };
        });
    }

    private connect() {
        this.eventSource = new EventSource(this.url, this.eventSourceInit);
        this.eventSource.onopen = event =>
            this.subscribers.forEach(subscriber => subscriber.next(event));
        this.eventSource.onmessage = event =>
            this.subscribers.forEach(subscriber => subscriber.next(event));
        this.eventSource.onerror = event =>
            this.subscribers.forEach(subscriber => subscriber.error(event));
    }

    private close() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }
}
