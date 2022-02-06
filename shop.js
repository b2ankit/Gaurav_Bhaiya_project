let productDetails = {};
let searchStr = "";
let basket = {};
// filter and sorting variable intialisation start
let sort_options = "";
let filter_options = "";
let filter_maxprice = "";
// filter and sorting variable intialisation end

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
<input class="buyInput" data-num="[EVEGPRODUCT#]" min="0" value="0" type="number">
<button class="btn adjustUp">+</button>
<button class="addToBasket" disabled>Add to Basket</button></div>
</div></div></div>`;

function init() {
  const toggleButton = document.getElementsByClassName("toggle-button")[0];
  const hero = document.getElementsByClassName("hero")[0];
  const navbarLinks = document.getElementsByClassName("navbar-links")[0];

  //When the toggle button is pressed (if visible by the screen size, the menu is shown)
  toggleButton.addEventListener("click", () => {
    navbarLinks.classList.toggle("active");
    hero.classList.toggle("menuactive");
  });

  const searchBar = document.getElementsByClassName("search-bar")[0];
  //Show the search bar when the search link is pressed
  document.getElementById("search-link").addEventListener("click", () => {
    searchBar.classList.toggle("active");
    document.getElementById("searchbox").focus();
  });

  //Close the search bar
  document.getElementById("searchbutton").addEventListener("click", () => {
    searchStr = document.getElementById("searchbox").value;
    redraw();
  });

  //Updates the search as you type
  document.getElementById("searchbox").addEventListener("input", () => {
    searchStr = document.getElementById("searchbox").value;
    redraw();
  });

  //Close the search bar
  document.getElementById("closesearchbutton").addEventListener("click", () => {
    searchStr = "";
    document.getElementById("searchbox").value = "";
    searchBar.classList.remove("active");
    redraw();
  });

  //Close the cookies message
  document.getElementById("acceptCookies").addEventListener("click", () => {
    setCookie("cookieMessageSeen", true);
    document.getElementById("cookieMessage").style.display = "none";
  });

  if (getCookie("cookieMessageSeen") == "true") {
    document.getElementById("cookieMessage").style.display = "none";
  }
  initProducts(redraw);
  /** Searching for max price product to set the price range */
  max_price_find(productDetails);
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
  var thisID = ev.target.parentElement
    .closest(".card__content")
    .getAttribute("data-num");
  var input = ev.target.parentElement
    .closest(".shop-product-buying")
    .getElementsByTagName("input")[0];
  changeQuantity(thisID, input.value, ev);
}

/*
 * Change the quantity of the product with productID
 */
function changeQuantity(productID, newQuantity, ev) {
  // basket[productID] = newQuantity;
  // if(newQuantity == 0)
  //   delete basket[productID];
  document.querySelector(".buyInput[data-num='" + productID + "']").value =
    newQuantity;
  if (newQuantity > 0)
    ev.target
      .closest(`div`)
      .querySelector(`[class=addToBasket]`).disabled = false;
  else
    ev.target
      .closest(`div`)
      .querySelector(`[class=addToBasket]`).disabled = true;
  //refreshBasket();
}

//Add 1 to the quantity
function increment(ev) {
  var thisID = ev.target.parentElement
    .closest(".card__content")
    .getAttribute("data-num");
  // if(basket[thisID] === undefined){
  //   basket[thisID] = 0;
  // }
  var value = parseInt(
    document.querySelector(".buyInput[data-num='" + thisID + "']").value
  );
  if (!value) {
    value = 0;
  }
  changeQuantity(thisID, value + 1, ev);
}

//Subtract 1 from the quantity
function decrement(ev) {
  var thisID = ev.target.parentElement
    .closest(".card__content")
    .getAttribute("data-num");
  let currVal = parseInt(
    document.querySelector(".buyInput[data-num='" + thisID + "']").value
  );
  if (currVal > 0) {
    var value = parseInt(
      document.querySelector(".buyInput[data-num='" + thisID + "']").value
    );
    if (!value) {
      value = 0;
    }
    changeQuantity(thisID, value - 1, ev);
  }
  if (currVal <= 1) {
    ev.target
      .closest(`div`)
      .querySelector(`[class=addToBasket]`).disabled = true;
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
  var thisID = ev.target.parentElement
    .closest(".card__content")
    .getAttribute("data-num");
  if (basket[thisID])
    basket[thisID] =
      basket[thisID] +
      parseInt(
        document.querySelector(".buyInput[data-num='" + thisID + "']").value
      );
  else
    basket[thisID] = parseInt(
      document.querySelector(".buyInput[data-num='" + thisID + "']").value
    );
  refreshBasket();
  document.querySelector(".buyInput[data-num='" + thisID + "']").value = 0;

  // want to display the product added
  document.querySelector(".alert").innerHTML =
    '<h3>Added to Basket</h3><span class="imgspacer"></span><img src="images/' +
    imagesArr[thisID][2] +
    "\" height = '60' width = '80'></img> <h3>" +
    imagesArr[thisID][0] +
    "</h3><h3>Quantity: " +
    basket[thisID] +
    "</h3>";
  document.querySelector(".alert").style.visibility = "visible";
  setTimeout(function () {
    document.querySelector(".alert").style.visibility = "hidden";
  }, 2000);
  // want to update the no items in basket count
  numOfItems = 0;
  // counts the quantity of each item in basket
  for (const productID in basket) {
    let quantity = basket[productID];
    numOfItems += quantity;
  }
  // updates the html of the basket coutn circle
  document.querySelector(".itemCountCircle").innerHTML = numOfItems.toString();
  ev.target.closest(`div`).querySelector(`[class=addToBasket]`).disabled = true;
}

function filterFunction(a) {

  if(searchStr != "")
  {
    return a.name.toLowerCase().includes(searchStr.toLowerCase());
  }
    
  
  if(filter_options == "veg")
  {
    /** combination of price and type */
    if (a.price < parseInt(filter_maxprice) && a.type == "veg")
    {
      return true;
    }
  }
  else if(filter_options == "fruit")
  {
    /** combination of price and type */
    if (a.price < parseInt(filter_maxprice) && a.type == "fruit")
    {
      return true;
    }
  }
  else if(filter_options == "dairy")
  {
    /** combination of price and type */
    if (a.price < parseInt(filter_maxprice) && a.type == "dairy")
    {
      return true;
    }
  }
  else if(filter_options == "other")
  {
    /** combination of price and type */
    if (a.price < parseInt(filter_maxprice) && a.type == "other")
    {
      return true;
    }
  }
  else if(filter_options == "" && filter_maxprice !="")
  {
   
    if(a.price <parseInt(filter_maxprice))
    {
      return true;
    }
  }
  else if(filter_options == "all" && filter_maxprice !="")
  {
   
    if(a.price <parseInt(filter_maxprice))
    {
      return true;
    }
  }
  else
  {
    return true;
  }
}


// Fixed this so it now sorts by price
function sortFunction(a, b) {
  /** checking for global variable before sorting */
  if (sort_options == "HtoL") {
    /** Sorting the product by price High to Low*/
    return b.price - a.price;
  }
  else if (sort_options == "LtoH") {
    /** Sorting the product by price Low to High*/
    return a.price - b.price;
  }
  // else if (sort_options == "popular") {
  //   /** Sorting based on popularity */
  //   return a.name.toLowerCase().includes(searchStr.toLowerCase());
  // }
  else if (sort_options == "ZtoA") {
    /** Sorting the product by name Z to A*/
    if (a.name < b.name) {
      return 1;
    }
    if (a.name > b.name) {
      return -1;
    }
    return 0;
  }
  else {
    /** Sorting the product by name A to Z*/
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
  document.querySelector(".productList").innerHTML = "";

  var shownProducts = productDetails.filter(filterFunction);

  shownProducts.sort(sortFunction);

  var numProducts = shownProducts.length;

  if (numProducts == 0) {
    document.getElementById("searchreturn").innerHTML =
      "No products found for search term: '" + searchStr + "'";
  } else {
    document.getElementById("searchreturn").innerHTML = "";

    for (var i = 0; i < numProducts; i++) {
      var cardHTML = cardTemplate.replaceAll(
        "[EVEGPRODUCT#]",
        shownProducts[i].productID
      );
      var thisProduct = document.createElement("div");
      thisProduct.innerHTML = cardHTML;
      document
        .querySelector(".productList")
        .appendChild(thisProduct.firstChild);
    }
  }
  document
    .querySelectorAll(".shop-product-details")
    .forEach(function (element) {
      var field = element.getAttribute("data-field");
      var num = element.getAttribute("data-num");
      switch (field) {
        case "title":
          element.innerText = productDetails[num].name;
          break;
        case "img":
          element.innerHTML =
            '<span class="imgspacer"></span><img src="images/' +
            productDetails[num].image +
            '"></img>';
          break;
        case "price":
          element.innerHTML =
            "<span>£" +
            (productDetails[num].price / 100).toFixed(2) +
            "</span>";
          break;
        case "units":
          element.innerHTML =
            "<span> per " +
            productDetails[num].packsize +
            " " +
            productDetails[num].units +
            "</span>";
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
    if (isNaN(quantity)) quantity = 0;

    buyInput.value = quantity;
  }
}

//Recalculate basket
function refreshBasket() {
  let total = 0;
  for (const productID in basket) {
    let quantity = basket[productID];
    let price = productDetails[productID].price;
    total = total + price * quantity;
  }
  setCookie("basket", JSON.stringify(basket));
  try {
    document.querySelector("#basketNumTotal").innerHTML = (total / 100).toFixed(
      2
    );
  } catch (e) {}
  return total;
}
// sorting/filtering functions definition
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
// function sortpopular() {
//   sort_options = "popular"
//   redraw();
// }

function filter_all()
{
  filter_options = "all";
  redraw();
}

function filter_veg()
{
  filter_options = "veg";
  redraw();
}

function filter_fruit()
{
  filter_options = "fruit";
  redraw();
}

function filter_dairy()
{
  filter_options = "dairy";
  redraw();
}

function filter_other()
{
  filter_options = "other";
  redraw();
}

function price_range()
{
  var max_price = document.getElementById("range_bar_1");
  var max_price_display = document.getElementById("max_value");
  filter_maxprice = max_price.value;
  max_price_display.innerHTML = "Max : £"+ (filter_maxprice/100); 
  redraw();
}

function max_price_find()
{
  var temp_price = 0;
  for(var i = 0; i < productDetails.length; i++)
  {
    if(temp_price < productDetails[i].price)
    {
      temp_price = productDetails[i].price;
    }
  }
  filter_maxprice = temp_price+100;
  var max_price_display = document.getElementById("max_value");
  max_price_display.innerHTML = "Max : £"+ ((filter_maxprice/100));  
  var max_price = document.getElementById("range_bar_1");
  max_price.max =  (filter_maxprice+100);
}