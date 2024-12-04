$(document).ready(() => {
    $(".add-to-cart").on("click", addToCart);
})

function bla() {
    console.log("nanai");
}

function addToCart() {
    const user = $("#user");

    if (!user.length) {
        window.location.href = "/user/login";
        return;
    }
    const productid = $(this).data("id");
    const quantity = +$(`#quantity${productid}`).val() || 1;
    $.ajax({
        url: "/cart",
        type: "POST",
        data: {
            productid,
            quantity
        },
        success: function (result) {
            // console.log(result);
            $('#cart-badge').html(+$('#cart-badge').html() + quantity);
        }
    })
}

function updateCart(productid, quantity) {
    if (quantity == 0) {
        removeCartItem(productid);
    }
    else {
        updateCartItem(productid, quantity);
    }
}

function removeCartItem(productid) {
    $.ajax({
        url: "/cart",
        type: "DELETE",
        data: { productid },
        success: function (result) {
            // $('#cart-badge').html(result.totalQuantity);
            // $('#totalPrice').html('$' + result.totalPrice);
            // if (result.totalQuantity > 0) {
            //     $(`#item${productid}`).remove();
            // }
            // else {
            //     $('#cart-body').html(`<div class="alert alert-info text-center">Your cart is empty</div>`);
            // }
            if (!(+$('#cart-badge').html())) {
                $('#cart-body').html(`<div class="alert alert-info text-center">Your cart is empty</div>`);
            }
            $(`#item${productid}`).remove();
        }
    })
}
function updateCartItem(productid, quantity) {
    $.ajax({
        url: "/cart",
        type: "PUT",
        data: { productid, quantity },
        success: function (result) {
            // $('#cart-badge').html(result.totalQuantity);
            // $('#totalPrice').html('$' + result.totalPrice);
            // $(`#price${productid}`).html('$' + result.item.price);
        }
    })
}