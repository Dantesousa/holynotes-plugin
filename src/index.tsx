/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { DataStore } from "@api/index";
import { ChannelToolbarButton } from "@api/HeaderBar";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import { classes } from "@utils/misc";
import { openModal } from "@utils/modal";
import definePlugin from "@utils/types";
import { ChannelStore, Menu } from "@webpack/common";
import type { Message } from "@vencord/discord-types";

import { Popover as NoteButtonPopover, Popover } from "./components/icons/NoteButton";
import { NoteModal } from "./components/modals/Notebook";
import noteHandler, { noteHandlerCache } from "./NoteHandler";
import { DataStoreToCache, PersonalPinsStore } from "./utils";

export default definePlugin({
    name: "PersonalPins",
    description: "Save messages locally as personal notes.",
    authors: [{
        name: "Dante",
        id: 289410692174823424n,
    }],
    dependencies: ["MessagePopoverAPI", "HeaderBarAPI"],

    messagePopoverButton: {
        icon: NoteButtonPopover,
        render(msg: Message) {
            return {
                label: "Pin Message",
                icon: NoteButtonPopover,
                message: msg,
                channel: ChannelStore.getChannel(msg.channel_id),
                onClick: () => noteHandler.addNote(msg, "Main")
            };
        }
    },

    headerBarButton: {
        icon: Popover,
        render: () => (
            <ErrorBoundary noop>
                <ChannelToolbarButton
                    icon={Popover}
                    tooltip="Personal Pins"
                    onClick={() => openModal(props => <NoteModal {...props} />)}
                />
            </ErrorBoundary>
        ),
        location: "channeltoolbar"
    },

    toolboxActions: {
        async "Open Pins"() {
            openModal(props => <NoteModal {...props} />);
        }
    },

    contextMenus: {
        "message": (children, { message }: { message: Message }) => {
            children.push(
                <Menu.MenuItem label="Pin Message To" id="add-message-to-note">
                    {Object.keys(noteHandler.getAllNotes()).map((notebook: string, index: number) => (
                        <Menu.MenuItem
                            label={notebook}
                            id={notebook}
                            action={() => noteHandler.addNote(message, notebook)}
                        />
                    ))}
                </Menu.MenuItem>
            );
        }
    },

    async start() {
        if (await DataStore.keys(PersonalPinsStore).then(keys => !keys.includes("Main")))
            return noteHandler.newNoteBook("Main");
        if (!noteHandlerCache.has("Main"))
            await DataStoreToCache();
    },

    async stop() {
        // cleanup is handled by the declarative fields
    }
});
