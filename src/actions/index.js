import  axios from 'axios';

export function increment(pageButton) {
    return {type: 'INCREMENT', pageButton}
}
export const decrement = (id, value) => dispatch => {
    if( value === 0 ) return;
    dispatch({type: 'DECREMENT', id});

}

export const addIfOdd = (id, value) => dispatch =>{
    if( value%2 === 0 ) return;
    dispatch(increment(id))
}

export const asyncAdd = pathName => dispatch =>{
    console.log(pathName)
    axios.post('/api/getBtnServer',{})
    .then(function(res){
        var pageButton = res.data.btnArrData[pathName]
        console.log(pageButton)
        dispatch(increment(pageButton));
    })
    .catch(function(err){
        console.log(err);
    });
}

export const addCounter = panelName => ({type: 'ADD_COUNTER', panelName})
