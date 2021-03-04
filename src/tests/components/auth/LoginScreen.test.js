import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import thunk from "redux-thunk";
import configureStore from 'redux-mock-store';
import { LoginScreen } from '../../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../../actions/auth';
import Swal from 'sweetalert2'


jest.fn('../../../actions/auth', () => ({
    startLogin: jest.fn(),
    startRegister: jest.fn()
})) 

jest.fn('sweetalert2', () => ({
   fire: jest.fn()
})) 

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <LoginScreen/>
    </Provider>
)

describe('Pruebas en <LoginScreen/>', () => {
    beforeEach(()=> {
        jest.clearAllMocks();
    })
    test('debe mostrarse correctamente ', () => {
        expect(wrapper).toMatchSnapshot();
    })
    test('Debe de llamar el dispatch del login ', () => {
        wrapper.find('input[name="lEmail"]').simulate('change' , {
            target: {
                name: 'lEmail',
                value: 'juan@gmail.com'
            }
        });
        wrapper.find('input[name="lPassword"]').simulate('change' , {
            target: {
                name: 'lPassword',
                value: '12345678'
            }
        });

        wrapper.find('form').at(0).prop('onSubmit')({
            preventDefault(){}
        })
        expect(startLogin).toHaveBeenCalledWith('juan@gmail.com','12345678' );
    })
    
    test('No hay registro si las contraseñas son diferentes ', () => {
        wrapper.find('input[name="rPassword1"]').simulate('change' , {
            target: {
                name: 'rPassword1',
                value: '12345678'
            }
        });
        wrapper.find('input[name="rPassword2"]').simulate('change' , {
            target: {
                name: 'rPassword2',
                value: '123456789'
            }
        });
        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault(){}
        })
        expect(startRegister).not.toHaveBeenCalled();
        expect(Swal.fire).toHaveBeenCalledWith('Error', 'Las contraseñas deben de ser iguales ','error');

    })
    
    test('Registro con contraseñas iguales ', () => {
        wrapper.find('input[name="rPassword1"]').simulate('change' , {
            target: {
                name: 'rPassword1',
                value: '12345678'
            }
        });
        wrapper.find('input[name="rPassword2"]').simulate('change' , {
            target: {
                name: 'rPassword2',
                value: '12345678'
            }
        });
        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault(){}
        })
        expect(Swal.fire).not.toHaveBeenCalled();
        expect( startRegister).toHaveBeenCalledWith('nando@gmail.com','12345678','Nando');

    })
    
})
