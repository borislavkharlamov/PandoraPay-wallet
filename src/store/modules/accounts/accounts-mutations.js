import Vue from "vue";
import consts from 'consts/consts'

export default {

    setAccount(state, {account, publicKeyHash }){
        Vue.set(state.list, publicKeyHash, account );
    },

    setSubscribedAccountStatus(state, {publicKeyHash,status} ){
        if (status) Vue.set(state.subscribed, publicKeyHash, true)
        else Vue.delete(state.subscribed, publicKeyHash)
    },

    accountNotification(state, {account, publicKeyHash}){
        Vue.set(state.list, publicKeyHash, account );
    },

    setAccountTxsViewPosition(state, {publicKeyHash, starting, ending, update}){
        Vue.set( state.viewTxsPositions, publicKeyHash,  { starting,  ending,  update })
    },

    setAccountTxs(state, {publicKeyHash, starting, accountTxs }){

        const obj = {
            hashes: {},
            count: 0,
        };

        if (accountTxs){
            obj.count = accountTxs.count

            accountTxs.txs = (accountTxs.txs||[]).reverse()
            for (let i=0; i < accountTxs.txs.length; i++)
                obj.hashes[starting + i ] = accountTxs.txs[i]
        } else {
            obj.count = 0
            obj.next = 0
        }

        Vue.set(state.txs, publicKeyHash, obj );
    },

    addAccountTxUpdateNotification(state, {publicKeyHash, txHash, extraInfo }){

        const obj = {
            hashes: {},
            count: 0,
            ...state.txs[publicKeyHash]
        };


        if (!extraInfo.inserted){ //removed
            obj.count -= 1
            delete obj.hashes[ extraInfo.txsCount - 1 ]

        } else {
            obj.count += 1
            obj.hashes[ extraInfo.txsCount ] = txHash

        }

        const viewTxsPositions = state.viewTxsPositions[publicKeyHash]
        if (viewTxsPositions) {
            let c = 0
            for (const heightStr in obj.hashes) {
                const height = Number.parseInt(heightStr)
                if (height < viewTxsPositions.starting || height > viewTxsPositions.ending)
                    c++
            }

            if (c >= consts.addressTxsPagination)
                for (const heightStr in obj.hashes) {
                    const height = Number.parseInt(heightStr)
                    if (height < viewTxsPositions.starting || height > viewTxsPositions.ending)
                        delete obj.hashes[heightStr]
                }
        } else {
            for (const heightStr in obj.hashes) {
                const height = Number.parseInt(heightStr)
                if ( height > obj.count || height < obj.count - consts.addressTxsPagination )
                    delete(hashes[height])
            }
        }

        Vue.set(state.txs, publicKeyHash, obj );
    }


}
