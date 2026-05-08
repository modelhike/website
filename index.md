# ModelHike — Site Copy v1

Companion markdown for `index.html` (same basename: one `.html`, one `.md` per page).
Faithful mirror of the live page. Section numbers follow top-to-bottom order.
Update this file whenever `index.html` copy changes.

**Brand stack reference**

- Category: Intent compiler
- Slogan: Diff the Intent, not the Code
- Hero: AI is stealing your time. Diff the Intent, not the Code.
- Technical positioning: Intent-native, not prompt-guessed
- Manifestos in use:
  - *Code is downstream now.*
  - *ModelHike is Intent-native. Not prompt-guessed.*
  - *Source intent is the new source code.*

---

## 1. Hero

> AI is stealing your time.

# Diff the Intent, not the Code.

ModelHike is the intent compiler for the AI era. Spec-driven development has the right intent, but the wrong implementation.

`$ npx modelhike demo` · `▶ Watch it work`

**Hero terminal (live demo stream):**

```
$ npx modelhike demo
→ reading booking.modelhike   ·  18 lines
→ resolving types             ·  Booking, User, Reservation
→ compiling intent            ·  blueprint = nestjs
✓ emitted 142 files           ·  deterministic hash 7af3·c910·ee01
✓ bootstrapping api on :3000
ready in 0.84s              
```

---

## 2. The Law — Rethink the workflow

> Rethink the workflow

### Stop staring at the source code.

Code is abundant now. Human attention isn't. Shrink the review surface.

**Source code is evidence, not the decision.**
The generated source only proves a decision was made. The decision itself — the intent — is what matters and what should be reviewed.

**Clear thinking matters more.**
Faster agents don't remove the need for thinking — they raise the cost of unclear thinking. Vague intent compounds into broken code at scale.

**Move the source of truth up.**
Declare the why. Let the compiler emit the what. Code stays where it belongs — underneath.

> Human attention is the scarce resource now.
> **Code is downstream now.**

---

## 3. The Move — How it works

> How it works

### Diff the why. Not the what.

You write twenty lines. ModelHike compiles five hundred files, within a second. You diff why you wrote — not what fell out.

**Source — `booking.modelhike` (declaration, 18 lines · the why):**

```
Booking
==========
** id      : ID
*  user    : Reference@User
-  status  : String
*  total   : Decimal

~ cancel(id: Int) : String
|> DB Booking WHERE b -> b.id == id
|> IF b.status == "confirmed"
|   UPDATE b.status = "cancelled"
|   return "cancelled"

@ apis:: create, cancel, list
```

**Output — `booking-service/` (file tree, 142 files · the what · 0.84s · deterministic · reproducible):**

A NestJS monorepo with `apps/api/src/{booking,user}/…`, DTOs, guards, pipes, `libs/database/`, migrations, e2e tests, and config. The `booking/` subtree (module, controller, service, repository, entity) is tagged **+ from intent**.

The why is yours. The what is automatic.

---

## 4. The spec-driven trap

> The spec-driven trap

### Spec-driven has the right intent and the wrong implementation.

Every other AI coding tool is intent-guessed. Prose in. LLM guess out. Different every time. **Three flaws, compounding.**

**The spec is English. English is ambiguous.**
Natural language leaves room for interpretation. If implementation details are still debatable, the foundation is already weak.

**The AI is non-deterministic. The output drifts every run.**
Same prompt, same spec, same model. Two different code. Two different bugs.

**The human is in the loop. The loop is the bottleneck.**
Spec-driven puts a human in front of every generated diff. Five hundred files of AI output, reviewed line by line, by an exhausted senior at 4:47pm Friday.

*[Visual: confused robot beside broken generated documents — `assets/images/problem.png`]*

---

## 5. The Answer — Intent-Native Development

> The Answer

### Intent-Native Development

ModelHike fixes all three, by moving up from source code to source intent.<br />
**Built for AI Agents:** 100% deterministic, zero hallucinations.

**Declaration, not prose.**
Stop describing your app in English and hoping AI interprets it correctly. Define your system architecture, APIs, and data models precisely in a unified DSL.

**Compilation, not generation.**
Same declaration twice produces the same code. Forever. Auditable. Reproducible. Shippable. No drift, no surprises.

**Review at source intent.**
You diff 20 lines of why, not 500 files of what. The loop tightens to where review is cheap.

