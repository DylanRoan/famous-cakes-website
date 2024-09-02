'use client'

import { useEffect, useState } from "react"

export default function Profile () {
    const [data, setData] = useState(false);
    const [errorState, setErrorState] = useState(false);

    return (
        <main id="profile">
            Profile in the making... (Under development)
        </main>
    )
}