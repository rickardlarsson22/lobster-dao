import sdk from "./1-initialize-sdk.js";

(async () => {
    try {

        const token = await sdk.getContract("0x6a83B4F1ce11EA19F30Aa6fb5b1B6EA302C24151", "token");

        const allRoles = await token.roles.getAll();

        console.log("Roles that exist right now: ", allRoles);

        await token.roles.setAll({ admin: [], minter: [] });
        console.log("Roles after revoking ourselves", await token.roles.getAll());

        console.log("Successfully revoked our superpowers");
    } catch (error) {
        console.error("Failed to revoke our superpowers");
    }
})();