import React from 'react'
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
export const PublicRoute = ({Autenticado, component: Component, ...rest}) => {
    return (
        <Route { ...rest} 
        component={(props) => (
            (!Autenticado) 
                ? (<Component {...props} />)
                : (<Redirect to="/" />)
        )}
    /> 
    )
}
PublicRoute.propTypes = {
    Autenticado: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
}