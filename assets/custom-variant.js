document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('fieldset.variant-input-wrap .variant-input input');

    inputs.forEach(input => {
        input.addEventListener("change", function () {
            var metafieldValue = this.dataset.variantMetafield;

            let metafieldTabs = document.querySelectorAll(".product-single__meta .product-block--tab.use-variant-metafield");

            metafieldTabs.forEach(el => {
                let content = el.querySelector(".collapsible-content .collapsible-content__inner");
                content.textContent = metafieldValue;
            })
        })
    })
});
