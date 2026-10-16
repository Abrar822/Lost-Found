import getToken from "../helper/getToken"
let token = getToken()

export async function postLost(item) {
    console.log(token)
    let response = await fetch('http://127.0.0.1:8000/post_lost', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            item_name: item.item_name,
            description: item.description,
            date: item.date,
            location: item.location,
            image: item.image?.name
        })
    })

    let result = await response.json()
    if (!response.ok) {
        throw new Error(`${result.detail}`);
    }
    return result

}

export async function postFound(item) {
    let token = getToken()
    let response = await fetch('http://127.0.0.1:8000/post_found', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            item_name: item.item_name,
            description: item.description,
            date: item.date,
            location: item.location,
            image: item.image?.name
        })
    })

    let result = await response.json()
    if (!response.ok) {
        throw new Error(`${result.detail}`);
    }
    return result

}