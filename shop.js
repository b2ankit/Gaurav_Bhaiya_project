let productDetails = {};
let searchStr = "";
let basket = {};
/** filter and sorting variable intialisation : Start */
let sort_options = "";
let filter_maxprice = "";
let filter_options_arr = [];
/** filter and sorting variable intialisation : End */

//Each product is based on a 'card'; a box that contains information about that product.
//You can change the card template here. The [EVEGPRODUCT#] will always be subsituted for 
//the element in the imagesArr (see fruit.js)
//The classes can be styled using CSS
//The adjustDown and adjustUp buttons have their behaviour specified below, but you can change this if you like
//To change the quantity of a product, change the value of the input (with the class of buyInput), you can then recalculate the basket with refreshBasket()
//Or you can adjust the basket object via javascript and call updateQuantityInputs() and refreshBasket()
var cardTemplate = `<div class="shop-product card" data-num="[EVEGPRODUCT#]">
<div class="card__content" data-num="[EVEGPRODUCT#]">
<div class="shop-product-details shop-product-img" data-field="img" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-details shop-product-title card__title" data-field="title" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-details shop-product-price" data-field="price" data-num="[EVEGPRODUCT#]"></div>
</br>
<div class="shop-product-details shop-product-units" data-field="units" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-buying" data-num="[EVEGPRODUCT#]">
<div class="adjustDiv"><button class="btn adjustDown">-</button>
<input class="buyInput" data-num="[EVEGPRODUCT#]" min="0" value="0">
<button class="btn adjustUp">+</button>
<button class="addToBasket" disabled>Add to Basket</button></div>
</div></div></div>`;

function init() {
  const toggleButton = document.getElementsByClassName('toggle-button')[0];
  const hero = document.getElementsByClassName('hero')[0];
  const navbarLinks = document.getElementsByClassName('navbar-links')[0];

  //When the toggle button is pressed (if visible by the screen size, the menu is shown)
  toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
    hero.classList.toggle('menuactive');
  });

  //Updates the search as you type
  document.getElementById('searchbox').addEventListener("input",
    () => {
      searchStr = document.getElementById('searchbox').value;
      redraw();
    })

  //Close the cookies message
  document.getElementById('acceptCookies').addEventListener('click', () => {
    setCookie('cookieMessageSeen', true);
    document.getElementById('cookieMessage').style.display = 'none';
  });

  if (getCookie("cookieMessageSeen") == "true") {
    document.getElementById('cookieMessage').style.display = 'none';
  }
  initProducts(redraw);
  /** Searching for max price product to set the price range */
  max_price_find(productDetails);

  // tries to get the cookies values of products - so remembers what has been added before 
  try {
    basket = JSON.parse(getCookie("basket"));
    numOfItems = 0;
    // counts the quantity of each item in basket 
    for (const productID in basket) {
      let quantity = basket[productID];
      numOfItems += quantity;
    }
    // updates the html of the basket coutn circle 
    if (numOfItems != 0) {
      document.querySelector('.itemCountCircle').innerHTML = numOfItems.toString();
    }
  } catch {

  }
}


/*
* When changing the page, you should make sure that each adjust button has exactly one click event
* (otherwise it might trigger multiple times)
* So this function loops through each adjustment button and removes any existing event listeners
* Then it adds another event listener
*/
function resetListeners() {
  var elements = document.getElementsByClassName("adjustUp");
  var eIn;
  for (eIn = 0; eIn < elements.length; eIn++) {
    elements[eIn].removeEventListener("click", increment);
    elements[eIn].addEventListener("click", increment);
  }
  elements = document.getElementsByClassName("adjustDown");
  for (eIn = 0; eIn < elements.length; eIn++) {
    elements[eIn].removeEventListener("click", decrement);
    elements[eIn].addEventListener("click", decrement);
  }
  elements = document.getElementsByClassName("buyInput");
  for (eIn = 0; eIn < elements.length; eIn++) {
    elements[eIn].removeEventListener("input", inputchange);
    elements[eIn].addEventListener("input", inputchange);
    elements[eIn].addEventListener("keypress", function (evt) {
      if (evt.which < 48 || evt.which > 57) {
        evt.preventDefault();
      }
    });
  }
  elements = document.getElementsByClassName("addToBasket");
  for (eIn = 0; eIn < elements.length; eIn++) {
    elements[eIn].removeEventListener("click", addToBasket);
    elements[eIn].addEventListener("click", addToBasket);
  }
}


