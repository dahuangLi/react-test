
let initState = {
    A: [],
    B: [],
    btnData:{},
    pageButton:[]
};



export default function counter(state=initState, action) {
    let {type, id, panelName,pageButton} = action;
    switch (type) {
        case 'ADD_COUNTER':
            if(panelName==='A'){
                return Object.assign({}, state, {A: [...state.A, {
                    id: new Date().getTime(),
                    value: 0
                }]
            });
            }else{
                return Object.assign({}, state, {B: [...state.B, {
                    id: new Date().getTime(),
                    value: 0
                }]
              })
            } 
        case 'INCREMENT':
            return Object.assign({}, state,{pageButton});
        case 'DECREMENT':
            return Object.assign({},{
                A: state.A.map( elt =>{
                    if(elt.id === id){
                        elt.value--;
                    }
                    return elt;
                } ),
                B: state.B.map( elt =>{
                    if(elt.id === id){
                        elt.value--;
                    }
                    return elt;
                } ),
            })
            ;

        default:
            return state;
    }
}
