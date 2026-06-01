```
 ___________ _
  \/                    __/   .::::.-'-(/-/)
                     _/:  .::::.-' .-'\/\_`*******          __ (_))
        \/          /:  .::::./   -._-.  d\|               (_))_(__))
                     /: (""""/    '.  (__/||           (_))__(_))--(__))
                      \::).-'  -._  \/ \\/\|
              __ _ .-'`)/  '-'. . '. |  (i_O
          .-'      \       -'      '\|
     _ _./      .-'|       '.  (    \\                         % % %
  .-'   :      '_  \         '-'\  /|/      @ @ @             % % % %
 /      )\_      '- )_________.-|_/^\      @ @ @@@           % %\/% %
 (   .-'   )-._-:  /        \(/\'-._ `.     @|@@@@@            ..|........
  (   )  _//_/|:  /          `\()   `\_\     |/_@@             )'-._.-._.-
   ( (   \()^_/)_/             )/      \\    /                /   /
    )  _.-\\.\(_)__._.-'-.-'-.//_.-'-.-.)\-'/._              /
.-.-.-'   _o\ \\\     '::'   (o_ '-.-' |__\'-.-;~ ~ ~ ~ ~ ~~/   /\
          \ /  \\\__          )_\    .:::::::.-'\          '- - -|
     :::''':::::^)__\:::::::::::::::::'''''''-.  \                '- - -
    :::::::  '''''''''''   ''''''''''''':::. -'\  \
_____':::::_____________________________________\__\______________________
```

<h1 align="center">Unicorn Skills</h1>

<p align="center">
  <em>A Claude Code template that walks in with <strong>112 skills</strong>, <strong>27 commands</strong>, <strong>4 agents</strong>, and <strong>2 MCP servers</strong> already saddled up.</em>
</p>

<p align="center">
  <a href="#quick-start"><img alt="Quick start" src="https://img.shields.io/badge/quick%20start-2%20minutes-FF6B9E?style=flat-square"></a>
  <img alt="Skills" src="https://img.shields.io/badge/skills-112-7AB8FF?style=flat-square">
  <img alt="Commands" src="https://img.shields.io/badge/commands-27-FFB347?style=flat-square">
  <img alt="Agents" src="https://img.shields.io/badge/agents-4-C58BFF?style=flat-square">
</p>

---

A Claude Code starter pack for design agencies turning designers into design engineers. Clone, open, go.

**113 skills · 27 commands · 5 agents · 2 MCP servers** — all bundled. No setup required.

## Start here

You're a designer. You opened Claude Code. Now what?

Say **"hi"** to **🦄 Unicorn** — the studio lead.

Unicorn reads your PRD, asks how you want to work (*instructor* mode = explains every step, *operator* mode = just runs the workflow), and walks you through the project. Brief → design system → UI → polish → handoff. The specialist agents step in when needed.

You don't memorize 113 skill names. Unicorn knows them all.

## Quick start

**Use the template** (easiest)
Click *Use this template* on GitHub → clone → open in Claude Code. Done.

**Or clone directly**
```bash
git clone https://github.com/hulusi-tunc/unicorn-skills.git my-project
cd my-project && rm -rf .git && git init
```

**Optional: install marketplace plugins** (only for skill updates)
```bash
./setup.sh
```

**One-time per machine: Chrome DevTools MCP**
```bash
npm install -g chrome-devtools-mcp
```

## What's inside

```
.claude/
  agents/        5 agents — Unicorn leads, 4 specialists support
  skills/        113 skills (bundled, no install needed)
  commands/      27 slash commands
  settings.json  Plugins enabled
.mcp.json        Puppeteer + Chrome DevTools
CLAUDE.md        Full inventory for Claude
project/         Drop your PRD/WBS here (Unicorn reads them)
```

## The 5 agents

Talk naturally. The right one shows up.

| Agent | What it does |
|---|---|
| **🦄 unicorn** | Studio lead — talk to it first. Reads your brief, tracks stage, switches between *instructor* and *operator* mode |
| **designer-copilot** | Senior design partner — thinking, reviews, prototype iteration |
| **ui-designer** | Color, typography, grids, responsive, dark mode |
| **design-system-architect** | Tokens, components, theming |
| **design-reviewer** | Heuristic + accessibility checks |

> Extra specialists (ux-strategist, design-researcher, interaction-designer, design-ops-lead) live in `.claude/agents-archive/` — restore with `git mv` if a project needs deeper routing.

## The 113 skills, in 3 families

- **Designer (72)** — research, strategy, UI, interaction, prototyping, ops, Figma, frontend, shadcn/ui
- **Inclusive Design (37)** — cognitive a11y, keyboard nav, alt text, motion sensitivity, plain language
- **Engineering Quality (4)** — `emil-design-eng` for animation taste + 3 Vercel skills (web design guidelines, React perf, React Native perf)

Full inventory and per-cluster breakdown lives in [CLAUDE.md](CLAUDE.md).

## How skills pair

Designer skills build it. Inclusive skills make it work for everyone.

| Build with… | …then check with |
|---|---|
| `color-system` | `colour-independence` |
| `animation-principles` | `motion-sensitivity` |
| `user-persona` | `disability-inclusive-personas` |
| `component-spec` | `keyboard-navigation` |
| `typography-scale` | `flexible-typography` |

## MCP servers

- **Puppeteer** — navigate, click, screenshot any page
- **Chrome DevTools** — DOM, CSS, console, network, accessibility audits

Plus built-in **WebSearch** and **WebFetch**.

## Updating

**Edit the template** (in this repo)
```bash
git add -A && git commit -m "what you changed" && git push
```

**Pull updates into a project created from the template** — first time only:
```bash
git remote add template https://github.com/hulusi-tunc/unicorn-skills.git
git fetch template
git merge template/main --allow-unrelated-histories
```

After that: `git fetch template && git merge template/main`

## Credits

- Designer skills — [MC Dean](https://marieclairedean.substack.com/) · [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills)
- Inclusive design skills — [MC Dean](https://marieclairedean.substack.com/) · [Owl-Listener/inclusive-design-skills](https://github.com/Owl-Listener/inclusive-design-skills)
- `frontend-design` — [Anthropic](https://github.com/anthropics/claude-plugins-official)
- `shadcn-ui` — [Giuseppe Trisciuoglio](https://github.com/giuseppe-trisciuoglio/developer-kit)
- `emil-design-eng` — Emil Kowalski's animation philosophy
- Vercel engineering skills — snapshotted from the Vercel team's upstream guidance
