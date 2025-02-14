import axios from "axios";

const OK = 200 | 201 | 204

const createNewBoard = async (solution: string, rows: number, cols: number) => {
    const axiosResponse = axios
        .post(`http://localhost:3000/api/g`, {
            rows: rows,
            cols: cols,
            message: solution
        })

    const response = await axiosResponse;

    console.log("solution", response)
    return response.status === OK ? response.data : "error occured"
}


export default createNewBoard