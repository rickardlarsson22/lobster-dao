import sdk from "./1-initialize-sdk.js";

(async () => {
    try {

        const token = await sdk.getContract("0x6a83B4F1ce11EA19F30Aa6fb5b1B6EA302C24151", "token");

        const amount = 1_000_000;

        await token.mint(amount);
        const totalSupply = await token.totalSupply();

        console.log("There now is", totalSupply.displayValue, "$LOB in circulation");   
    } catch (error) {
        console.log("Failed to print circulating supply");
    }
})();