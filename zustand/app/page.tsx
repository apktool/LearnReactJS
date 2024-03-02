'use client'

import {create} from "zustand";
import {combine, createJSONStorage, persist} from "zustand/middleware";

type State = {
    count: number
}

type Actions = {
    inc: (cnt: number) => void
    dec: (cnt: number) => void
}


const useCountStore = create<State & Actions>()(
    persist(
        combine(
            {count: 1},
            (set, get) => (
                {
                    inc: (cnt: number) => set((state) => ({count: state.count + cnt})),
                    dec: (cnt: number) => set((state) => ({count: state.count - cnt})),
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
            <button onClick={() => inc(1)}>+1</button>
            <button onClick={() => dec(1)}>-1</button>
        </main>
    );
}