//When the input changes, add a 'bought' class if more than one is added
function inputchange(ev) {
  var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
  var input = ev.target.parentElement.closest(".shop-product-buying").getElementsByTagName("input")[0];
  changeQuantity(thisID, input.value, ev);
}

/*
* Change the quantity of the product with productID
*/
function changeQuantity(productID, newQuantity, ev) {
  // basket[productID] = newQuantity;
  // if(newQuantity == 0)
  //   delete basket[productID];
  document.querySelector(".buyInput[data-num='" + productID + "']").value = newQuantity;
  if (newQuantity > 0)
    ev.target.closest(`div`).querySelector(`[class=addToBasket]`).disabled = false;
  else
    ev.target.closest(`div`).querySelector(`[class=addToBasket]`).disabled = true;
  //refreshBasket();
}

//Add 1 to the quantity
function increment(ev) {
  var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
  // if(basket[thisID] === undefined){
  //   basket[thisID] = 0;
  // }
  var value = parseInt(document.querySelector(".buyInput[data-num='" + thisID + "']").value);
  if (!value) {
    value = 0;
  }
  changeQuantity(thisID, value + 1, ev);
}

//Subtract 1 from the quantity
function decrement(ev) {
  var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
  let currVal = parseInt(document.querySelector(".buyInput[data-num='" + thisID + "']").value);
  if (currVal > 0) {
    var value = parseInt(document.querySelector(".buyInput[data-num='" + thisID + "']").value);
    if (!value) {
      value = 0;
    }
    changeQuantity(thisID, value - 1, ev);
  }
  if (currVal <= 1) {
    ev.target.closest(`div`).querySelector(`[class=addToBasket]`).disabled = true;
  }
  // if(basket[thisID] === undefined){
  //   changeQuantity(thisID,0);
  // }else{
  //   if(basket[thisID] > 0){
  //     changeQuantity(thisID,parseInt(basket[thisID])-1);
  //   }
  // }
}

function addToBasket(ev) {
  var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
  if (basket[thisID])
    basket[thisID] = basket[thisID] + parseInt(document.querySelector(".buyInput[data-num='" + thisID + "']").value);
  else
    basket[thisID] = parseInt(document.querySelector(".buyInput[data-num='" + thisID + "']").value);
  refreshBasket();
  document.querySelector(".buyInput[data-num='" + thisID + "']").value = 0;

  // want to display the product added
  document.querySelector('.alert').innerHTML = "<h3>Added to Basket</h3><span class=\"imgspacer\"></span><img src=\"images/" + imagesArr[thisID][2] + "\" height = '60' width = '80'></img> <h3>" + imagesArr[thisID][0] + "</h3><h3>Quantity: " + basket[thisID] + "</h3>"
  document.querySelector('.alert').style.visibility = "visible";
  setTimeout(function () {
    document.querySelector('.alert').style.visibility = "hidden";
  }, 2000);
  // want to update the no items in basket count 
  numOfItems = 0;
  // counts the quantity of each item in basket 
  for (const productID in basket) {
    let quantity = basket[productID];
    numOfItems += quantity;
  }
  // updates the html of the basket coutn circle 
  document.querySelector('.itemCountCircle').innerHTML = numOfItems.toString();
  ev.target.closest(`div`).querySelector(`[class=addToBasket]`).disabled = true;
}


