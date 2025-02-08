import 'dotenv/config'
export const isValidURL = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/
    return regex.test(url) ? url : undefined
}

const MP_API_URL = 'https://api.mercadopago.com/'
const { MP_ACCESS_TOKEN } = process.env

export const MP_API = {
    getPayment: async (id: string) => {
        if (!id) {
            return
        }
        
        const response = await fetch(`${MP_API_URL}v1/payments/${id}`, {
            headers: {
                Authorization: `Bearer ${MP_ACCESS_TOKEN}`
            }
        })

        return {
            statusCode: response.status,
            dataPayment: await response.json()
        }
    }
}