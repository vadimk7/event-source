import {Observable, Subject, Subscriber} from 'rxjs';

export class SubscribersStore<T> {
    private readonly store = new Set<Subscriber<T>>();
    private readonly store$ = new Subject<Set<Subscriber<T>>>();

    get change$(): Observable<Set<Subscriber<T>>> {
        return this.store$.asObservable();
    }

    add(subscriber: Subscriber<T>) {
        this.store.add(subscriber);
        this.store$.next(this.store);
    }

    delete(subscriber: Subscriber<T>) {
        this.store.delete(subscriber);
        this.store$.next(this.store);
    }

    forEach(fn: (subscriber: Subscriber<T>) => void) {
        this.store.forEach(fn);
    }
}
