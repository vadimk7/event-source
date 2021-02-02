import {Observable} from 'rxjs';
import {NgMessageEvent} from '../interfaces/message-event';
import {SubscribersStore} from './subscribers-store';

export class NgEventSource<T> extends Observable<NgMessageEvent<T>> {
    private store = new SubscribersStore<Event>();
    private eventSource: EventSource | null = null;

    constructor(private url: string, private eventSourceInit?: EventSourceInit) {
        super(subscriber => {
            this.store.add(subscriber);

            return () => this.store.delete(subscriber);
        });

        this.store.change$.subscribe(subscribers =>
            subscribers.size > 0 ? this.connect() : this.disconnect(),
        );
    }

    private connect() {
        if (this.eventSource) {
            return;
        }

        this.eventSource = new EventSource(this.url, this.eventSourceInit);
        this.eventSource.onopen = event => this.store.forEach(s => s.next(event));
        this.eventSource.onmessage = event => this.store.forEach(s => s.next(event));
        this.eventSource.onerror = event => this.store.forEach(s => s.error(event));
    }

    private disconnect() {
        if (this.eventSource === null) {
            return;
        }

        this.eventSource.close();
        this.eventSource = null;
    }
}
