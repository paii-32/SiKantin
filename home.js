// slider dekstop

const slides = document.querySelector(".slides");
const dots = document.querySelectorAll(".dot");

let index = 0;

function showSlide() {

    if (!slides) return;

    slides.style.transform =
    `translateX(-${index * 100}%)`;

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    if (dots[index]) {
        dots[index].classList.add("active");
    }

}

if (slides && dots.length > 0) {

    setInterval(() => {

        index++;

        if (index >= dots.length) {
            index = 0;
        }

        showSlide();

    }, 3000);

}


// slider mobile

const slidesMobile =
document.querySelector(".slides-mobile");

const dotsMobile =
document.querySelectorAll(".dot-mobile");

let mobileIndex = 0;

function showMobileSlide() {

    if (!slidesMobile) return;

    slidesMobile.style.transform =
    `translateX(-${mobileIndex * 100}%)`;

    dotsMobile.forEach(dot => {
        dot.classList.remove("active");
    });

    if (dotsMobile[mobileIndex]) {
        dotsMobile[mobileIndex]
        .classList.add("active");
    }

}

if (
    slidesMobile &&
    dotsMobile.length > 0
) {

    setInterval(() => {

        mobileIndex++;

        if (
            mobileIndex >=
            dotsMobile.length
        ) {
            mobileIndex = 0;
        }

        showMobileSlide();

    }, 3000);

}


// search menu

const searchInputs =
document.querySelectorAll(".search-menu");

searchInputs.forEach(input => {

    input.addEventListener(
        "input",
        () => {

            const keyword =
            input.value
            .toLowerCase();

            searchInputs.forEach(other => {

                if(other !== input){
                    other.value =
                    input.value;
                }

            });

            const cards =
            document.querySelectorAll(
                ".card-menu"
            );

            cards.forEach(card => {

                const nama =
                card.querySelector(
                    ".nama-menu"
                )
                .innerText
                .toLowerCase();

                card.style.display =
                nama.includes(keyword)
                ? ""
                : "none";

            });

        }
    );

    input.addEventListener(
        "keydown",
        (e) => {

            if (
                e.key === "Enter"
            ) {

                document
                .getElementById("menu")
                ?.scrollIntoView({

                    behavior:
                    "smooth",

                    block:
                    "start"

                });

            }

        }
    );

});



// sidebar activ

const sections =
document.querySelectorAll(
    "#home, #menu"
);

const navLinks =
document.querySelectorAll(
    ".card-side"
);

window.addEventListener(
    "scroll",
    () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop =
            section.offsetTop - 120;

            const sectionHeight =
            section.clientHeight;

            if (
                scrollY >= sectionTop &&
                scrollY <
                sectionTop +
                sectionHeight
            ) {

                current =
                section.getAttribute(
                    "id"
                );

            }

        });

        navLinks.forEach(link => {

            link.classList.remove(
                "active"
            );

            const a =
            link.querySelector("a");

            if (
                a &&
                a.getAttribute("href")
                === `#${current}`
            ) {

                link.classList.add(
                    "active"
                );

            }

        });

    }
);