import { OfflineDirectSigner } from "@cosmjs/proto-signing"
import { expect } from "chai"
import { config } from "dotenv"
import _ from "../../environment"
import { CheckersSigningStargateClient } from "../../src/checkers_signingstargateclient"
import { CheckersExtension } from "../../src/modules/checkers/queries"

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

    let aliceClient: CheckersSigningStargateClient,
        bobClient: CheckersSigningStargateClient,
        checkers: CheckersExtension["checkers"]

    before("create signing clients", async function () {
        aliceClient = await CheckersSigningStargateClient.connectWithSigner(RPC_URL!, aliceSigner, {
            gasPrice: GasPrice.fromString("0stake"),
        })
        bobClient = await CheckersSigningStargateClient.connectWithSigner(RPC_URL!, bobSigner, {
            gasPrice: GasPrice.fromString("0stake"),
        })
        checkers = aliceClient.checkersQueryClient!.checkers
    })

    const aliceCredit = {
        stake: 100,
        token: 1,
    },
    bobCredit = {
        stake: 100,
        token: 1,
    }

    before("credit test accounts", async function () {
        this.timeout(40_000)
        if (
            parseInt((await aliceClient.getBalance(alice, "stake")).amount, 10) < aliceCredit.stake ||
            parseInt((await aliceClient.getBalance(alice, "token")).amount, 10) < aliceCredit.token
        )
            await askFaucet(alice, aliceCredit)
        expect(parseInt((await aliceClient.getBalance(alice, "stake")).amount, 10)).to.be.greaterThanOrEqual(
            aliceCredit.stake,
        )
        expect(parseInt((await aliceClient.getBalance(alice, "token")).amount, 10)).to.be.greaterThanOrEqual(
            aliceCredit.token,
        )
        if (
            parseInt((await bobClient.getBalance(bob, "stake")).amount, 10) < bobCredit.stake ||
            parseInt((await bobClient.getBalance(bob, "token")).amount, 10) < bobCredit.token
        )
            await askFaucet(bob, bobCredit)
        expect(parseInt((await bobClient.getBalance(bob, "stake")).amount, 10)).to.be.greaterThanOrEqual(
            bobCredit.stake,
        )
        expect(parseInt((await bobClient.getBalance(bob, "token")).amount, 10)).to.be.greaterThanOrEqual(
            bobCredit.token,
        )
    })

})