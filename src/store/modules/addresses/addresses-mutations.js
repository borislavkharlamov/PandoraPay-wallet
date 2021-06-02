import Vue from "vue";

export default {

    setAddresses( context, value){
        context.list = value;
    },

    setAddressTxCounts(context, {account, txCount = 0, txCountPending = 0, clear = false }){

        const address = { ... context.list[account]  };

        if (!clear){
            txCount += address.txCount || 0;
            txCountPending += address.txCountPending || 0;
        }

        address.txCount = txCount;
        address.txCountPending = txCountPending;

        Vue.set(context.list, account, address );

    },

    setAddressPendingTxs(context, {account, txs, next, clear = true}){

        const address = { ... context.list[account]  };

        if (!address.pendingTxs) address.pendingTxs = {};

        if (clear === true)
            address.pendingTxs = {};

        for (const key in txs)
            address.pendingTxs[key] = key;

        if (next !== undefined)
            address.pendingTxsNext = next;

        Vue.set(context.list, account, address );

    },

    setAddressTxs(context, {account, txs}){

        const address = { ... context.list[account]  };

        if (!address.txs) address.txs = {};

        let minimumIndex = Number.MAX_SAFE_INTEGER;
        for (const txIndex in txs) {

            if (address.txs[txIndex] ) {

                const txIndexNumber = Number.parseInt(txIndex);

                if (address.txs[txIndex] !== txs[txIndex].toString("hex"))
                    minimumIndex = Math.min(minimumIndex, txIndexNumber );
                else
                if ( minimumIndex < txIndexNumber  ) minimumIndex = Number.MAX_SAFE_INTEGER;
            }

            address.txs[txIndex] = txs[txIndex].toString("hex");
        }

        if (minimumIndex !== Number.MAX_SAFE_INTEGER){

            for (const txIndex in address.txs)
                if (Number.parseInt(txIndex) < minimumIndex)
                    delete address[txIndex];

        }

        let txsLowestIndex = Number.MAX_SAFE_INTEGER;
        for (const txIndex in address.txs)
            txsLowestIndex = Math.min(txsLowestIndex, Number.parseInt(txIndex) );

        address.txsLowestIndex = txsLowestIndex;

        Vue.set(context.list, account, address );

    },

    setAddressLoaded(context, {account, loaded}){

        const address = { ... context.list[account]  };

        address.loaded = loaded;

        Vue.set(context.list, account, address );

    },

    setTransparentAddressUpdate(context, {account, balances, nonce, delegate, delegateVersion, version}){

        const address = { ... context.list[account]  };

        const balancesObj = {};

        if (balances)
            for (const balance of balances)
                balancesObj[ balance.tokenCurrency.toString("hex") ] = balance;

        address.balances = balancesObj;
        address.nonce = nonce;
        address.delegate = delegate;
        address.delegateVersion = delegateVersion;
        address.version = version;

        Vue.set(context.list, account, address );

    },

}
