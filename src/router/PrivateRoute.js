import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute = ({Autenticado, component: Component, ...rest}) => {
    
    localStorage.setItem('lastPath',  rest.location.pathname); 
    return (
        <Route { ...rest} 
            component={(props) => (
                (Autenticado) 
                    ? (<Component {...props} />)
                    : (<Redirect to="/login" />)
            )}
        /> 
    )
}

PrivateRoute.propTypes = {
    Autenticado: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
}
