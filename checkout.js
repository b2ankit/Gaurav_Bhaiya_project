let productDetails = {};
let creditCardShown = false;

/*
* When the page is loaded, initialise the products and reset the listeners
*/
function init(){
  //initProducts takes a callback function - when the products are loaded the basket will be recalculated
  initProducts(calculateBasket);
  resetListeners();
}

//When changing the page, you should make sure that each adjust button has exactly one click event
//(otherwise it might trigger multiple times)
function resetListeners(){
// document.getElementById("paycreditcard").removeEventListener("click",showCreditCardPage);
// document.getElementById("paycreditcard").addEventListener('click',showCreditCardPage);
    document.getElementById("backtoproductsbutton").removeEventListener("click",returnToProductsPage);
    document.getElementById("backtoproductsbutton").addEventListener('click',returnToProductsPage);
    document.getElementById("emptybasketbutton").removeEventListener("click",emptyBasket);
    document.getElementById("emptybasketbutton").addEventListener('click',emptyBasket);
}

//When the pay by credit card link is clicked, show the creditcard.html in an iframe
function showCreditCardPage(){
  if(!creditCardShown){
    var payIFrame = document.createElement("iframe");
    payIFrame.src = "creditcard.html";
    payIFrame.width = "50%";
  
    document.querySelector('#customerDetails').appendChild(payIFrame);
  }
}


function returnToProductsPage(){
  // when we go back to the products page we need to pass the basket object 
  // this was everything isnt deleted ??
  location.replace("index.html")
}
function emptyBasket(){
  basket = {}
  setCookie('basket', JSON.stringify(basket));
  location.replace("index.html")
}
/*
* Calculate the totals and show the basket
*/
function calculateBasket(){
  let total = 0;
  let numOfItems = 0;
  let basket;
  // need to assign a value to basket if cookie doesn't exist, otherwise we get an error and remainder of the code doesn't execute
  if (getCookie("basket") == "") basket = {};
  else basket = JSON.parse(getCookie("basket"));
  console.log("basket " + getCookie("basket"));
  document.querySelector('.checkoutList').innerHTML = '';

  // Create a title row with four headers, and add it to the checkoutList HTML element
  let titleRowHTML = '<tr><th>Item</th><th>Quantity</th><th>Price/unit</th><th>Totals</th></tr>';
  let titleRow = document.createElement("tr");
  titleRow.innerHTML = titleRowHTML;
  document.querySelector('.checkoutList').appendChild(titleRow);

  // For each item in the basket, create a row and add it to the checkout table
  for(const productID in basket){
    let quantity = basket[productID];
    numOfItems += quantity;
    let price = productDetails[productID].price;
    let productTotal = price * quantity;
    total = total + productTotal;

    let rowHTML = `<td>${productDetails[productID].name}</td><td>${quantity}</td><td>£${(price / 100).toFixed(2)}</td><td>£${(productTotal / 100).toFixed(2)}</td>`;
    var thisProduct = document.createElement("tr");
    thisProduct.innerHTML = rowHTML;
    document.querySelector('.checkoutList').appendChild(thisProduct);
  }

  // Add a price total row to the bottom of the table
  let rowHTML = `<td colspan="3">Total:</td><td>£${(total / 100).toFixed(2)}</td>`;
  var thisProduct = document.createElement("tr");
  thisProduct.innerHTML = rowHTML;
  document.querySelector('.checkoutList').appendChild(thisProduct);

  // Add 'You have x items in your basket' message to 'subtitle' div
  basketHTML = document.createElement("h3");
  basketHTML.innerHTML = "You have " + numOfItems.toString() + " items in your basket."
  document.querySelector('.subtitle').appendChild(basketHTML);
}

window.addEventListener("load", init);