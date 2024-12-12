$(document).ready(() => {
    $(".add-to-cart").on("click", addToCart);
})


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
            alert("Thêm đơn hàng thành công");
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
            console.log(+$('#cart-badge').html());
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
           
        }
    })
}