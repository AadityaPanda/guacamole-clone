import React from 'react'
import { Link } from 'react-router-dom'
import './page-misc.css'
export const ErrorPage = () => {
    return (
        <>
            <div className="misc-wrapper">
                <h2 className="mb-2 mx-2">Error :(</h2>
                <p className="mb-4 mx-2">Oops! 😖 There was an error reaching the page. Try logging in again.</p>
                <Link aria-label='Go to Login Page' to="/" className="btn btn-primary">Back to login</Link>
                <div className="mt-3">
                    <img
                        src="../assets/img/illustrations/page-misc-error-light.png"
                        alt="page-misc-error-light"
                        aria-label="page misc error light"
                        width="500"
                        className="img-fluid"
                        data-app-dark-img="illustrations/page-misc-error-dark.png"
                        data-app-light-img="illustrations/page-misc-error-light.png" />
                </div>
            </div>
        </>
    )
}
