import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

(async () => {
    try {

        const vote = await sdk.getContract("0x77699361063383addBb78a0870B88c7bB1d6cdF3", "vote");
        const token = await sdk.getContract("0x6a83B4F1ce11EA19F30Aa6fb5b1B6EA302C24151", "token");

        const amount = 50_000;
        const description = "Should the DAO mint an additional " + amount + " tokens into the treasury";
        const executions = [
            {
                toAddress: token.getAddress(),
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    "mintTo", [
                        vote.getAddress(),
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
            }
        ];

        await vote.propose(description, executions);

        console.log("Successfully created proposal to increase treasury");
    } catch (error) {
        console.error("Failed to create proposal");
    }

    try {

        const vote = await sdk.getContract("0x77699361063383addBb78a0870B88c7bB1d6cdF3", "vote");
        const token = await sdk.getContract("0x6a83B4F1ce11EA19F30Aa6fb5b1B6EA302C24151", "token");

        const amount = 5_000;
        const description = "Should the DAO transfer " + amount + " tokens from treasury to " + process.env.WALLET_ADDRESS + " just because?";
        const executions = [
            {
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    "transfer",
                    [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
                toAddress: token.getAddress(),
            },
        ];

        await vote.propose(description, executions);

        console.log("Successfully created proposal to reward user just because");
    } catch (error) {
        console.error("Failed to create proposal", error);
    }
})();