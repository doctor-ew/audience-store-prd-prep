# AI Coding Guardrails

- Do not add dependencies without explicit approval.
- No secrets or API keys in code. Use process.env + `.env.example`.
- Passwords: always hashed, never plaintext.
- DB changes must be done with migrations (Prisma migrate).
- Write tests for each API route (Vitest).
- Use diff-only output when editing files.
- If spec and PRD conflict, stop and ask.
Guard