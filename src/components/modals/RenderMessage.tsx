/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { classes } from "@utils/misc";
import { copyToClipboard } from "@utils/clipboard";
import { ModalProps } from "@utils/modal";
import { findByCode, findComponentByCode } from "@webpack";
import { ContextMenuApi, FluxDispatcher, Menu, NavigationRouter, React } from "@webpack/common";

import noteHandler from "../../NoteHandler";
import { HolyNotes } from "../../types";


let ChannelMessage: any;
function getChannelMessage() {
    if (ChannelMessage !== undefined) return ChannelMessage;
    try {
        // Tenta múltiplos seletores
        ChannelMessage = findComponentByCode("Message must not be a thread");
        if (!ChannelMessage) ChannelMessage = findComponentByCode("isSystemDM");
        if (!ChannelMessage) ChannelMessage = findComponentByCode("cozyMessage");
    } catch { ChannelMessage = null; }
    console.log("[PersonalPins] ChannelMessage found:", !!ChannelMessage);
    return ChannelMessage;
}

let messageClassesCache: { message: string, groupStart: string, cozyMessage: string } | undefined;
function getMessageClasses() {
    if (messageClassesCache !== undefined) return messageClassesCache;
    try {
        const m = findByCode("cozyMessage");
        messageClassesCache = {
            message: m?.message ?? "",
            groupStart: m?.groupStart ?? "",
            cozyMessage: m?.cozyMessage ?? "",
        };
    } catch {
        messageClassesCache = { message: "", groupStart: "", cozyMessage: "" };
    }
    return messageClassesCache;
}

let UserCtor: any;
function getUserCtor() {
    if (UserCtor !== undefined) return UserCtor;
    try {
        // Tenta múltiplos seletores para User
        UserCtor = findByCode("isClyde(){");
        if (!UserCtor) UserCtor = findByCode("discriminator:");
        if (!UserCtor) UserCtor = findByCode("UserStore");
    } catch { UserCtor = null; }
    console.log("[PersonalPins] UserCtor found:", !!UserCtor);
    return UserCtor;
}

let MessageCtor: any;
function getMessageCtor() {
    if (MessageCtor !== undefined) return MessageCtor;
    try {
        MessageCtor = findByCode("isEdited(){");;
    } catch { MessageCtor = null; }
    return MessageCtor;
}

let ChannelCtor: any;
function getChannelCtor() {
    if (ChannelCtor !== undefined) return ChannelCtor;
    try {
        ChannelCtor = findByCode("computeLurkerPermissionsAllowList");
    } catch { ChannelCtor = null; }
    return ChannelCtor;
}

