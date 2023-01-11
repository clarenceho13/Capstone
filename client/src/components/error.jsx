import React from 'react'

function errorMessage(error) {
  return (
    error.response && error.response.data.message
    ? error.response.data.message
    : error.message
  )
}

export default errorMessage;

//fetch the error message from productcontroller if the url is wrong