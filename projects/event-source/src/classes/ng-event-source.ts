import {Observable} from 'rxjs';
import {NgMessageEvent} from '../interfaces/message-event';

export class NgEventSource<T> extends Observable<NgMessageEvent<T>> {
    constructor(
        url: string,
        eventName: string = 'message',
        eventSourceInit?: EventSourceInit,
    ) {
        super(subscriber => {
            const eventSource = new EventSource(url, eventSourceInit);

            eventSource.addEventListener(eventName, event =>
                subscriber.next(event as NgMessageEvent<T>),
            );

            eventSource.addEventListener('error', event => {
                if (eventSource.readyState === EventSource.CONNECTING) {
                    return;
                }

                subscriber.error(event);
            });

            return () => eventSource.close();
        });
    }
}
