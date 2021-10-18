import mutations from "./transactions-preview-mutations"
import actions from "./transactions-preview-actions"

export default {

    state: {
        txsByHash: {},
        txsByHeight: {},

        viewTxsHashes: {},
    },

    actions,
    mutations,
}
