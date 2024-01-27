import {useEffect, useState} from "react";
import {showToast} from "@/app/components/ui-lib";
import Locale from "@/app/locales"

export function trimTopic(topic: string) {
    // Fix an issue where double quotes still show in the Indonesian language
    // This will remove the specified punctuation from the end of the string
    // and also trim quotes from both the start and end if they exist.
    return topic.replace(/^["“”]+|["“”]+$/g, "").replace(/[，。！？”“"、,.!?]*$/, "");
}

export function getCSSVar(varName: string) {
    return getComputedStyle(document.body).getPropertyValue(varName).trim();
}

export function useWindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const onResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return size;
}

export const MOBILE_MAX_WIDTH = 600;

export function useMobileScreen() {
    const {width} = useWindowSize();

    return width <= MOBILE_MAX_WIDTH;
}

export async function copyToClipboard(text: string) {
    try {
        if (window.__TAURI__) {
            window.__TAURI__.writeText(text);
        } else {
            await navigator.clipboard.writeText(text);
        }

        showToast(Locale.Copy.Success);
    } catch (error) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand("copy");
            showToast(Locale.Copy.Success);
        } catch (error) {
            showToast(Locale.Copy.Failed);
        }
        document.body.removeChild(textArea);
    }
}

export function selectOrCopy(el: HTMLElement, content: string) {
    const currentSelection = window.getSelection();

    if (currentSelection?.type === "Range") {
        return false;
    }

    copyToClipboard(content);

    return true;
}

export async function downloadAs(text: string, filename: string) {
    if (window.__TAURI__) {
        const result = await window.__TAURI__.dialog.save({
            defaultPath: `${filename}`,
            filters: [
                {
                    name: `${filename.split('.').pop()} files`,
                    extensions: [`${filename.split('.').pop()}`],
                },
                {
                    name: "All Files",
                    extensions: ["*"],
                },
            ],
        });

        if (result !== null) {
            try {
                await window.__TAURI__.fs.writeBinaryFile(
                    result,
                    new Uint8Array([...text].map((c) => c.charCodeAt(0)))
                );
                showToast(Locale.Download.Success);
            } catch (error) {
                showToast(Locale.Download.Failed);
            }
        } else {
            showToast(Locale.Download.Failed);
        }
    } else {
        const element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(text),
        );
        element.setAttribute("download", filename);

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}

export function readFromFile() {
    return new Promise<string>((res, rej) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "application/json";

        fileInput.onchange = (event: any) => {
            const file = event.target.files[0];
            const fileReader = new FileReader();
            fileReader.onload = (e: any) => {
                res(e.target.result);
            };
            fileReader.onerror = (e) => rej(e);
            fileReader.readAsText(file);
        };

        fileInput.click();
    });
}

