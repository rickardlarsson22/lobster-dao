import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({

            name: "Voting system",
            
            voting_token_address: "0x6a83B4F1ce11EA19F30Aa6fb5b1B6EA302C24151",
            voting_delay_in_blocks: 0,
            voting_period_in_blocks: 6570,
            voting_quorum_fraction: 0,

            proposal_token_threshold: 0,
        }, {gasLimit: 250000});

        console.log("Successfully deployed vote contract, address:", voteContractAddress,);
    } catch (error) {
        console.error("Failed to deploy vote contract", error);
    }
})();