const { cookies } = require("next/headers")

module.exports.sessionCheck = async () => {
    //check for session cookie
    let current_session = cookies().get("session_token")
    if (current_session == undefined || current_session.value == "")
        return {status: 403, message: "Session undefined."}

    try {
        let res = await fetch(process.env.API_URL + '/api/authentication/session', { 
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                
                'Credentials': 'same-origin',
                'Access-Control-Allow-Credentials': true,
                Cookie: `session_token=${current_session.value}`
            }
        })
    
        if (!res.ok) 
            return {status: 400, message: "Session fetch error."}
        
        const data = await res.json()
    
        if (data.status != 200)
            return data

        return data
      }
      catch (e) {
        return {status: 400, message: "Session fetch error."}
      }

}