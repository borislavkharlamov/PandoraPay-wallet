import Vue from 'vue';

export default {

    deleteTransactions(context, {transactions}){

        for (const key in transactions)
            Vue.delete(context.list, key);

    },

    setTransactions(context, { transactions }) {

        for (const key in transactions)
            Vue.set(context.list, key, transactions[key]);

    },

    setPendingTransactions(context, { transactions, transactionsNext, clear = false }) {

        if (clear)
            context.pending = {};

        for (const key in transactions)
            Vue.set(context.pending, key, transactions[key]);

        context.pendingNext = transactionsNext;


    }

}