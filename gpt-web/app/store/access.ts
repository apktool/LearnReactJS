import {getClientConfig} from "@/app/config/client";
import {ApiPath, DEFAULT_API_HOST, ServiceProvider, StoreKey} from "@/app/constant";
import {createPersistStore} from "@/app/utils/store";
import {getHeaders} from "@/app/client/api";

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

const DEFAULT_OPENAI_URL =
    getClientConfig()?.buildMode === "export" ? DEFAULT_API_HOST : ApiPath.OpenAI

const DEFAULT_ACCESS_STATE = {
    accessCode: "",
    useCustomConfig: false,

    provider: ServiceProvider.OpenAI,

    // openai
    openaiUrl: DEFAULT_OPENAI_URL,
    openaiApiKey: "",

    // server config
    needCode: true,
    hideUserApiKey: false,
    hideBalanceQuery: false,
    disableGPT4: false,
    disableFastLink: false,
    customModels: "",
}

export const useAccessStore = createPersistStore(
    {...DEFAULT_ACCESS_STATE},
    (set, get) => ({
        enabledAccessControl() {
            this.fetch();

            return get().needCode;
        },

        fetch() {
            if (fetchState > 0 || getClientConfig()?.buildMode === "export") return;
            fetchState = 1;
            fetch("/api/config", {
                method: "post",
                body: null,
                headers: {
                    ...getHeaders(),
                },
            })
                .then((res) => res.json())
                .then((res: DangerConfig) => {
                    console.log("[Config] got config from server", res);
                    set(() => ({...res}));
                })
                .catch(() => {
                    console.error("[Config] failed to fetch config");
                })
                .finally(() => {
                    fetchState = 2;
                });
        },
    }),
    {name: StoreKey.Access}
)