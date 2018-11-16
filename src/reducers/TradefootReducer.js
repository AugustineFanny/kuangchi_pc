export default function(state = {
    order: {},
    evalorder: {},
    payment: {},
    reopen: {}
}, action) {
    switch (action.type) {
        case "OPENMODAL":
            var newState = Object.assign({}, state);
            newState.order = action.payload;
            return newState;
        case "GIVECODE":
            var newState = Object.assign({}, state);
            newState.evalorder = action.payload;
            return newState;
        case "PAYMENT":
            var newState = Object.assign({}, state);
            newState.payment = action.payload;
            return newState;
        case "REOPEN":
            var newState = Object.assign({}, state);
            newState.reopen = action.payload;
            return newState;
        default:
            return state
    }
}