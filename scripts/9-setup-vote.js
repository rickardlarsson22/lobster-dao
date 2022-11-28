import sdk from "./1-initialize-sdk.js";

(async () => {
    try {

        const vote = await sdk.getContract("0x77699361063383addBb78a0870B88c7bB1d6cdF3", "vote");
        const token = await sdk.getContract("0x6a83B4F1ce11EA19F30Aa6fb5b1B6EA302C24151", "token");

        await token.roles.grant("minter", vote.getAddress());

        console.log("Successfully gave vote contract permissions to act on token contract")
    } catch (error) {
        console.error("Failed to grant vote contract permissions on token contract", error);

        process.exit(1);
    }

    try {

        const vote = await sdk.getContract("0x77699361063383addBb78a0870B88c7bB1d6cdF3", "vote");
        const token = await sdk.getContract("0x6a83B4F1ce11EA19F30Aa6fb5b1B6EA302C24151", "token");

        const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);

        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90;

        await token.transfer(vote.getAddress(), percent90);

        console.log("Successfully transferred " + percent90 + " tokens to vote contract");
    } catch (error) {
        console.error("Failed to transfer token to vote contract", error);
    }
})();