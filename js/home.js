const products = [
    {
        id   :1,
        image: "../images/products/product1.jfif",
        title: "Vintage Hoodie",
        price: 650 ,
        likes: 245
    },
    {
        id   :2,
        image: "../images/products/product2.jfif",
        title: "Luxury Watch",
        price: 850 ,
        likes: 122
    },
    {
        id   :3,
        image: "../images/products/product3.jfif",
        title: "Nike Sneakers",
        price: 1200 ,
        likes: 387
    },
    {
        id   :4,
        image: "../images/products/product4.jfif",
        title: "Nike Sweatshirt",
        price: 780 ,
        likes: 211
    },
    {
        id   :5,
        image: "../images/products/product5.jfif",
        title: "Adidas Slides",
        price: 450,
        likes: 94
    },
    {
        id   :6,
        image: "../images/products/product6.jfif",
        title: "Blue Hoodie",
        price: 700 ,
        likes: 168
    },
    {
        id   :7,
        image: "../images/products/product7.jfif",
        title:" White T-Shirt",
        price: 350 ,
        likes: 74
    },
    {
        id   :8,
        image: "../images/products/product8.jfif",
        title: "Leather Jacket",
        price: 1400 ,
        likes: 301
    }
];

const container = document.getElementById("feed");
products.forEach(product => {

    container.innerHTML += `
<div class="product-card">

                <img src="${product.image}" class="card-img-top">

                <div class="product-info">

                    <h5>${product.title}</h5>

                    <p class="price">${product.price}</p>

                    <div class="action-icons">

                        <span>❤️ ${product.likes}</span>

                        <span>💬</span>

                        <span>📤</span>

                    </div>

                  <button
    class="btn btn-success add-cart"
    onclick="openOffer(${product.id})">

    Add to Cart

</button>

                </div>

            </div>

        
    `;
});

function openOffer(id){

    const product = products.find(p => p.id === id);

    document.getElementById("offerImage").src = product.image;

    document.getElementById("offerTitle").innerText = product.title;

    document.getElementById("originalPrice").innerText =
        product.price + " EGP";

    const slider = document.getElementById("offerSlider");

    slider.min = Math.floor(product.price * 0.7);

    slider.max = product.price;

    slider.value = product.price;

    document.getElementById("offerValue").innerText =
        slider.value + " EGP";

    slider.oninput = function(){

        document.getElementById("offerValue").innerText =
            this.value + " EGP";

    }

    const modal = new bootstrap.Modal(
        document.getElementById("offerModal")
    );

    modal.show();

}
updateCartBadge();

