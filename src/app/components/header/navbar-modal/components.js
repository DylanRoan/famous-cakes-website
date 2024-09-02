'use client'

import { faCaretUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useState } from "react"

export function NavBarDropdown ({ href = '/', name = 'SAMPLE', children }) {
    const [drop, setDrop] = useState(false)

    const dropState = () => {
        if (drop) 
            setDrop(false)
        else
            setDrop(true)
    }

    return (
        <div className={`nav-dropdown ${drop ? 'drop' : ''}`}>
            <div className='nav-dropdown-title'>
                <a href={href}>{name}</a>
                <FontAwesomeIcon onClick={dropState} icon={faCaretUp}></FontAwesomeIcon>
            </div>
            <div className='nav-dropdown-content'>
                {children}
            </div>
        </div>
    )
}