const URL = "http://localhost:3000/"

export const GetProductList = async () => {
    const response = await fetch(`${URL}products`)
    const products = response.json()
    return products
}

export const AddProduct = async (id, name, price, sku, image) => {
    try {
        const response = await fetch(`${URL}products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                name,
                price,
                sku,
                image
            })
        })
        if (response.ok) {
            return true
        }
        return false
    } catch (error) {
        console.error(error)
    }
}

export const DeleteProduct = async (id) => {
    try {
        const response = await fetch(`${URL}products/${id}`, {
            method: "DELETE"
        })
        if (response.ok) {
            return true
        }
        return false
    } catch (error) {
        console.error(error)
    }
}


export const ServicesProducts = {
    GetProductList,
    AddProduct,
    DeleteProduct
}