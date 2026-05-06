import React from 'react'
 
function Loader({ color = "#28a745" }) {
    return (
        <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    )
}
 
export default Loader