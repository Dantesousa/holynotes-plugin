/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Embed, MessageReaction } from "discord-types/general";

export declare namespace Discord {
    export interface Sticker {
        format_type: number;
        id: string;
        name: string;
    }

    export interface Attachment {
        id: string;
        filename: string;
        description?: string;
        content_type?: string;
        size: number;
        url: string;
        proxy_url: string;
        height?: number;
        width?: number;
        ephemeral?: boolean;
        duration_secs?: number;
        waveform?: string;
        flavor?: string;
        sensitive?: boolean;
    }

    export interface Reaction extends MessageReaction {
        burst_colors: string[];
        borst_count: number;
        count_details: { burst: number; normal: number; };
        me_burst: boolean;
    }
}

export declare namespace HolyNotes {
    export interface Note {
        id: string;
        channel_id: string;
        guild_id: string;
        content: string;
        author: {
            id: string;
            avatar: string;
            discriminator: string;
            username: string;
        };
        flags: number;
        timestamp: string;
        attachments: Discord.Attachment[];
        embeds: Embed[];
        reactions: Discord.Reaction[];
        stickerItems: Discord.Sticker[];
    }
}
