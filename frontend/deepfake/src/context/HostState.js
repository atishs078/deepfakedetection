import React from 'react'
import hostContext from './HostContext'
const HostState = (props) => {
    const host="http://192.168.115.61:5000/"
  return (
    <>
        <hostContext.Provider value={{host}}>
            {props.children}
        </hostContext.Provider>
    </>
  )
}
export default HostState
