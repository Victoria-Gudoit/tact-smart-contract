import { toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = provider.open(await Counter.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await counter.send(
        provider.sender(),
        {
            value: toNano('0.2'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(counter.address);

    console.log('Counter value', await counter.getCounter());
    console.log('ID', await counter.getId());
    
    

    // run methods on `counter`
}

//EQAPrI6BgBTVTRrFV_R4UxLvMD98PFrfogdLOxqlXKTPg2xL