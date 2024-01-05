import {getServerSideConfig} from "@/app/config/server";

describe('#server', () => {

    it('getServerSideConfig', () => {
        const cfg = getServerSideConfig()
        expect(cfg.isVercel).toBeFalsy()
    })
})