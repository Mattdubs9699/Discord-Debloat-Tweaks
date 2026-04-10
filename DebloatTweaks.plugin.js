/**
 * @name DebloatTweaks
 * @author Tsunpot
 * @version 1.2.0
 * @description Hides selected Discord UI clutter with per-section slider toggles.
 */

module.exports = class DebloatTweaks {
    constructor() {
        this.defaultSettings = {
            hideActiveNow: true,
            hideServerUtilityRows: true,
            hideFriends: true,
            hideNitro: true,
            hideShop: true,
            hideQuests: true,
            hideDmDivider: true,
            hideBoostGoal: true,
            hideSpacer: true
        };

        this.settings = {};
        this.styleId = "DebloatTweaks";
        this.panelStyleId = "DebloatTweaks-Panel";
    }

    start() {
        this.loadSettings();
        this.applyStyles();
        this.applyPanelStyles();
    }

    stop() {
        BdApi.DOM.removeStyle(this.styleId);
        BdApi.DOM.removeStyle(this.panelStyleId);
    }

    loadSettings() {
        this.settings = Object.assign(
            {},
            this.defaultSettings,
            BdApi.Data.load("DebloatTweaks", "settings") || {}
        );
    }

    saveSettings() {
        BdApi.Data.save("DebloatTweaks", "settings", this.settings);
    }

    getSettingsPanel() {
        const panel = document.createElement("div");
        panel.className = "debloattweaks-panel";

        const title = document.createElement("div");
        title.className = "debloattweaks-title";
        title.textContent = "Debloat Tweaks";

        const subtitle = document.createElement("div");
        subtitle.className = "debloattweaks-subtitle";
        subtitle.textContent = "Toggle each UI section on or off.";

        panel.appendChild(title);
        panel.appendChild(subtitle);

        const items = [
            ["hideActiveNow", "Hide Active Now"],
            ["hideServerUtilityRows", "Hide Server Guide / utility rows"],
            ["hideFriends", "Hide Friends in Direct Messages"],
            ["hideNitro", "Hide Nitro in Direct Messages"],
            ["hideShop", "Hide Shop in Direct Messages"],
            ["hideQuests", "Hide Quests in Direct Messages"],
            ["hideDmDivider", "Hide Direct Messages divider"],
            ["hideBoostGoal", "Hide Boost Goal block"],
            ["hideSpacer", "Hide leftover 12px spacer"]
        ];

        for (const [key, label] of items) {
            panel.appendChild(this.createSwitch(key, label));
        }

        return panel;
    }

    createSwitch(key, labelText) {
        const row = document.createElement("div");
        row.className = "debloattweaks-row";

        const label = document.createElement("div");
        label.className = "debloattweaks-label";
        label.textContent = labelText;

        const switchLabel = document.createElement("label");
        switchLabel.className = "debloattweaks-switch";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = !!this.settings[key];

        const slider = document.createElement("span");
        slider.className = "debloattweaks-slider";

        input.addEventListener("change", () => {
            this.settings[key] = input.checked;
            this.saveSettings();
            this.applyStyles();
        });

        switchLabel.appendChild(input);
        switchLabel.appendChild(slider);

        row.appendChild(label);
        row.appendChild(switchLabel);

        return row;
    }

    applyPanelStyles() {
        const css = `
            .debloattweaks-panel {
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .debloattweaks-title {
                font-size: 20px;
                font-weight: 700;
                color: var(--header-primary);
                margin-bottom: 2px;
            }

            .debloattweaks-subtitle {
                font-size: 13px;
                color: var(--text-muted);
                margin-bottom: 10px;
            }

            .debloattweaks-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                padding: 12px 14px;
                border-radius: 10px;
                background: var(--background-secondary);
            }

            .debloattweaks-label {
                color: var(--header-primary);
                font-size: 14px;
                line-height: 1.3;
                flex: 1;
            }

            .debloattweaks-switch {
                position: relative;
                display: inline-block;
                width: 42px;
                height: 24px;
                flex: 0 0 auto;
            }

            .debloattweaks-switch input {
                opacity: 0;
                width: 0;
                height: 0;
                position: absolute;
            }

            .debloattweaks-slider {
                position: absolute;
                inset: 0;
                cursor: pointer;
                background-color: var(--background-tertiary);
                border-radius: 999px;
                transition: 0.2s ease;
            }

            .debloattweaks-slider::before {
                content: "";
                position: absolute;
                height: 18px;
                width: 18px;
                left: 3px;
                top: 3px;
                background-color: white;
                border-radius: 50%;
                transition: 0.2s ease;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
            }

            .debloattweaks-switch input:checked + .debloattweaks-slider {
                background-color: var(--brand-500, #5865f2);
            }

            .debloattweaks-switch input:checked + .debloattweaks-slider::before {
                transform: translateX(18px);
            }

            .debloattweaks-switch input:focus + .debloattweaks-slider {
                box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.25);
            }
        `;

        BdApi.DOM.removeStyle(this.panelStyleId);
        BdApi.DOM.addStyle(this.panelStyleId, css);
    }

    applyStyles() {
        const css = `
            ${this.settings.hideActiveNow ? `
            /* Hide Active Now */
            *[class^="nowPlayingColumn"] {
                display: none !important;
            }
            ` : ""}

            ${this.settings.hideServerUtilityRows ? `
            /* Hide Server Guide / server utility rows */
            .link__2ea32.basicChannelRowLink__2ea32:has(.name__2ea32[aria-hidden="true"]) {
                display: none !important;
            }
            ` : ""}

            ${this.settings.hideFriends ? `
            /* Hide Friends in Direct Messages */
            .friendsButtonContainer_e6b769,
            .friendsButtonContainer_e6b769 > .channel__972a0.container_e45859,
            .friendsButtonContainer_e6b769 .interactive_bf202d.interactive__972a0.linkButton__972a0,
            a.link__972a0[data-list-item-id$="___friends"][href="/channels/@me"] {
                display: none !important;
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                overflow: hidden !important;
            }
            ` : ""}

            ${this.settings.hideNitro ? `
            /* Hide Nitro in Direct Messages */
            div:has(> li > .interactive_bf202d.interactive__972a0.linkButton__972a0 > a.link__972a0[data-list-item-id$="___nitro"][href="/store"]),
            div[aria-posinset]:has(> li > .interactive_bf202d.interactive__972a0.linkButton__972a0 > a.link__972a0[data-list-item-id$="___nitro"][href="/store"]),
            li.channel__972a0.container_e45859:has(> .interactive_bf202d.interactive__972a0.linkButton__972a0 > a.link__972a0[data-list-item-id$="___nitro"][href="/store"]),
            .interactive_bf202d.interactive__972a0.linkButton__972a0:has(> a.link__972a0[data-list-item-id$="___nitro"][href="/store"]),
            a.link__972a0[data-list-item-id$="___nitro"][href="/store"] {
                display: none !important;
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                overflow: hidden !important;
            }
            ` : ""}

            ${this.settings.hideShop ? `
            /* Hide Shop in Direct Messages */
            li.channel__972a0.container_e45859:has(> .interactive_bf202d.interactive__972a0.linkButton__972a0 > a.link__972a0[data-list-item-id$="___shop"][href="/shop"]),
            .interactive_bf202d.interactive__972a0.linkButton__972a0:has(> a.link__972a0[data-list-item-id$="___shop"][href="/shop"]),
            a.link__972a0[data-list-item-id$="___shop"][href="/shop"] {
                display: none !important;
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                overflow: hidden !important;
            }
            ` : ""}

            ${this.settings.hideQuests ? `
            /* Hide Quests in Direct Messages */
            .wrapper__553bf,
            .wrapper__553bf > .channel__972a0.container_e45859,
            li.channel__972a0.container_e45859:has(> .interactive_bf202d.interactive__972a0.linkButton__972a0 > a.link__972a0[data-list-item-id$="___quests"][href="/quest-home"]),
            .interactive_bf202d.interactive__972a0.linkButton__972a0:has(> a.link__972a0[data-list-item-id$="___quests"][href="/quest-home"]),
            a.link__972a0[data-list-item-id$="___quests"][href="/quest-home"] {
                display: none !important;
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                overflow: hidden !important;
            }
            ` : ""}

            ${this.settings.hideDmDivider ? `
            /* Hide Direct Messages divider left behind */
            .sectionDivider_e6b769 {
                display: none !important;
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                overflow: hidden !important;
            }
            ` : ""}

            ${this.settings.hideBoostGoal ? `
            /* Hide Boost Goal block */
            .container__0d0f9.containerWithMargin__0d0f9:has(.boostCountText__0d0f9),
            .containerWithMargin__0d0f9:has(.boostCountText__0d0f9) {
                display: none !important;
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                overflow: hidden !important;
            }
            ` : ""}

            ${this.settings.hideSpacer ? `
            /* Hide leftover 12px spacer */
            div[style="height: 12px;"] {
                display: none !important;
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                overflow: hidden !important;
            }
            ` : ""}
        `;

        BdApi.DOM.removeStyle(this.styleId);
        BdApi.DOM.addStyle(this.styleId, css);
    }
};
