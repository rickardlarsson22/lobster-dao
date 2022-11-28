import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({

            name: "LobesterDao",

            description: "The DAO in open-sea",

            image: readFileSync("scripts/assets/lobster.png"),

            primary_sale_recipient: AddressZero,
            
        }, { gasLimit: 250000 });

        const editionDrop = await sdk.getContract(editionDropAddress, "edition-drop");

        const metadata = await editionDrop.metadata.get();

        console.log("Successfully deployed editionDrop contract, ", editionDropAddress,);
        console.log("EditionDrop metadata: ", metadata);
    } catch (error) {

        console.log("Failed to deploy editionDrop contract", error);
    }
})();