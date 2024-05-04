'use client'

import {create} from "zustand";
import {combine, createJSONStorage, persist} from "zustand/middleware";

type State = {
    count: number
}

type Actions = {
    inc: () => void
    dec: () => void
}


const useCountStore = create<State & Actions>()(
    persist(
        combine(
            {count: 1},
            (set, get) => (
                {
                    inc: () => set(() => ({count: get().count + 1})),
                    dec: () => set(() => ({count: get().count - 1})),
                }
            )
        ),
        {
            name: "inc-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default function Home() {
    const {count, inc, dec} = useCountStore()

    return (
        <main>
            <h1>{count}</h1>
            <button onClick={() => inc()}>+1</button>
            <button onClick={() => dec()}>-1</button>
        </main>
    );
}