**AI in the Loop.**
AI in your editor authors and refines the declaration. The transpiler handles the rest — grounded, repeatable, and reviewable.

*[Visual: deterministic compiler producing structured outputs — `assets/images/solution_punchy.png`]*

> **ModelHike is Intent-native. Not prompt-guessed.**

---

## 6. Intent-native — Prompts guess. Compilers don't.

> Intent-native

### Prompts guess. Compilers don't.

```diff
- Prompt the same AI twice.
  Get two different codebases. Ship both. Get two different bugs.

+ Compile the same intent twice.
  Get the same code. Forever.
```

That's not a tooling preference. It's the line between *hoping* and *shipping*.

> **ModelHike is Intent-native. Not prompt-guessed.**

---

## 7. Still the developer

> You stay a developer

### Still the developer. Just not the typist.

The craft doesn't go away. The keystrokes do. Here's the shift.

**What you keep**

- You still **design**.
- You still **hit flow**.
- You still **ship at 4pm**.
- You own the **source intent**, not just the source code.

**What you stop**

- You stop **typing** what the machine can type.
- You stop **reviewing** generated code line by line.
- You stop **losing** intent into source code.

> **Source intent is the new source code.**

---

## 8. The output is yours

> No lock-in

### The output is yours. Always.

ModelHike creates a codebase, not a cage. Engineers stay in full control.

**Edit the output directly.**
The output is clean, idiomatic source code — not a generated artifact you're afraid to touch.

**Let AI close the loop.**
Use the ModelHike MCP or Skill in your editor to reverse-engineer changes back into the declaration — so the next transpile reflects your intent.

**Evolve the system over time.**
Declaration, blueprint, and output stay in sync — not by locking you in, but by giving you the tools to keep them aligned.

```bash
# 1. Transpile the declaration
modelhike generate --input app.modelhike \
  --blueprint api-nestjs-monorepo \
  --output ./src

# 2. Edit the output directly
code ./src/orders/orders.service.ts

# 3. In your AI editor, prompt:
> "Update the ModelHike declaration and blueprint
   (if needed) to reflect the changes I made in
   orders.service.ts"
```

---

## 9. Get started

> Get started

### Command to running backend.
### Thirty seconds. Fully Local.

```
$ npx modelhike demo
```

`[ GitHub ]` `[ Docs ]`

---

## 10. FAQ — Questions developers ask

> FAQ

### Questions developers ask.

**Isn't this just MDA / UML repackaged?**

UML and MDA promised something similar — declare a model, generate the code. It failed because humans had to author the model by hand, and that was slower than just writing the code. The overhead killed adoption.

ModelHike flips that: AI authors the declaration for you. The labor problem is gone. What remains is determinism — same input, same output, every time — and that's the part that actually ships.

**How is this different from spec-driven dev?**

Specs describe. Declarations compile. Same input twice in spec-driven gets you two codebases. Same input twice in ModelHike gets you the same code. Forever.

**What about agent frameworks like LangGraph?**

Different layer. Agent frameworks help the AI act. ModelHike makes the AI's output deterministic. Use both.

**What if I want to edit the generated code?**

Edit it. Then tell your AI editor to pull the change back into the declaration through the MCP. The declaration stays the source of truth. The code stays editable. Both stay in sync.

**Is the DSL hard to learn?**

If you've written a schema or a route definition, you know 80% of it. Most developers are fluent in an afternoon.

**What languages and frameworks does it support?**

NestJS and Spring Boot monorepos today. More blueprints shipping. The DSL is target-agnostic by design.


---

## 11. Closing CTA

### Ready to escape code review hell?

Declare the app once. Let ModelHike transpile clean, pro-grade source code.

`[ View on GitHub ]`

---

## 12. Footer

**ModelHike**
*Diff the Intent, not the Code.*
The intent compiler.

**Product** — How it works · vs. spec-driven · Install · Docs
**Resources** — GitHub · llms.txt · llms-full.txt
**Project** — Manifesto

© 2026 ModelHike · *compiled, not guessed.*

---

## Changelog

- **v1** — Baseline: faithful mirror of `index.html`. Companion file uses the same basename (`index.md`). Includes Intent-Native Development (four fixes), spec-driven trap, hero terminal, CTA band, footer nav, and six FAQ items.
