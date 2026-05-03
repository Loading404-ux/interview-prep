import { Injectable } from "@nestjs/common"
import { MessageEvent } from "@nestjs/common"
import { Observable, Subject } from "rxjs"

@Injectable()
export class SseService {
    private readonly streams = new Map<string, Set<Subject<MessageEvent>>>()

    createStream(userId: string): Observable<MessageEvent> {
        return new Observable<MessageEvent>((subscriber) => {
            const subject = new Subject<MessageEvent>()
            const subscription = subject.subscribe(subscriber)

            let set = this.streams.get(userId)
            if (!set) {
                set = new Set()
                this.streams.set(userId, set)
            }
            set.add(subject)

            subject.next({
                type: "connected",
                data: { ok: true },
            })

            return () => {
                subscription.unsubscribe()
                subject.complete()
                set?.delete(subject)
                if (set && set.size === 0) {
                    this.streams.delete(userId)
                }
            }
        })
    }

    emit(userId: string, event: MessageEvent) {
        const set = this.streams.get(userId)
        if (!set) return

        for (const subject of set) {
            subject.next(event)
        }
    }
}
