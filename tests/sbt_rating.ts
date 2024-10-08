import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, web3, utils } from "@coral-xyz/anchor";
import { assert } from "chai";
import { RatingSystem } from "../target/types/rating_system"; // Adjust path if necessary
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js"; // Import required Solana utilities

describe("rating-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RatingProgram as Program;

  // Create a Keypair for UserB (the rated user)
  const ratedUser = Keypair.generate();

  // PDA for the rating account
  let ratingAccountPDA: PublicKey;
  let bump: number;

  // Find PDA before running tests
  before(async () => {
    [ratingAccountPDA, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("rating"), ratedUser.publicKey.toBuffer()],
      program.programId
    );
  });

  it("UserA should set rating for UserB", async () => {
    const newRating = 5;

    // Call set_rating function
    await program.rpc.setRating(new anchor.BN(newRating), {
      accounts: {
        ratingAccount: ratingAccountPDA,
        rater: provider.wallet.publicKey, // UserA
        ratedUser: ratedUser.publicKey, // UserB (this is passed, but doesn't sign)
        systemProgram: SystemProgram.programId,
      },
      signers: [provider.wallet.payer], // UserA signs the transaction
    });

    // Fetch the rating account to verify
    const ratingAccount = await program.account.ratingAccount.fetch(
      ratingAccountPDA
    );

    // Assert the rating is set correctly for UserB
    assert.equal(
      ratingAccount.rating.toNumber(),
      newRating,
      "Rating should be set to 5"
    );
  });

  it("Should get the current rating for UserB", async () => {
    // Call get_rating function
    const ratingAccount = await program.account.ratingAccount.fetch(
      ratingAccountPDA
    );

    // Verify the rating is as expected
    const expectedRating = 5;
    assert.equal(
      ratingAccount.rating.toNumber(),
      expectedRating,
      "Rating should be 5"
    );
  });

  it("UserA should update the rating for UserB by adding a new value", async () => {
    const additionalRating = 3;

    // Call set_rating function again with a new value
    await program.rpc.setRating(new anchor.BN(additionalRating), {
      accounts: {
        ratingAccount: ratingAccountPDA,
        rater: provider.wallet.publicKey, // UserA
        ratedUser: ratedUser.publicKey, // UserB (this is passed, but doesn't sign)
        systemProgram: SystemProgram.programId,
      },
      signers: [provider.wallet.payer], // UserA signs the transaction
    });

    // Fetch the updated rating account
    const ratingAccount = await program.account.ratingAccount.fetch(
      ratingAccountPDA
    );

    // Verify that the new rating is added to the previous one
    const expectedTotalRating = 5 + 3;
    assert.equal(
      ratingAccount.rating.toNumber(),
      expectedTotalRating,
      "Total rating should be 8"
    );
  });
});
