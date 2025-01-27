import ky from "ky";
import { ItemData } from "./itemData";

const itemArea = document.querySelector("#item-area");

let allItems : ItemData[] = [];
let filteredItems : ItemData[] = [];
let cartItems : ItemData[] = [];

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

function renderItems(data : ItemData[]) {
    itemArea!.innerHTML = "";

    data.forEach((item) => {
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
        addToCartBtn.classList.add("add-to-cart")

        addToCartBtn.addEventListener("click", () => {
            addToCart(item);
        });
    });
}

// ==== FILTERS ====

const filterElectro = document.querySelector("#filter-electro");
const filterJewelery = document.querySelector("#filter-jewelery");
const filterWomen = document.querySelector("#filter-women");
const filterMen = document.querySelector("#filter-men");
const filterAll = document.querySelector("#filter-all");

function filterItems(category: string) {
    filteredItems = allItems.filter((item) => {
        return item.category === category;
    })
    renderItems(filteredItems);
};

filterElectro?.addEventListener("click", () => {
    filterItems("electronics")
});
filterJewelery?.addEventListener("click", () => {
    filterItems("jewelery")
});
filterWomen?.addEventListener("click", () => {
    filterItems("women's clothing")
});
filterMen?.addEventListener("click", () => {
    filterItems("men's clothing")
});
filterAll?.addEventListener("click", () => {
    renderItems(allItems);
    filteredItems = [...allItems];
})

// ==== SEARCH BY INPUT ====

const searchInput = document.querySelector<HTMLInputElement>("#search-input");

if(searchInput) {
    searchInput.addEventListener("input", () => {
        const inputValue = searchInput.value;

        filteredItems = allItems.filter((item) => {
            return item.title.toLowerCase().includes(inputValue.toLowerCase());
        });
        renderItems(filteredItems)
    });
}

// ==== SORT BY ====

const sortBySelect = document.querySelector<HTMLSelectElement>("#sort-by");

if(sortBySelect) {
    sortBySelect.addEventListener("change", () => {
        const sortValue = sortBySelect.value;
        let sortedItems : ItemData[] = [];

        if(sortValue === "highest-price") {
            sortedItems = filteredItems.sort((a,b) => b.price - a.price);
        }
        if(sortValue === "lowest-price") {
            sortedItems = filteredItems.sort((a,b) => a.price - b.price);
        }
        if(sortValue === "title-up") {
            sortedItems = filteredItems.sort((a,b) => a.title.localeCompare(b.title));
        }
        if(sortValue === "title-down") {
            sortedItems = filteredItems.sort((a,b) => b.title.localeCompare(a.title));
        }
        renderItems(sortedItems);
    })
}

// ==== ADD TO CART FUNCTION ====

let cartIndex : number = 0;

function addToCart(data : ItemData) {
    const cartList = document.querySelector("#cart-list")
    const cartIndexElem = document.querySelector("#cart-index");
    const cartIndexWrapper = document.querySelector<HTMLDivElement>("#cart-index-wrapper");

    if(cartIndexElem && cartIndexWrapper && cartList) {
        cartIndex++;
        cartIndexWrapper.style.display = "flex";
        cartIndexElem.textContent = cartIndex.toString();

        const newListItem = document.createElement("li");
        newListItem.textContent = data.title;
        cartList.appendChild(newListItem);
    }

    cartItems.push(data);
    console.log(cartItems);
}