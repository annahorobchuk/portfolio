# CLI Theme — Case Study Database

Working folder for the portfolio case study about the OpenCode CLI theme developed in Figma ("CLI Library (Copy)"). Everything here was extracted EXACTLY (verbatim text, exact hex values, real node IDs) from the Figma file via the Figma MCP Plugin API on 2026-07-26. Nothing is approximated or summarized except where a file explicitly says so.

## The work being documented

Anna designed a complete OpenCode CLI theme ("my-theme.json"):
- A code-ready OpenCode theme file (dark + light), with color tokens aliased to the DataRobot design system library (midnight-gray, alpine-light, purple, supportive and data viz color ramps), typography on JetBrains Mono 14.
- A full CLI visual prototype in Figma (input bar, query bar, thought rows, markdown rendering, code blocks with syntax highlighting, tables, sidebar) built from 7 reusable components.
- 3 documented rounds of design iteration (UI backgrounds, fine-tuning of the primary/accent colors, syntax saturation reduction).
- Real terminal screenshots of the theme in use, plus an earlier marketing-brand-aligned exploration (Theme 2).

## Files

| File | Contents |
|---|---|
| data/theme.json | The SHIPPED deliverable: the actual json sent to Carson Gee (Slack DM, 2026-06-11) for the PR to datarobot-oss/datarobot-agent-skills. Includes defs + full "theme" role mapping. The Figma "Raw JSON" frame lags behind this version (see _themeJsonNote in figma-file-inventory.json). |
| data/figma-variables.json | All 32 Figma variables in 2 collections, with modes, scopes, and alias chains resolved to DataRobot library tokens and final hex values. |
| data/color-palette.json | The "Figma variables — Color Preview" palette exactly as displayed (24 dark + 20 light rows, order and numbering preserved). |
| data/change-log.json | "Design Change Log - my-theme.json": 3 rounds, verbatim, plus 2 designer annotations. |
| data/cli-demo-content.md | The full demo conversation shown in the CLI prototype (REST API explanation, python code blocks, HTTP methods table, sidebar and status bar strings), verbatim. |
| data/figma-file-inventory.json | Structural map of all 3 pages with node IDs, component structures, variant sets, plus a list of known inconsistencies between the JSON, the palette preview, the variables, and the change log. |
| assets/ | PNG exports for the case study. Not downloadable automatically; see assets/README-assets.md for the export list. |

## Data quality notes

- Hidden layers: 0 on the Theme.json page, 0 on the Components page. The internal-utilities page has 9 hidden layers, all inside internal ds-* helper components; they were never captured into this database.
- The light palette grid contains 6 swatch instances with emptied text slots (placeholders, not hidden layers); see color-palette.json notes.
- See "knownInconsistencies" in figma-file-inventory.json before publishing numbers in the case study: theme.json and the palette preview disagree on a few tokens (darkCyan, darkPink/darkTurquoise, darkSyntaxYellow, SyntaxOrangeMuted).

## Future task

Build a portfolio website "case study" page about this work, using this folder as the single source of truth.
