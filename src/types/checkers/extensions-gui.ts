import { DeliverTxResponse } from "@cosmjs/stargate"
import { Log } from "@cosmjs/stargate/build/logs"

import { CheckersStargateClient } from "src/checkers_stargateclient"
import { CheckersSigningStargateClient } from "src/checkers_signingstargateclient"

import { IGameInfo } from "src/sharedTypes"
import { StoredGame } from "../generated/checkers/stored_game"
import { getCreatedGameId, getCreateGameEvent } from "./events"

import Long from "long"
import { storedToGameInfo } from "./board"


declare module "../../checkers_stargateclient" {
    interface CheckersStargateClient {
        getGuiGames(): Promise<IGameInfo[]>
        getGuiGame(index: string): Promise<IGameInfo | undefined>
    }
}

declare module "../../checkers_signingstargateclient" {
    interface CheckersSigningStargateClient {
        createGuiGame(creator: string, black: string, red: string): Promise<string>
    }
}


CheckersStargateClient.prototype.getGuiGames = async function (): Promise<IGameInfo[]> {
    return (
        await this.checkersQueryClient!.checkers.getAllStoredGames(
            Uint8Array.from([]),
            Long.ZERO,
            Long.fromNumber(20),
            true,
        )
    ).storedGames.map(storedToGameInfo)
}

CheckersStargateClient.prototype.getGuiGame = async function (index: string): Promise<IGameInfo | undefined> {
    const storedGame: StoredGame | undefined = await this.checkersQueryClient!.checkers.getStoredGame(index)
    if (!storedGame) return undefined
    return storedToGameInfo(storedGame)
}

CheckersSigningStargateClient.prototype.createGuiGame = async function (
    creator: string,
    black: string,
    red: string,
): Promise<string> {
    const result: DeliverTxResponse = await this.createGame(creator, black, red, "stake", Long.ZERO, "auto")
    const logs: Log[] = JSON.parse(result.rawLog!)
    return getCreatedGameId(getCreateGameEvent(logs[0])!)
}

