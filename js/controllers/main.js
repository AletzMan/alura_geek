import { ConvertPrice, isValidURL } from "../helpers/helpers.js"
import { ServicesProducts } from "../services/fetch_data.js"

const containerProducts = document.querySelector(".products")
const quantity = document.querySelector(".quantity")

const CreateCardProduct = ({ id, name, price, sku, image }) => {
    const card = document.createElement("article")
    card.classList.add("card")

    card.innerHTML = `
        <picture class="card_picture">
            <img class="card_image" src="${image}" />
        </picture>
        <footer class="card_footer">
            <span class="card_name">${name}</span>
            <span class="card_price">${ConvertPrice.format(price)}</span>
            <button class="card_delete" title="Eliminar producto" data-id="${id}" name="button_delete">
                <svg class="card_icon" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/>
                </svg>
            </button>
        </footer>
    `

    containerProducts.appendChild(card)
    return card
}

const RenderProducts = async () => {
    try {
        const productList = await ServicesProducts.GetProductList()
        productList.map(product => (
            CreateCardProduct(product)
        ))
        AddEventButtons()
        UpdateQunatityProducts()
    } catch (error) {
        console.error(error)
    }
}

RenderProducts()


////------- ADD PRODUCTS FORM ------- \\\\
const nameInput = document.querySelector(".name")
const priceInput = document.querySelector(".price")
const imageInput = document.querySelector(".image")
const errorNameLabel = document.querySelector(".error_name")
const errorPriceLabel = document.querySelector(".error_price")
const errorImageLabel = document.querySelector(".error_image")
const sendButton = document.querySelector(".send")
const clearButton = document.querySelector(".clear")
const deleteButtons = document.getElementsByName("button_delete")
const form = document.querySelector(".form")
const toaster = document.querySelector(".toast")

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const elements = e.currentTarget.elements
    const name = elements.namedItem("name").value
    const price = elements.namedItem("price").value
    const image = elements.namedItem("image").value

    let errorName = ""
    let errorPrice = ""
    let errorImage = ""

    if (name === "" || price === "" || image === "") {
        errorName = name === "" ? "Campo obligatorio" : ""
        errorPrice = price === "" ? "Campo obligatorio" : ""
        errorImage = image === "" ? "Campo obligatorio" : ""
        if (name === "") {
            errorNameLabel.classList.add("fieldset_errorView")
            nameInput.classList.add("name_error")
            errorNameLabel.innerHTML = errorName
        }
        if (price === "") {
            errorPriceLabel.classList.add("fieldset_errorView")
            priceInput.classList.add("price_error")
            errorPriceLabel.innerHTML = errorPrice
        }
        if (image === "") {
            errorImageLabel.classList.add("fieldset_errorView")
            imageInput.classList.add("image_error")
            errorImageLabel.innerHTML = errorImage
        }
    } else if (!isValidURL(image)) {
        errorImageLabel.classList.add("fieldset_errorView")
        errorImageLabel.innerHTML = "La URL no es válida"
    } else {
        const response = await ServicesProducts.AddProduct(containerProducts.children[containerProducts.children.length - 1].children[1].children[2].attributes.getNamedItem("data-id").value, name, price, "", image)
        UpdateQunatityProducts()
        ViewToast("Producto creado correctamente")
    }

})

const UpdateQunatityProducts = () => {
    const q = containerProducts.children.length
    quantity.innerHTML = `(${q})`
    console.log(q)
}

clearButton.addEventListener("click", () => {
    errorNameLabel.classList.remove("fieldset_errorView")
    nameInput.classList.remove("name_error")
    errorNameLabel.innerHTML = ""
    errorPriceLabel.classList.remove("fieldset_errorView")
    priceInput.classList.remove("price_error")
    errorPriceLabel.innerHTML = ""
    errorImageLabel.classList.remove("fieldset_errorView")
    imageInput.classList.remove("image_error")
    errorImageLabel.innerHTML = ""
})

nameInput.addEventListener("change", () => {
    errorNameLabel.classList.remove("fieldset_errorView")
    nameInput.classList.remove("name_error")
    errorNameLabel.innerHTML = ""
})

priceInput.addEventListener("change", () => {
    errorPriceLabel.classList.remove("fieldset_errorView")
    priceInput.classList.remove("price_error")
    errorPriceLabel.innerHTML = ""
})

imageInput.addEventListener("change", () => {
    errorImageLabel.classList.remove("fieldset_errorView")
    imageInput.classList.remove("image_error")
    errorImageLabel.innerHTML = ""
})


const AddEventButtons = () => {
    for (let index = 0; index < containerProducts.children.length; index++) {
        deleteButtons[index].addEventListener("click", async (e) => {
            const id = e.currentTarget.attributes.getNamedItem("data-id")?.value
            const response = await ServicesProducts.DeleteProduct(id)
            ViewToast(`Producto '${id}' eliminado correctamente`)
        })

    }
}

const ViewToast = (message) => {
    setTimeout(() => {

        toaster.innerHTML = message
        toaster.classList.add("toast_active")
        setTimeout(() => {
            toaster.classList.remove("toast_active")
        }, 3000)
    }, 2000)
}
UpdateQunatityProducts()