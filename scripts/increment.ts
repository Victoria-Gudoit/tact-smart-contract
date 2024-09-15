import { Address, toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const address = Address.parse(args.length > 0 ? args[0] : await ui.input("Counter address")); //получаем адрес куда нам отправлять наше сообщение

    const counter = provider.open(Counter.fromAddress(address));

    const before = await counter.getCounter();

    await counter.send(
        provider.sender(),
        {
            value: toNano('0.2'),
        },
        {
            $$type: 'Add',
            queryId: 0n,
            amount: 1n,
        }
    );

    
let after = before;
let attempt = 1;
while(after === before) {
    ui.setActionPrompt(`Attempt ${attempt}`);

    try {
        after = await counter.getCounter();
    }
    catch (e) {
        console.log("Timeout, but okay");
        after = before;
    }

    attempt++;
    await new Promise(resolve => setTimeout(resolve, 2000) );
}

ui.clearActionPrompt();
ui.write('Counter increased successfully!');
    

    // run methods on `counter`
}

//EQAPrI6BgBTVTRrFV_R4UxLvMD98PFrfogdLOxqlXKTPg2xL