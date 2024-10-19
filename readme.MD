# SBT Ratings

## DESCRIPTION:

SBT Ratings is a decentralized rating system built on Solana using Anchor framework. It allows users to rate others in a non-transferable, immutable manner, resembling Soulbound Tokens (SBTs).

## FEATURES:

- **Rate Users**: Allows one user to rate another user and store this rating on-chain.
- **Cumulative Ratings**: Updates a user’s rating cumulatively with each new rating provided.
- **Fetch Ratings**: Retrieve the current rating for any user.
- **Account Initialization**: Automatically initializes rating accounts for users when they are rated for the first time.

## REQUIREMENTS:

---

- Rust & Cargo (for Solana program development)
- Solana CLI tools
- Anchor framework

## SETUP:

---

1. **Install Solana CLI**: [Solana CLI Installation Guide](https://docs.solana.com/cli/install-solana-cli-tools)
2. **Install Anchor**: [Anchor Installation Guide](https://book.anchor-lang.com/getting_started/installation.html)
3. **Configure Solana for Devnet**:
   ```bash
   solana config set --url https://api.devnet.solana.com
   ```