function filterFunction(a) {
  /** Search and filter logic */
  if (searchStr != "") {
    if ((a.name.toLowerCase().includes(searchStr.toLowerCase()))) {
        for (var i = 0; i < filter_options_arr.length; i++) {
          if (a.type == filter_options_arr[i] && a.price < parseInt(filter_maxprice)) {
            return true;
          }
        }
    }
    else {
      return false;
    }
  }



  /** Filter logic whenever type and price is not selected  */
  if (filter_options_arr.length == 0 && filter_maxprice == "") {
    return true;
  }
  /** Filter logic whenever type is not selected but price is selected  */
  else if (filter_options_arr.length == 0 && filter_maxprice != "") {

    if (a.price < parseInt(filter_maxprice)) {
      return true;
    }
  }
  /** Filter logic whenever both type and price is selected  */
  else {
    for (var i = 0; i < filter_options_arr.length; i++) {

      if (a.type == filter_options_arr[i] && a.price < parseInt(filter_maxprice)) {
        return true;
      }
    }

  }
}


function sortFunction(a, b) {

  /** Sorting the product by price High to Low*/
  if (sort_options == "HtoL") {
    return b.price - a.price;
  }
  /** Sorting the product by price Low to High*/
  else if (sort_options == "LtoH") {
    return a.price - b.price;
  }
  /** Sorting the product by name Z to A*/
  else if (sort_options == "ZtoA") {

    if (a.name < b.name) {
      return 1;
    }
    if (a.name > b.name) {
      return -1;
    }
    return 0;
  }
  /** Sorting the product by name A to Z*/
  else {

    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

}


//Redraw all products based on the card template
function redraw() {

  //Reset the product list (there are possibly more efficient ways of doing this, but this is simplest)
  document.querySelector('.productList').innerHTML = '';

  var shownProducts = productDetails.filter(filterFunction);

  shownProducts.sort(sortFunction);

  var numProducts = shownProducts.length;

  if (numProducts == 0) {
    document.getElementById("searchreturn").innerHTML = "No products found for search term: '" + searchStr + "'";
  } else {
    document.getElementById("searchreturn").innerHTML = "";


    for (var i = 0; i < numProducts; i++) {
      var cardHTML = cardTemplate.replaceAll("[EVEGPRODUCT#]", shownProducts[i].productID);
      var thisProduct = document.createElement("div");
      thisProduct.innerHTML = cardHTML;
      document.querySelector('.productList').appendChild(thisProduct.firstChild);
    }

  }
  document.querySelectorAll(".shop-product-details").forEach(function (element) {
    var field = element.getAttribute("data-field");
    var num = element.getAttribute("data-num");
    switch (field) {
      case "title":
        element.innerText = productDetails[num].name;
        break;
      case "img":
        element.innerHTML = "<span class=\"imgspacer\"></span><img src=\"images/" + productDetails[num].image + "\"></img>";
        break;
      case "price":
        element.innerHTML = "<span>£" + (productDetails[num].price / 100).toFixed(2) + "</span>";
        break;
      case "units":
        if (productDetails[num].units == "unit" && productDetails[num].packsize > 1) {
          // per x units
          element.innerHTML = "<span> per " + productDetails[num].packsize + " units</span>";
        } else if (productDetails[num].units == "pint" && productDetails[num].packsize > 1) {
          // per x pints
          element.innerHTML = "<span> per " + productDetails[num].packsize + " pints</span>";
        } else if (productDetails[num].units == "g" || productDetails[num].units == "kg") {
          // per 250g or 3kg (no space before unit)
          element.innerHTML = "<span> per " + productDetails[num].packsize + productDetails[num].units + "</span>";
        } else {
          // Default: per 1 unit
          element.innerHTML = "<span> per " + productDetails[num].packsize + " " + productDetails[num].units + "</span>";
        }
        break;
    }

  });
  resetListeners();
  updateQuantityInputs();
}

window.addEventListener("load", init);

function updateQuantityInputs() {
  for (let buyInput of document.querySelectorAll(".buyInput")) {
    let quantity = basket[buyInput.getAttribute("data-num")];
    if (isNaN(quantity))
      quantity = 0;

    buyInput.value = quantity;
  }
}

//Recalculate basket
function refreshBasket() {
  let total = 0;
  for (const productID in basket) {
    let quantity = basket[productID];
    let price = productDetails[productID].price;
    total = total + (price * quantity);
  }
  setCookie('basket', JSON.stringify(basket));
  try {
    document.querySelector("#basketNumTotal").innerHTML = (total / 100).toFixed(2);
  } catch (e) {

  }

  return total;
}

/** Sorting functions definition : Start*/
function sortHtoL() {
  sort_options = "HtoL";
  redraw();
}

function sortLtoH() {
  sort_options = "LtoH";
  redraw();
}

function sortAtoZ() {
  sort_options = "AtoZ";
  redraw();
}

function sortZtoA() {
  sort_options = "ZtoA";
  redraw();
}
/** Sorting functions definition : End*/


/** Filtering functions definition : Start*/
function filter_veg() {
  var checkBox_veg = document.getElementById("veg");
  if (checkBox_veg.checked == true) {
    filter_options_arr.push("veg");
  }
  else {
    var index = filter_options_arr.indexOf("veg");
    filter_options_arr.splice(index, 1);
  }
  redraw();
}

function filter_fruit() {
  var checkBox_veg = document.getElementById("fruit");
  if (checkBox_veg.checked == true) {
    filter_options_arr.push("fruit");
  }
  else {
    var index = filter_options_arr.indexOf("fruit");
    filter_options_arr.splice(index, 1);
  }
  redraw();
}

function filter_dairy() {
  var checkBox_veg = document.getElementById("dairy");
  if (checkBox_veg.checked == true) {
    filter_options_arr.push("dairy");
  }
  else {
    var index = filter_options_arr.indexOf("dairy");
    filter_options_arr.splice(index, 1);
  }
  redraw();
}

function filter_other() {
  var checkBox_veg = document.getElementById("other");
  if (checkBox_veg.checked == true) {
    filter_options_arr.push("other");
  }
  else {
    var index = filter_options_arr.indexOf("other");
    filter_options_arr.splice(index, 1);
  }
  redraw();
}
/** Filtering functions definition : Start*/


/** Logic to set the price range filter : Start*/
function price_range() {
  var max_price = document.getElementById("range_bar_1");
  filter_maxprice = max_price.value;
  redraw();
}
/** Logic to set the price range filter : End*/

/** Logic to find the maximun price product : Start*/
function max_price_find() {
  var temp_price = 0;
  for (var i = 0; i < productDetails.length; i++) {
    if (temp_price < productDetails[i].price) {
      temp_price = productDetails[i].price;
    }
  }
  filter_maxprice = temp_price + 100;
  var max_price_display = document.getElementById("max_value");
  max_price_display.innerHTML = "Max : £" + ((filter_maxprice / 100));
  var max_price = document.getElementById("range_bar_1");
  max_price.max = (filter_maxprice);
  /**calling function to find the maximun price product*/
  min_product_price();
}
/** Logic to find the maximun price product : End*/

/** Logic to find the minimum price product : Start*/
function min_product_price() {
  var temp_price = filter_maxprice;
  for (var i = 0; i < productDetails.length; i++) {
    if (temp_price > productDetails[i].price) {
      temp_price = productDetails[i].price;
    }
  }
  var min_price_display = document.getElementById("min_value");
  min_price_display.innerHTML = "Min : £" + ((temp_price / 100));
  var min_price = document.getElementById("range_bar_1");
  min_price.min = (temp_price);

  set_the_price_cursor();
}
/** Logic to find the maximun price product : End*/

/** Logic to set the price cursor at beginning : Start */
function set_the_price_cursor()
{
  var rangeBullet_intial = document.getElementById("rs-bullet");
  rangeBullet_intial.innerHTML = "£"+(filter_maxprice/100);
  var rangeSlider = document.getElementById("range_bar_1");
  var bulletPosition = Number(((rangeSlider.value - rangeSlider.min) * 100) / (rangeSlider.max - rangeSlider.min)); 
    rangeBullet.style.left = `calc(${bulletPosition}% + (${-8 - bulletPosition * 0.2}px))`;
}
/** Logic to set the price cursor at beginning : End */