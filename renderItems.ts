import ky from "ky";
import { ItemData } from "./itemData";
import { addToCart } from "./cart";

const itemArea = document.querySelector("#item-area");

let allItems : ItemData[] = [];
let filteredItems : ItemData[] = [];

async function loadData() {
    if(itemArea) {
        try {
            allItems = await ky.get<ItemData[]>("https://fakestoreapi.com/products").json();
            renderItems(allItems);
            filteredItems = [...allItems];
    
        } catch (error) {
            itemArea.textContent = "Something went wrong. Errorcode: " + error;
        }
    } else {
        console.log("Element not found");
    }
}
loadData();

// ==== RENDER FUNCTION ====

function renderItems(dataArray : ItemData[]) {
    itemArea!.innerHTML = "";

    dataArray.forEach((item) => {
        const newItemWrapper = document.createElement("div");
        itemArea!.appendChild(newItemWrapper);
        newItemWrapper.classList.add("item");

        const newItemImg = document.createElement("img");
        newItemImg.setAttribute("src", item.image);
        newItemWrapper.appendChild(newItemImg);

        const newTitle = document.createElement("h3");
        newTitle.textContent = item.title;
        newItemWrapper.appendChild(newTitle)

        const newPrice = document.createElement("p")
        newPrice.textContent = `${item.price} €`
        newItemWrapper.appendChild(newPrice);
        newPrice.classList.add("price")

        // ==== ADD TO CART EVENTLISTENER ====

        const addToCartBtn = document.createElement("button");
        addToCartBtn.textContent = "Add to cart";
        newItemWrapper.appendChild(addToCartBtn);
        addToCartBtn.classList.add("add-to-cart-btn")

        addToCartBtn.addEventListener("click", () => {
            addToCart(item);
        });
    });
}

export { allItems, filteredItems, renderItems }