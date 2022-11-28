import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
    try {

        const tokenAddress = await sdk.deployer.deployToken({

            name: "LobsterDAO Governance Token",
            symbol: "LOB",
            primary_sale_recipient: AddressZero,
        }, {gasLimit: 250000});
        console.log("Successfully deployed token contract, address: ", tokenAddress,);
    } catch (error) {
        console.error("Failed to deploy token contract", error);
    }
})();