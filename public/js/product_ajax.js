const templateProduct = `    
    {{#each products}}
    <div class="col-lg-4 col-md-6 col-sm-12 pb-1">
        <a href="/products/{{productid}}">
            <div class="card product-item border-0 mb-4">
                <div
                    class="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                    <img class="img-fluid w-100" src="{{imagepath}}" alt="">
                </div>
                <div class="card-body border-left border-right text-center p-0 pt-4 pb-3">
                    <h6 class="text-truncate mb-3">{{name}}</h6>
                    <div class="d-flex justify-content-center">
                        <h6>$ {{price}}</h6>
                        {{!-- <h6 class="text-muted ml-2"><del>$ {{oldprice}}</del></h6> --}}
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between bg-light border">
                    <a href="/products/{{productid}}" class="btn btn-sm text-dark p-0"><i
                            class="fas fa-eye text-primary mr-1"></i>View
                        Detail</a>
                    <button class="btn btn-sm text-dark p-0 add-to-cart" data-id="{{productid}}"><i
                            class="fas fa-shopping-cart text-primary mr-1"></i>Add To Cart</button>
                </div>
            </div>
        </a>
    </div>
    {{/each}}


    <!-- Pagination -->
    <div class="col-12 pb-1">
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center mb-3">
                <!-- Previous Page -->
                <li class="page-item {{#unless prevPage}}disabled{{/unless}}">
                    <a class="page-link" href="?{{#if ../query}}{{../query}}&{{/if}}page={{prevPage}}"
                        aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                    </a>
                </li>

                {{#if (lte totalPages 7)}}
                {{#for 1 totalPages}}
                <li class="page-item {{#if (eq this ../curPage)}}active{{/if}}"><a class="page-link"
                        href="?{{#if ../query}}{{../query}}&{{/if}}page={{this}}">{{this}}
                    </a></li>
                {{/for}}
                {{/if}}


                {{#if (gte totalPages 8)}}
                {{#if (lte curPage 4)}}
                {{#for 1 5}}
                <li class="page-item {{#if (eq this ../curPage)}}active{{/if}}"><a class="page-link"
                        href="?{{#if ../query}}{{../query}}&{{/if}}page={{this}}">{{this}}
                    </a></li>
                {{/for}}
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
                <li class="page-item"><a class="page-link"
                        href="?{{#if ../query}}{{../query}}&{{/if}}page={{totalPages}}">{{totalPages}}
                    </a></li>
                {{/if}}

                {{#if (gte curPage (subtract totalPages 3))}}
                <li class="page-item"><a class="page-link"
                        href="?{{#if ../query}}{{../query}}&{{/if}}page=1">1
                    </a></li>
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
                {{#for (subtract totalPages 4) totalPages}}
                <li class="page-item {{#if (eq this ../curPage)}}active{{/if}}"><a class="page-link"
                        href="?{{#if ../query}}{{../query}}&{{/if}}page={{this}}">{{this}}
                    </a></li>
                {{/for}}
                {{/if}}

                {{#if (inRange curPage 5 (subtract totalPages 4))}}
                <li class="page-item"><a class="page-link"
                        href="?{{#if ../query}}{{../query}}&{{/if}}page=1">1
                    </a></li>
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
                {{#for (subtract curPage 1) (add curPage 1)}}
                <li class="page-item {{#if (eq this ../curPage)}}active{{/if}}"><a class="page-link"
                        href="?{{#if ../query}}{{../query}}&{{/if}}page={{this}}">{{this}}
                    </a></li>
                {{/for}}
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
                <li class="page-item"><a class="page-link"
                        href="?{{#if ../query}}{{../query}}&{{/if}}page={{totalPages}}">{{totalPages}}
                    </a></li>
                {{/if}}

                {{/if}}

                <!-- Next Page -->
                <li class="page-item {{#unless nextPage}}disabled{{/unless}}">
                    <a class="page-link" href="?{{#if ../query}}{{../query}}&{{/if}}page={{nextPage}}"
                        aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
`

function loadProducts(url) {
    fetch(`/api/products${url}`)
        .then((response)=> response.json())
        .then((data)=>{
            const products=document.getElementById("products");
            const template = Handlebars.compile(templateProduct);
            const html = template(data);
            products.innerHTML = html;
            history.pushState({}, "", url);
            eventPage();
        })
}
const eventPage = () => {
    document.querySelectorAll(".page-link").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const newURL = this.getAttribute("href");
            loadProducts(newURL);
        })
    })
}
eventPage();