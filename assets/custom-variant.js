// assets/custom-variant.js

document.addEventListener('DOMContentLoaded', function () {
    var value = "";
    const contentDivs = document.querySelectorAll('div[data-content]');
    document.querySelectorAll('.variant__button-label').forEach(function (label) {
        label.addEventListener('click', function () {
            value = label.id || label.textContent.trim();
        });
    });
    for (let i = 0; i < contentDivs.length; i++) {
        console.log(contentDivs[i].dataset.content, "==========>", value);
        if (contentDivs[i].dataset.content == value) {
            contentDivs[i].style.display = "block";
        } else {
            contentDivs[i].style.display = "none";
        }
    }
});
