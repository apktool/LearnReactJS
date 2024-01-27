import {createPersistStore} from "@/app/utils/store";
import {StoreKey} from "@/app/constant";
import Fuse from "fuse.js";

export interface Prompt {
    id: string;
    isUser?: boolean;
    title: string;
    content: string;
    createdAt: number;
}

export const SearchService = {
    ready: false,
    builtinEngine: new Fuse<Prompt>([], {keys: ["title"]}),
    userEngine: new Fuse<Prompt>([], {keys: ["title"]}),
    count: {
        builtin: 0,
    },
    allPrompts: [] as Prompt[],
    builtinPrompts: [] as Prompt[],

    init(builtinPrompts: Prompt[], userPrompts: Prompt[]) {
        if (this.ready) {
            return;
        }
        this.allPrompts = userPrompts.concat(builtinPrompts);
        this.builtinPrompts = builtinPrompts.slice();
        this.builtinEngine.setCollection(builtinPrompts);
        this.userEngine.setCollection(userPrompts);
        this.ready = true;
    },

    remove(id: string) {
        this.userEngine.remove((doc) => doc.id === id);
    },

    add(prompt: Prompt) {
        this.userEngine.add(prompt);
    },

    search(text: string) {
        const userResults = this.userEngine.search(text);
        const builtinResults = this.builtinEngine.search(text);
        return userResults.concat(builtinResults).map((v) => v.item);
    },
};


export const usePromptStore = createPersistStore(
    {
        counter: 0,
        prompts: {} as Record<string, Prompt>
    },
    (set, get) => ({
            getUserPrompts() {
                const userPrompts = Object.values(get().prompts ?? {});
                userPrompts.sort((a, b) =>
                    b.id && a.id ? b.createdAt - a.createdAt : 0,
                );
                return userPrompts;
            },

            search(text: string) {
                if (text.length === 0) {
                    // return all rompts
                    return this.getUserPrompts().concat(SearchService.builtinPrompts);
                }
                return SearchService.search(text) as Prompt[];
            },
        }
    ),
    {
        name: StoreKey.Prompt,
        version: 3,
    }
)