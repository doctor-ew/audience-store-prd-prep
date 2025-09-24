# Audience Store Acceptance Criteria

## Accounts
- [ ] A new user can sign up with username + password.
- [ ] Passwords are hashed before storage.
- [ ] A logged-in user can log out.

## Marketplace
- [ ] A user can create a product with title, description, price.
- [ ] Product appears in marketplace feed after creation.
- [ ] Product status flips to “sold” when purchased.

## Transactions
- [ ] Buyer’s credits decrease by price.
- [ ] Seller’s credits increase by price.
- [ ] Transaction is recorded with buyer_id, product_id, timestamp.

## Optional AI
- [ ] Claude/Gemini generates a witty description if requested.
- [ ] Generated text never contains PII or passwords.

## Deployment
- [ ] App runs locally via `pnpm dev`.
- [ ] App builds and runs in production mode.
- [ ] Deployed to Codespaces/Vercel with environment variables configured.
