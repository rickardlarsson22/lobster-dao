import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try {
        const editionDrop = await sdk.getContract("0x7ee024c570ACf872F26BE98f54ae8c654DECbBBF", "edition-drop");
        await editionDrop.createBatch([
            {
                name: "Octopus pass",
                description: "This nft will give you acces to LobsterDAO",
                imgae: readFileSync("scripts/assets/octopus_PNG3.webp"),
            },
        ]);
        console.log("Successfully created a new NFT in the drop");
    } catch (error) {
        console.error("Failed to create new NFT", error);
    }
})();