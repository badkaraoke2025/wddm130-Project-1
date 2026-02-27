// Project 1 - Mini Online Store (Client-Side Only)
// Joseph Collin Richard (n01773477)

var productNames = [
    "Humber Hoodie",
    "Campus Mug",
    "Notebook Pack",
    "USB Drive 64GB",
    "Wireless Mouse",
    "Water Bottle",
    "Desk Lamp",
    "Backpack"
];

var productPrices = [49.99, 12.99, 8.50, 14.99, 19.99, 16.00, 24.50, 39.99];

// Product images (open-source photos from Unsplash - free to use)
var productImages = [
    "images/product1.svg",
    "images/product2.svg",
    "images/product3.svg",
    "images/product4.svg",
    "images/product5.svg",
    "images/product6.svg",
    "images/product7.svg",
    "images/product8.svg"
];

var cartQty = [0,0,0,0,0,0,0,0];

var currentOrder = [];

function resetOrder()
{
    currentOrder = [];
    for (var i = 0; i < productNames.length; i++)
        currentOrder.push(i);
}

// Numeric sort helper (Week 6A style)
function sortNumber(a, b)
{
    return a - b;
}

function applySort()
{
    var mode = document.getElementById("sortProducts").value;

    resetOrder();

    if (mode == "priceAsc")
    {
        currentOrder.sort(function(a, b){ return sortNumber(productPrices[a], productPrices[b]); });
    }
    else if (mode == "priceDesc")
    {
        currentOrder.sort(function(a, b){ return sortNumber(productPrices[b], productPrices[a]); });
    }
    else if (mode == "nameAsc")
    {
        currentOrder.sort(function(a, b){
            var A = productNames[a].toLowerCase();
            var B = productNames[b].toLowerCase();
            if (A < B) return -1;
            if (A > B) return 1;
            return 0;
        });
    }
    else if (mode == "nameDesc")
    {
        currentOrder.sort(function(a, b){
            var A = productNames[a].toLowerCase();
            var B = productNames[b].toLowerCase();
            if (A < B) return 1;
            if (A > B) return -1;
            return 0;
        });
    }

    buildProducts();
    updateCart();
}


function formatMoney(num)
{
    return "$" + num.toFixed(2);
}

function buildProducts()
{
    var out = "";

    for (var i = 0; i < currentOrder.length; i++)
    {
        var j = currentOrder[i];
        out += "<div class='product'>";
        out += "<img src='" + productImages[j] + "' alt='" + productNames[j] + "'>";
        out += "<strong>" + productNames[j] + "</strong><br>";
        out += "<span class='small'>Price: " + formatMoney(productPrices[j]) + "</span><br>";
        out += "<label for='qty" + j + "'>Quantity</label>";
        out += "<input type='number' id='qty" + j + "' min='0' value='0' onchange='updateCart();'>";
        out += "</div>";
    }

    document.getElementById("productsArea").innerHTML = out;
}

function updateCart()
{
    var subTotal = 0;
    var cartOut = "";
    var hasItems = false;

    cartOut += "<table>";
    cartOut += "<tr><th>Item</th><th>Qty</th><th>Unit</th><th>Line Total</th></tr>";

    for (var i = 0; i < productNames.length; i++)
    {
        var qtyStr = document.getElementById("qty" + i).value;
        var qty = parseInt(qtyStr, 10);

        if (isNaN(qty) || qty < 0)
            qty = 0;

        cartQty[i] = qty;

        if (qty > 0)
        {
            hasItems = true;
            var lineTotal = qty * productPrices[i];
            subTotal += lineTotal;

            cartOut += "<tr>";
            cartOut += "<td>" + productNames[i] + "</td>";
            cartOut += "<td>" + qty + "</td>";
            cartOut += "<td>" + formatMoney(productPrices[i]) + "</td>";
            cartOut += "<td>" + formatMoney(lineTotal) + "</td>";
            cartOut += "</tr>";
        }
    }

    cartOut += "</table>";

    var tax = subTotal * 0.13;
    var total = subTotal + tax;

    if (!hasItems)
    {
        document.getElementById("cartArea").innerHTML = "Cart is empty.";
    }
    else
    {
        cartOut += "<p><strong>Subtotal:</strong> " + formatMoney(subTotal) + "<br>";
        cartOut += "<strong>HST (13%):</strong> " + formatMoney(tax) + "<br>";
        cartOut += "<strong>Total:</strong> " + formatMoney(total) + "</p>";

        document.getElementById("cartArea").innerHTML = cartOut;
    }

    document.getElementById("receiptPanel").style.display = "none";
    document.getElementById("receiptArea").innerHTML = "";
    document.getElementById("messageArea").innerHTML = "";
}

