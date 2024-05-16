// reducers/propietariosReducer.js

const SET_PROPIETARIOS = "SET_PROPIETARIOS";

const initialState = {
  propietarios: [] 
};

const propietariosReducer = (state = initialState, action) => {
  
  switch (action.type) {
    
    case SET_PROPIETARIOS:
      return {
        ...state,
        propietarios: action.payload
      }

    default: 
      return state;
  }
}

export default propietariosReducer;