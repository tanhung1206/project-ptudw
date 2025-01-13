// /* eslint-disable no-undef */
// const buttonContainer = document.getElementById("button-container");
// const embeddedPaymentContainer = document.getElementById("embeded-payment-container");
// let isOpen = false;
// let config = {
//     RETURN_URL: window.location.origin,
//     ELEMENT_ID: "embeded-payment-container",
//     CHECKOUT_URL: "",
//     embedded: true,
//     onSuccess: (event) => {
//         embeddedPaymentContainer.innerHTML = `
//         <div style="padding-top: 20px; padding-bottom:20px">
//             Thanh toan thanh cong
//         </div>
//     `;
//         buttonContainer.innerHTML = `
//         <button
//             type="submit"
//             id="create-payment-link-btn"
//             style="
//             width: 100%;
//             background-color: blue;
//             color: white;
//             border: none;
//             padding: 10px;
//             font-size: 15px;
//             "
//         >
//             Quay lại trang thanh toán
//         </button>
//     `;
//     },
// };
// buttonContainer.addEventListener("click", async (event) => {
//     if (isOpen) {
//         const { exit } = PayOSCheckout.usePayOS(config);
//         exit();
//         embeddedPaymentContainer.innerHTML = `
//         <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
//         <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
//         <p><strong>Số lượng:</strong> 1</p>
//     `;
//     } else {
//         const checkoutUrl = await getPaymentLink();
//         config = {
//             ...config,
//             CHECKOUT_URL: checkoutUrl,
//         };
//         const { open } = PayOSCheckout.usePayOS(config);
//         open();
//     }
//     isOpen = !isOpen;
//     changeButton();
// });

// const getPaymentLink = async () => {
//     const response = await fetch(
//         "http://localhost:3030/payment/create-payment-link",
//         {
//             method: "POST",
//         }
//     );
//     if (!response.ok) {
//         console.log("server doesn't response!");
//     }
//     const result = await response.json();
//     return result.checkoutUrl;
// };

// const changeButton = () => {
//     if (isOpen) {
//         buttonContainer.innerHTML = `
//         <button
//             type="submit"
//             id="create-payment-link-btn"
//             style="
//             width: 100%;
//             background-color: gray;
//             color: white;
//             border: none;
//             padding: 10px;
//             font-size: 15px;
//             "
//         >
//             Đóng link thanh toán
//         </button>
//       `;
//     } else {
//         buttonContainer.innerHTML = `
//         <button
//             type="submit"
//             id="create-payment-link-btn"
//             style="
//                 width: 100%;
//                 background-color: blue;
//                 color: white;
//                 border: none;
//                 padding: 10px;
//                 font-size: 15px;
//             "
//             >
//             Tạo Link thanh toán
//         </button>
//     `;
//     }
// };