export const RenderMessage = ({
    note,
    notebook,
    updateParent,
    fromDeleteModal,
    closeModal,
}: {
    note: HolyNotes.Note;
    notebook: string;
    updateParent?: () => void;
    fromDeleteModal: boolean;
    closeModal?: () => void;
}) => {
    const [isHoldingDelete, setHoldingDelete] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        const deleteHandler = (e: { key: string; type: string; }) =>
            e.key.toLowerCase() === "delete" && setHoldingDelete(e.type.toLowerCase() === "keydown");

        document.addEventListener("keydown", deleteHandler);
        document.addEventListener("keyup", deleteHandler);

        return () => {
            document.removeEventListener("keydown", deleteHandler);
            document.removeEventListener("keyup", deleteHandler);
        };
    }, []);

    const isDeleteMode = isHoldingDelete && !fromDeleteModal;

    return (
        <div
            className="vc-holy-note"
            style={{
                marginBottom: "8px",
                marginTop: "8px",
                paddingTop: "8px",
                paddingBottom: "8px",
                paddingLeft: "12px",
                paddingRight: "12px",
                borderRadius: "8px",
                backgroundColor: isDeleteMode
                    ? "rgba(239, 68, 68, 0.15)"  // Vermelho quando em modo delete
                    : isHovered
                        ? "var(--background-modifier-hover)"
                        : "var(--background-secondary)",
                border: isDeleteMode
                    ? "2px solid rgba(239, 68, 68, 0.6)"
                    : isHovered
                        ? "2px solid var(--text-muted)"
                        : "2px solid transparent",
                transition: "all 0.2s ease",
                cursor: isDeleteMode ? "pointer" : "default",
                position: "relative",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
                if (isDeleteMode) {
                    noteHandler.deleteNote(note.id, notebook);
                    updateParent?.();
                }
            }}
            onContextMenu={(event: any) => {
                if (!fromDeleteModal)
                    // @ts-ignore
                    return ContextMenuApi.openContextMenu(event, (props: any) => (
                        // @ts-ignore
                        <NoteContextMenu
                            {...Object.assign({}, props, { onClose: props.onClose })}
                            note={note}
                            notebook={notebook}
                            updateParent={updateParent}
                            closeModal={closeModal}
                        />
                    ));
            }}
        >
            {/* Badge de delete mode */}
            {isDeleteMode && (
                <div
                    style={{
                        position: "absolute",
                        top: "-8px",
                        right: "12px",
                        backgroundColor: "rgba(239, 68, 68, 0.95)",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        zIndex: 10,
                    }}
                >
                    🗑️ Pressione DELETE
                </div>
            )}

            {/* Renderização customizada para mostrar attachments */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* Autor e Timestamp */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img
                        src={`https://cdn.discordapp.com/avatars/${note.author.id}/${note.author.avatar}.png`}
                        alt={note.author.username}
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: isDeleteMode ? "2px solid rgba(239, 68, 68, 0.8)" : "none",
                        }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                            style={{
                                fontWeight: "bold",
                                color: isDeleteMode ? "#ef4444" : "#ffffff",  // Branco puro no modo normal
                                fontSize: "14px",
                                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                            }}
                        >
                            {note.author.username}
                        </span>
                        <span
                            style={{
                                color: isDeleteMode ? "#fca5a5" : "#b9bbbe",  // Cinza claro no modo normal
                                fontSize: "11px",
                                textShadow: "0 1px 1px rgba(0,0,0,0.2)",
                            }}
                        >
                            {new Date(note.timestamp).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Conteúdo da mensagem */}
                {note.content && (
                    <div
                        style={{
                            color: isDeleteMode ? "#fca5a5" : "#dcddde",  // Cinza muito claro no modo normal
                            whiteSpace: "pre-wrap",
                            fontSize: "14px",
                            lineHeight: "1.4",
                            textShadow: "0 1px 1px rgba(0,0,0,0.2)",
                        }}
                    >
                        {note.content}
                    </div>
                )}

                {/* Attachments (imagens) */}
                {note.attachments && note.attachments.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                        {note.attachments.map((att, idx) => {
                            // Verifica se é uma imagem
                            if (att.content_type?.startsWith('image/') || att.url?.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i)) {
                                return (
                                    <div
                                        key={att.id || idx}
                                        style={{
                                            position: "relative",
                                            borderRadius: "4px",
                                            overflow: "hidden",
                                            border: isDeleteMode
                                                ? "3px solid rgba(239, 68, 68, 0.8)"
                                                : "none",
                                            transition: "border 0.2s ease",
                                        }}
                                    >
                                        <a
                                            href={att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img
                                                src={att.proxy_url || att.url}
                                                alt={att.filename}
                                                style={{
                                                    maxWidth: "400px",
                                                    maxHeight: "300px",
                                                    borderRadius: "4px",
                                                    cursor: isDeleteMode ? "pointer" : "pointer",
                                                    objectFit: "cover",
                                                    filter: isDeleteMode ? "brightness(0.7)" : "none",
                                                    transition: "filter 0.2s ease",
                                                }}
                                                loading="lazy"
                                            />
                                        </a>
                                        {/* Overlay de delete na imagem */}
                                        {isDeleteMode && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    backgroundColor: "rgba(0,0,0,0.3)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "white",
                                                    fontSize: "32px",
                                                    fontWeight: "bold",
                                                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                                                }}
                                            >
                                                🗑️
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // Outros tipos de attachment
                            return (
                                <div
                                    key={att.id || idx}
                                    style={{
                                        padding: "8px",
                                        backgroundColor: isDeleteMode
                                            ? "rgba(239, 68, 68, 0.1)"
                                            : "rgba(0,0,0,0.3)",  // Fundo mais escuro para contraste
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        maxWidth: "400px",
                                        border: isDeleteMode
                                            ? "2px solid rgba(239, 68, 68, 0.6)"
                                            : "1px solid rgba(255,255,255,0.1)",  // Borda sutil
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <span style={{ color: "#b9bbbe" }}>📎</span>
                                    <a
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: isDeleteMode
                                                ? "#fca5a5"
                                                : "#00b0f4",  // Azul Discord no modo normal
                                            textDecoration: "none",
                                            fontWeight: isDeleteMode ? "bold" : "normal",
                                            textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {att.filename}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const NoteContextMenu = (
    props: ModalProps & {
        updateParent?: () => void;
        notebook: string;
        note: HolyNotes.Note;
        closeModal?: () => void;
    }) => {
    const { note, notebook, updateParent, closeModal } = props;

    return (
        <Menu.Menu
            navId="holynotes"
            onClose={() => FluxDispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" })}
            aria-label="Holy Notes"
        >
            <Menu.MenuItem
                label="Jump To Message"
                id="jump"
                action={() => {
                    NavigationRouter.transitionTo(`/channels/${note.guild_id ?? "@me"}/${note.channel_id}/${note.id}`);
                    closeModal?.();
                }}
            />
            <Menu.MenuItem
                label="Copy Text"
                id="copy-text"
                action={() => copyToClipboard(note.content)}
            />
            {note?.attachments.length ? (
                <Menu.MenuItem
                    label="Copy Attachment URL"
                    id="copy-url"
                    action={() => copyToClipboard(note.attachments[0].url)}
                />) : null}
            <Menu.MenuItem
                color="danger"
                label="Delete Note"
                id="delete"
                action={() => {
                    noteHandler.deleteNote(note.id, notebook);
                    updateParent?.();
                }}
            />
            {Object.keys(noteHandler.getAllNotes()).length !== 1 ? (
                <Menu.MenuItem
                    label="Move Note"
                    id="move-note"
                >
                    {Object.keys(noteHandler.getAllNotes()).map((key: string) => {
                        if (key !== notebook) {
                            return (
                                <Menu.MenuItem
                                    label={`Move to ${key}`}
                                    id={key}
                                    action={() => {
                                        noteHandler.moveNote(note, notebook, key);
                                        updateParent?.();
                                    }}
                                />
                            );
                        }
                    })}
                </Menu.MenuItem>
            ) : null}
            <Menu.MenuItem
                label="Copy ID"
                id="copy-id"
                action={() => copyToClipboard(note.id)}
            />
        </Menu.Menu>
    );

};