function cartIsEmpty()
{
    for (var i = 0; i < cartQty.length; i++)
    {
        if (cartQty[i] > 0)
            return false;
    }
    return true;
}

function validateForm()
{
    var errors = "";

    var name = document.getElementById("fullName").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var address = document.getElementById("address").value.trim();
    var city = document.getElementById("city").value.trim();
    var prov = document.getElementById("province").value;
    var postal = document.getElementById("postal").value.trim().toUpperCase();

    if (cartIsEmpty())
        errors += "<li>Cart must not be empty.</li>";

    if (name == "")
        errors += "<li>Name must not be empty.</li>";

    if (email.indexOf("@") == -1 || email.indexOf(".") == -1)
        errors += "<li>Email must contain '@' and '.'.</li>";

    // Phone: must contain 10 digits
var rePhone = /^\(?(\d{3})\)?[\.\-\/\s]?(\d{3})[\.\-\/\s]?(\d{4})$/;

if (!rePhone.test(phone))
    errors += "<li>Phone number must contain 10 digits.</li>";

    if (address == "")
        errors += "<li>Address is required.</li>";

    if (city == "")
        errors += "<li>City is required.</li>";

    if (prov == "")
        errors += "<li>Province is required.</li>";

    // Postal code: A1A 1A1 or A1A1A1
    var rePostal = /^[A-Z][0-9][A-Z]\s?[0-9][A-Z][0-9]$/;
    if (!rePostal.test(postal))
        errors += "<li>Postal code must be Canadian format (A1A 1A1).</li>";

    if (errors != "")
        return "<ul>" + errors + "</ul>";
    else
        return "";
}

function buildReceipt()
{
    var subTotal = 0;
    var itemsOut = "";
    var receiptNo = Math.floor(Math.random() * 900000) + 100000;

    itemsOut += "<table>";
    itemsOut += "<tr><th>Item</th><th>Qty</th><th>Unit</th><th>Line Total</th></tr>";

    for (var i = 0; i < productNames.length; i++)
    {
        if (cartQty[i] > 0)
        {
            var lineTotal = cartQty[i] * productPrices[i];
            subTotal += lineTotal;

            itemsOut += "<tr>";
            itemsOut += "<td>" + productNames[i] + "</td>";
            itemsOut += "<td>" + cartQty[i] + "</td>";
            itemsOut += "<td>" + formatMoney(productPrices[i]) + "</td>";
            itemsOut += "<td>" + formatMoney(lineTotal) + "</td>";
            itemsOut += "</tr>";
        }
    }

    itemsOut += "</table>";

    var tax = subTotal * 0.13;
    var total = subTotal + tax;

    var now = new Date();
    var dateTime = now.toLocaleString();

    var name = document.getElementById("fullName").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var address = document.getElementById("address").value.trim();
    var city = document.getElementById("city").value.trim();
    var prov = document.getElementById("province").value;
    var postal = document.getElementById("postal").value.trim().toUpperCase();

    var out = "";
    out += "<p><strong>Receipt #:</strong> " + receiptNo + "<br>";
    out += "<strong>Date/Time:</strong> " + dateTime + "</p>";

    out += "<p><strong>Customer:</strong><br>";
    out += name + "<br>";
    out += email + "<br>";
    out += phone + "<br>";
    out += address + "<br>";
    out += city + ", " + prov + " " + postal + "</p>";

    out += "<h3>Items</h3>";
    out += itemsOut;

    out += "<p><strong>Subtotal:</strong> " + formatMoney(subTotal) + "<br>";
    out += "<strong>HST (13%):</strong> " + formatMoney(tax) + "<br>";
    out += "<strong>Total:</strong> " + formatMoney(total) + "</p>";

    out += "<p class='ok'><strong>Checkout complete.</strong> Thank you for your order.</p>";

    return out;
}

function checkout()
{
    var errors = validateForm();

    if (errors != "")
    {
        document.getElementById("messageArea").innerHTML = "<div class='error'>Please fix the following:</div>" + errors;
        document.getElementById("receiptPanel").style.display = "none";
        document.getElementById("receiptArea").innerHTML = "";
        return;
    }

    document.getElementById("messageArea").innerHTML = "<div class='ok'>Looks good. Receipt generated below.</div>";
    document.getElementById("receiptArea").innerHTML = buildReceipt();
    document.getElementById("receiptPanel").style.display = "block";
}

window.onload = function()
{
    resetOrder();
    buildProducts();
    updateCart();
};
