export default function(state = {
    evaluate: {},
    tradefoot: {}
}, action) {
    switch (action.type) {
        case "ADD_CODE":
            var newState = Object.assign({}, state);
            newState.evaluate = action.payload;
            return newState;
        case "ADD_STATE":
            var newState = Object.assign({}, state);
            newState.tradefoot = action.payload;
            return newState;
        default:
            return state
    }
}