// toggle menu open and close
const menu = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const overlay = document.querySelector(".overlay");

menuToggle.addEventListener("click", () => {
  menu.classList.add("show");
  overlay.classList.add("show");
  menu.ariaExpanded = "true";
});

menuClose.addEventListener("click", () => {
  menu.classList.remove("show");
  overlay.classList.remove("show");
  menu.ariaExpanded = "false";
});

// toggle cart icon
const cartIcon = document.querySelector(".nav-cart");
const cart = document.querySelector(".cart");
cartIcon.addEventListener("click", () => {
  cart.classList.toggle("show");
});

// add to cart amount
const plus = document.querySelector(".count-plus");
const minus = document.querySelector(".count-minus");
const count = document.querySelector(".product-amount");
const addCart = document.querySelector(".add-to-cart");
const inCart = document.querySelector(".cart__content");
let amountInCart = 0;

plus.addEventListener("click", () => {
  let countNum = count.textContent;
  countNum++;
  count.textContent = countNum;
});

minus.addEventListener("click", () => {
  let countNum = count.textContent;
  if (countNum !== "0") {
    countNum--;
  }
  count.textContent = countNum;
});

addCart.addEventListener("click", (e) => {
  const product = e.target.closest(".product__content");
  const amtToCart = count.textContent;
  const productCount = document.querySelector(".nav-cart-count");
  let amtInCart = document.querySelector(".product__amount") || 0;

  if (amtToCart !== "0") {
    if (amtInCart === 0) {
      amtInCart += parseInt(amtToCart);
    } else {
      amtInCart = parseInt(amtInCart.textContent) + parseInt(amtToCart);
    }
  }
  if (amtInCart > 0) {
    let productPrice = product.querySelector(".price-current").textContent;
    let total = parseFloat(productPrice.replace("$", "")) * amtInCart;
    productCount.textContent = amtInCart;
    productCount.style.display = "flex";

    inCart.innerHTML = `<div class="cart__product flex">
            <img class="cart__thumbnail" src="./images/image-product-1-thumbnail.jpg">
            <div class="cart__details">
              <p class="cart__details-name">${
                product.querySelector(".product__title").textContent
              }</p>
              <p class="cart__details-price">${productPrice} x <span class='product__amount'>${amtInCart}</span><span class="cart__details-total">$${total.toFixed(
      2
    )}</span></p>
            </div>
            <img class="cart-delete" src="./images/icon-delete.svg" alt="trash can">
          </div>
          <button class="btn checkout">Checkout</button>`;

    // Set the amount of product back to zero
    count.textContent = "0";

    // remove product from cart
    const productDel = document.querySelector(".cart-delete");
    productDel &&
      productDel.addEventListener("click", () => {
        inCart.innerHTML = "<p>Your cart is empty.</p>";
        cartIcon.setAttribute("count", "");
        productCount.textContent = "";
        productCount.style.display = "none";
      });
  }
});

// open lightbox gallery only on the first sets of large images in DOM (not including those in modal)
let widthMatch = window.matchMedia("(min-width: 750px)");
const lgProductImg = document
  .querySelector(".product__img-div")
  .querySelectorAll(".product__img");
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal-close");
// Add the eventlistener when the page is first loaded that satisfy the screenWidth
if (widthMatch.matches) {
  lgProductImg.forEach((img) => img.addEventListener("click", showModal));
}
// Dynamically attach or remove the eventlistener depending on the change in screen width
widthMatch.addEventListener("change", (mm) => {
  if (mm.matches) {
    // it matches the media query: that is, min-width is >= 750px
    lgProductImg.forEach((img) => img.addEventListener("click", showModal));
  } else {
    lgProductImg.forEach((img) => img.removeEventListener("click", showModal));
  }
});

// the large image in the modal should be the same as the one when user click on the large image
// and the current thumbnail in the modal should be the same one as the large image
function showModal() {
  const imgDiv = document.querySelector(".product__img-div");
  const lgImages = imgDiv.querySelectorAll(".product__img");
  const currentImg = imgDiv.querySelector(".img-current");
  let imgInd = Array.prototype.indexOf.call(lgImages, currentImg);

  const modalLgImages = modal.querySelectorAll(".product__img");
  const modalSmImages = modal.querySelectorAll(".product__thumbnail");

  modal.querySelector(".img-current").classList.remove("img-current");
  modal
    .querySelector(".thumbnail-current")
    .classList.remove("thumbnail-current");

  modalLgImages[imgInd].classList.add("img-current");
  modalSmImages[imgInd].classList.add("thumbnail-current");
  modal.classList.add("show");
}

modalClose.addEventListener("click", () => {
  modal.classList.remove("show");
});

// image prev and next functionality
const nextImage = document.querySelectorAll(".image-next");
const prevImage = document.querySelectorAll(".image-prev");

nextImage.forEach((nextBtn) => {
  nextBtn.addEventListener("click", (e) => changeImage(e, "next"));
});

prevImage.forEach((prevBtn) => {
  prevBtn.addEventListener("click", (e) => changeImage(e, "prev"));
});

// both the current large image and current thumbnail should change together
function changeImage(e, action) {
  const imgDiv = e.currentTarget.closest("section");
  const lgImages = imgDiv.querySelectorAll(".product__img");
  const smImages = imgDiv.querySelectorAll(".product__thumbnail");
  const currentImg = imgDiv.querySelector(".img-current");
  let imageInd = Array.prototype.indexOf.call(lgImages, currentImg);

  lgImages[imageInd].classList.remove("img-current");
  smImages[imageInd].classList.remove("thumbnail-current");

  if (action === "prev") {
    imageInd--;
  } else {
    imageInd++;
  }

  if (imageInd < 0) {
    imageInd = lgImages.length - 1;
  } else if (imageInd > lgImages.length - 1) {
    imageInd = 0;
  }

  lgImages[imageInd].classList.add("img-current");
  smImages[imageInd].classList.add("thumbnail-current");
}

// the clicked thumbnails to show as the currently selected
const thumbnails = document.querySelectorAll(".product__thumbnail");
thumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener("click", (e) => {
    let imgDiv = null;
    if (
      e.currentTarget.parentElement.classList.contains("modal__thumnail-div")
    ) {
      imgDiv = e.currentTarget
        .closest("section")
        .querySelector(".modal__content");
    } else {
      imgDiv = e.currentTarget.closest("section");
    }

    const lgImages = imgDiv.querySelectorAll(".product__img");
    let imgInd = e.currentTarget.dataset.seq - 1;

    // reset the current thumbnail
    imgDiv
      .querySelector(".thumbnail-current")
      .classList.remove("thumbnail-current");
    e.currentTarget.classList.add("thumbnail-current");

    // reset the current large image
    imgDiv.querySelector(".img-current").classList.remove("img-current");
    lgImages[imgInd].classList.add("img-current");
  });
});
