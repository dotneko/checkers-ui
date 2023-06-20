import { GeneratedType, OfflineSigner, Registry } from "@cosmjs/proto-signing"

import { 
    QueryClient, 
    StargateClient, 
    StargateClientOptions,
    defaultRegistryTypes
} from "@cosmjs/stargate"

import { Tendermint34Client } from "@cosmjs/tendermint-rpc"
import { CheckersExtension, setupCheckersExtension } from "./modules/checkers/queries"

import {
    checkersTypes,
} from "./types/checkers/messages"

export class CheckersStargateClient extends StargateClient {
    public readonly checkersQueryClient: CheckersExtension | undefined

    public static async connect(
        endpoint: string,
        options?: StargateClientOptions,
    ): Promise<CheckersStargateClient> {
        const tmClient = await Tendermint34Client.connect(endpoint)
        return new CheckersStargateClient(tmClient, options)
    }

    protected constructor(tmClient: Tendermint34Client | undefined, options: StargateClientOptions = {}) {
        super(tmClient, options)
        if (tmClient) {
            this.checkersQueryClient = QueryClient.withExtensions(tmClient, setupCheckersExtension)
        }
    }
}

export const checkersDefaultRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
    ...defaultRegistryTypes,
    ...checkersTypes,
]

function createDefaultRegistry(): Registry {
    return new Registry(checkersDefaultRegistryTypes)
}
