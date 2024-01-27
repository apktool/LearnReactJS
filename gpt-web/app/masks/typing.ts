import {type Mask} from "@/app/store/mask";
import {ModelConfig} from "@/app/store/config";

export type BuiltinMask = Omit<Mask, "id" | "modelConfig"> & {
    builtin: Boolean;
    modelConfig: Partial<ModelConfig>;
};
