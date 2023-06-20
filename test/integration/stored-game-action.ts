import { OfflineDirectSigner } from "@cosmjs/proto-signing"
import { expect } from "chai"
import { config } from "dotenv"
import _ from "../../environment"
import { getSignerFromMnemonic } from "../../src/util/signer"


config()

describe("StoredGame Action", function () {
    const { RPC_URL, ADDRESS_TEST_ALICE: alice, ADDRESS_TEST_BOB: bob } = process.env
    let aliceSigner: OfflineDirectSigner, bobSigner: OfflineDirectSigner

    before("create signers", async function () {
        aliceSigner = await getSignerFromMnemonic(process.env.MNEMONIC_TEST_ALICE)
        bobSigner = await getSignerFromMnemonic(process.env.MNEMONIC_TEST_BOB)
        expect((await aliceSigner.getAccounts())[0].address).to.equal(alice)
        expect((await bobSigner.getAccounts())[0].address).to.equal(bob)
    })
    it("runs", async function () {
    })
})