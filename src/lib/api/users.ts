import axios from "axios";

export const getUsers = async () => {
    try {
        const response = await axios.post('https://server.pgso.bpc-bsis4d.com/public/api/admin/users')
        return response.data
    } catch (error) {
        console.error('Error fetching users:', error)
        throw error
    }   
}