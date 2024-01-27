import {useMemo} from "react";
import {collectModels} from "./model";
import {useAccessStore} from "@/app/store/access";
import {useAppConfig} from "@/app/store/config";

export function useAllModels() {
    const accessStore = useAccessStore();
    const configStore = useAppConfig();
    const models = useMemo(() => {
        return collectModels(
            configStore.models,
            [configStore.customModels, accessStore.customModels].join(","),
        );
    }, [accessStore.customModels, configStore.customModels, configStore.models]);

    return models;
}