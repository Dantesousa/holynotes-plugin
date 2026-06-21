/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByProps } from "@webpack";

let _emptyClasses: Record<string, string> | undefined;
function getEmptyClasses(): Record<string, string> {
    if (_emptyClasses !== undefined) return _emptyClasses;
    try {
        _emptyClasses = findByProps("emptyResultsWrap") as Record<string, string>;
    } catch {
        _emptyClasses = {};
    }
    return _emptyClasses;
}
const cn = (name: string) => getEmptyClasses()?.[name] ?? "";

export default ({ error }: { error?: Error; } = {}) => {
    if (error) {
        // Error
        console.log(error);
        return (
            <div className={cn("emptyResultsWrap")}>
                <div className={cn("emptyResultsContent")} style={{ paddingBottom: "0px" }}>
                    <div className={cn("errorImage")} />
                    <div className={cn("emptyResultsText")}>
                        There was an error parsing your notes! The issue was logged in your console, press CTRL
                        + I to access it! Please visit the support server if you need extra help!
                    </div>
                </div>
            </div>
        );
    } else if (Math.floor(Math.random() * 100) <= 10)
        // Easter egg
        return (
            <div className={cn("emptyResultsWrap")}>
                <div className={cn("emptyResultsContent")} style={{ paddingBottom: "0px" }}>
                    <div className={`${cn("noResultsImage")} ${cn("alt")}`} />
                    <div className={cn("emptyResultsText")}>
                        No notes were found. Empathy banana is here for you.
                    </div>
                </div>
            </div>
        );
    // Empty notebook
    else
        return (
            <div className={cn("emptyResultsWrap")}>
                <div className={cn("emptyResultsContent")} style={{ paddingBottom: "0px" }}>
                    <div className={cn("noResultsImage")} />
                    <div className={cn("emptyResultsText")}>
                        No notes were found saved in this notebook.
                    </div>
                </div>
            </div>
        );
};
