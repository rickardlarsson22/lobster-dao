import sdk from "./1-initialize-sdk.js";

(async () => {
    try {

        const editionDrop = await sdk.getContract("0x7ee024c570ACf872F26BE98f54ae8c654DECbBBF", "edition-drop");

        const token = await sdk.getContract("0x6a83B4F1ce11EA19F30Aa6fb5b1B6EA302C24151", "token");

        const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        console.log(walletAddresses);

        if (walletAddresses.length === 0) {
            console.log("No NFT has been claimed yet");
            process.exit(0);
        }

        const airdropTargets = walletAddresses.map((address) => {

            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("Going to airdrop", randomAmount, "tokens to", address);

            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            };

            return airdropTarget;
        });

        console.log("Starting airdrop...");
        await token.transferBatch(airdropTargets);
        console.log("Successfully airdropped");
    } catch (err) {
        console.error("Failed to airdrop", err);
    }
})();