import { fetchConToken, fetchSinToken } from "../../helpers/fetch"

describe('Pruebas en el fetch de helpers', () => {
    let token = '';
    test('fetchSinToken debe de funcionar ', async () => {
        const resp =  await fetchSinToken('auth', { email: 'cristian260893@gmail.com' , password: '12345678'} , 'POST');
        expect(resp instanceof Response).toBe(true);
        const body = await resp.json();
        expect(body.ok).toBe(true);
        token = body.token; 

    })
    test('fetchConToken debe de funcionar ', async () => {
        
       localStorage.setItem('token' , token);
       const resp = await fetchConToken('events/6038104fa301c42624ec7840' , {} , 'DELETE');
       const body = await resp.json();
       expect(body.msg).toBe('Evento no existe por ese id') 

    })
})
