import { IGameInfo } from "src/sharedTypes"
import { CheckersStargateClient } from "src/checkers_stargateclient"
import { QueryCanPlayMoveResponse } from "../generated/checkers/query"
import Long from "long"
import { storedToGameInfo } from "./board"


declare module "../../checkers_stargateclient" {
    interface CheckersStargateClient {
        getGuiGames(): Promise<IGameInfo[]>
        getGuiGame(index: string): Promise<IGameInfo | undefined>
        canPlayGuiMove(
            gameIndex: string,
            playerId: number,
            positions: number[][],
        ): Promise<QueryCanPlayMoveResponse>
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
