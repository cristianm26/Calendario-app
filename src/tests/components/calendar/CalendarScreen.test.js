import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import thunk from "redux-thunk";
import configureStore from 'redux-mock-store';

import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import { mensajes } from '../../../helpers/calendario-mensajes-es';
import { types } from '../../../types/types';
import { eventSetActive } from '../../../actions/events';
import { act } from '@testing-library/react';

jest.fn('../../../actions/events', () => ({
    eventSetActive: jest.fn(),
    eventStartLoading: jest.fn()
}))
Storage.prototype.setItem = jest.fn();
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {
    calendar: {
        events: []
    },
    auth:{
        uid: '1234',
        name: 'Fernando'
    },
    ui: {
        modalOpen: false
    }
};
const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <CalendarScreen/>
    </Provider>
)

describe('Pruebas en <CalendarScreen/>', () => {
    test('debe de mostrarse correctamente ', () => {
        expect(wrapper).toMatchSnapshot();
    })
    test('Pruebas con las iteracciones del calendario ', () => {
        const calendar= wrapper.find('Calendar');
        const calendarMessages = calendar.prop('messages');
        expect(calendarMessages).toEqual(mensajes);
        calendar.prop('onDoubleClickEvent')();
        expect(store.dispatch).toHaveBeenCalledWith({type: types.uiOpenModal});
        calendar.prop('onSelectEvent')({start: 'Hola'});
        expect(eventSetActive).toHaveBeenCalledWith({start: 'Hola'});
        act(()=>{
            calendar.prop('onView')('week');
            expect(localStorage.setItem).toHaveBeenCalledWith('lastView', 'week')
        })
        
    })
    
    
})
