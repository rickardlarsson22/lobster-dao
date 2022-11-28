import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

(async () => {
    try {
        const editionDrop = await sdk.getContract("0x7ee024c570ACf872F26BE98f54ae8c654DECbBBF", "edition-drop");

        const claimConditions = [{

            startTime: new Date(),
            maxClaimable: 50_000,
            price: 0,
            maxClaimablePerWallet: 1,
            waitInSeconds: MaxUint256,
        }]

        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("Successfully set claim condition");
    } catch (error) {
        console.error("Failed to set claim condition", error);
    }
})();