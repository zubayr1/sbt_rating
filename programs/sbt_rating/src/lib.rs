use anchor_lang::prelude::*;

declare_id!("J7Z69XPB9JDFRMcQKUxg5aUq8gAtJo2upbX8V8h8RaVh");

#[account]
pub struct RatingAccount {
    pub authority: Pubkey, // The user who is being rated (UserB)
    pub rating: u64,       // The rating value
}

#[program]
pub mod rating_program {
    use super::*;

    // Function to set or update the rating
    pub fn set_rating(ctx: Context<SetRating>, new_rating: u64) -> Result<()> {
        let rating_account = &mut ctx.accounts.rating_account;

        // If this is the first rating, set the value
        if rating_account.rating == 0 {
            rating_account.rating = new_rating;
        } else {
            // Otherwise, update the rating by adding the new value
            rating_account.rating += new_rating;
        }

        rating_account.authority = *ctx.accounts.rated_user.key;
        Ok(())
    }

    // Function to get the current rating
    pub fn get_rating(ctx: Context<GetRating>) -> Result<u64> {
        let rating_account = &ctx.accounts.rating_account;
        Ok(rating_account.rating)
    }
}

// SetRating context
#[derive(Accounts)]
pub struct SetRating<'info> {
    #[account(init_if_needed, payer = rater, space = 8 + 32 + 8, seeds = [b"rating".as_ref(), rated_user.key().as_ref()], bump)]
    pub rating_account: Account<'info, RatingAccount>, // Rating account for UserB
    #[account(mut)]
    pub rater: Signer<'info>, // The user who is giving the rating (UserA)

    /// CHECK: This account is safe because it's the public key of the user being rated (UserB)
    pub rated_user: AccountInfo<'info>, // The user being rated (UserB)

    pub system_program: Program<'info, System>,
}

// GetRating context
#[derive(Accounts)]
pub struct GetRating<'info> {
    #[account(seeds = [b"rating".as_ref(), rated_user.key().as_ref()], bump)]
    pub rating_account: Account<'info, RatingAccount>, // Rating account for UserB

    /// CHECK: This account is safe because it's the public key of the user being rated (UserB)
    pub rated_user: AccountInfo<'info>, // The user being rated (UserB)
}
