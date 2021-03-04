import thunk from "redux-thunk";
import configureStore from 'redux-mock-store';
import { startChecking, startLogin, startRegister } from "../../actions/auth";
import { types } from "../../types/types";
import Swal from 'sweetalert2';
import * as fetchModule from '../../helpers/fetch';
jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}))

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
let store = mockStore(initState);
Storage.prototype.setItem = jest.fn();
let token = '';
describe('Pruebas en las acciones Auth', () => {
    beforeEach(()=> {
        store = mockStore(initState);
        jest.clearAllMocks();
    })
    test('startLogin Correcto ', async () => {
        await store.dispatch(startLogin('cristian260893@gmail.com' , '12345678'));
        const actions =store.getActions();
        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: expect.any(String),
                name: expect.any(String)
            }
        })
        expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
        token = localStorage.setItem.mock.calls[0][1];
       
    })

    test('startLogin Incorrecto ', async () => {
        await store.dispatch(startLogin('cristian260893@gmail.com' , '12345678910'));
        const actions =store.getActions();
        expect(actions).toEqual([]);
        expect(Swal.fire).toHaveBeenCalledWith("Error" , "Password incorrecto" , "error");

    })
    
    test('startRegister Correcto ',async  () => {
        fetchModule.fetchSinToken = jest.fn(()=> ({
            json() {
                return {
                    ok: true,
                    uid: '1234',
                    name: 'carlos',
                    token: 'ABC123',

                }
            }
        }));

        await store.dispatch(startRegister('test@test.com' , '12345678' , 'test'));
        const actions = store.getActions();
        expect(actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '1234',
                name: 'carlos'
            }
        })
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'ABC123');
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
    })
    test('startChecking Correcto ', async () => {
        fetchModule.fetchConToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'carlos',
                    token: 'ABC123ABC123'
                }
            }
        }));


        await store.dispatch( startChecking() );

        const actions = store.getActions();
        
        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'carlos'
            }
        });


        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'ABC123ABC123' );
        
    })
    
})
