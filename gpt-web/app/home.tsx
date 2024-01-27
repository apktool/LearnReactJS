"use client"

import React, {useEffect, useState} from "react";
import ErrorBoundary from "@/app/error";
import {useAppConfig} from "@/app/store/config";
import {getCSSVar} from "@/app/utils";
import {getISOLang} from "@/app/locales";
import {api} from "@/app/client/api";
import {useAccessStore} from "@/app/store/access";
import {getClientConfig} from "@/app/config/client";


export function Loading(props: { noLogo?: boolean }) {
    return (
        <div>
            <h1>Loading</h1>
        </div>
    );
}

export function useSwitchTheme() {
    const config = useAppConfig();

    useEffect(() => {
        document.body.classList.remove("light");
        document.body.classList.remove("dark");

        if (config.theme === "dark") {
            document.body.classList.add("dark");
        } else if (config.theme === "light") {
            document.body.classList.add("light");
        }

        const metaDescriptionDark = document.querySelector(
            'meta[name="theme-color"][media*="dark"]',
        );
        const metaDescriptionLight = document.querySelector(
            'meta[name="theme-color"][media*="light"]',
        );

        if (config.theme === "auto") {
            metaDescriptionDark?.setAttribute("content", "#151515");
            metaDescriptionLight?.setAttribute("content", "#fafafa");
        } else {
            const themeColor = getCSSVar("--theme-color");
            metaDescriptionDark?.setAttribute("content", themeColor);
            metaDescriptionLight?.setAttribute("content", themeColor);
        }
    }, [config.theme]);
}


function useHtmlLang() {
    useEffect(() => {
        const lang = getISOLang();
        const htmlLang = document.documentElement.lang;

        if (lang !== htmlLang) {
            document.documentElement.lang = lang;
        }
    }, []);
}

export function useLoadData() {
    const config = useAppConfig();

    useEffect(() => {
        (async () => {
            const models = await api.llm.models();
            config.mergeModels(models);
        })();
    }, []);
}


const useHasHydrated = () => {
    const [hasHydrated, setHasHydrated] = useState<boolean>(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    return hasHydrated;
};

export default function Home() {
    useSwitchTheme();
    useLoadData();
    useHtmlLang();

    useEffect(() => {
        console.log("[Config] got config from build time", getClientConfig());
        useAccessStore.getState().fetch();
    }, []);

    if (!useHasHydrated()) {
        return <Loading/>;
    }

    return (
        <ErrorBoundary>
            <h1>Hello Home</h1>
        </ErrorBoundary>
    )
}