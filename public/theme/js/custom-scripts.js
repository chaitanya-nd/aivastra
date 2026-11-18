    // Function to open the floating menu
const floatingMenu = () => {
    document.getElementById('floatingMenu').classList.add('openMenu');
};
document.addEventListener('DOMContentLoaded', function () {
    const closeButtons = document.querySelectorAll('#cloaseFloatingMenu, #cloaseFloatingMenu2');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('floatingMenu').classList.remove('openMenu');
        });
    });
    const menuTriggers = document.querySelectorAll('.stickyshowhide, .showhide');
    menuTriggers.forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            floatingMenu();
        });
    });
    const menuItemsWithChildren = document.querySelectorAll('.sticky-mobinav .menu-item-has-children');
    menuItemsWithChildren.forEach(item => {
        const dropLink = document.createElement('a');
        dropLink.className = 'drop close';
        dropLink.href = 'javascript:void(0)';
        item.appendChild(dropLink);
    });
    const subMenus = document.querySelectorAll('.sticky-mobinav .menu-item-has-children ul.sub-menu');
    subMenus.forEach(subMenu => {
        subMenu.style.display = 'none';
    });
});
document.addEventListener('click', function (event) {
    if (event.target.matches('.sticky-mobinav .menu-item-has-children a.drop')) {
        event.preventDefault();
        const clickedLink = event.target;
        const menuItem = clickedLink.closest('.menu-item');
        const submenu = menuItem.querySelector('.sub-menu');
        if (submenu) {
            if (submenu.style.display === 'block') {
                submenu.style.display = 'none';
            } else {
                submenu.style.display = 'block';
            }
        }
        const siblingItems = menuItem.parentElement.querySelectorAll('.menu-item');
        siblingItems.forEach(item => {
            if (item !== menuItem) {
                const siblingSubmenu = item.querySelector('.sub-menu');
                const siblingLink = item.querySelector('a.drop');
                if (siblingSubmenu) {
                    siblingSubmenu.style.display = 'none';
                }
                if (siblingLink) {
                    siblingLink.classList.remove('open');
                    siblingLink.classList.add('close');
                }
            }
        });
        if (clickedLink.classList.contains('close')) {
            clickedLink.classList.remove('close');
            clickedLink.classList.add('open');
        } else {
            clickedLink.classList.remove('open');
            clickedLink.classList.add('close');
        }
    }
});
const header = document.querySelector(".site-header");
const toggleClass = "is-sticky";
const fadingOutClass = "is-fading-out";
let lastScroll = window.pageYOffset;
function shouldApplySticky() {
    return window.innerWidth > 991;
}
window.addEventListener("scroll", () => {
    if (!shouldApplySticky()) return;

    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 250) {
        header.classList.remove(fadingOutClass);
        header.classList.add(toggleClass);
    } else if (
        currentScroll < lastScroll &&
        currentScroll < 600 &&
        header.classList.contains(toggleClass)
    ) {
        header.classList.add(fadingOutClass);
        setTimeout(() => {
            header.classList.remove(toggleClass);
            header.classList.remove(fadingOutClass);
        }, 300);
    }
    lastScroll = currentScroll;
});
window.addEventListener("resize", () => {
    if (!shouldApplySticky()) {
        header.classList.remove(toggleClass, fadingOutClass);
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const trigger = document.querySelector(".disclaimer-trigger");
    const popup = document.getElementById("disclaimer-container");
    if (trigger && popup) {
        trigger.addEventListener("click", function (e) {
            e.preventDefault();
            popup.classList.toggle("show");
        });
        document.addEventListener("click", function (e) {
            if (!popup.contains(e.target) && e.target !== trigger) {
                popup.classList.remove("show");
            }
        });
    }
jQuery(".hm-form a.popup").click(function(){
     jQuery(".hm-form span.popuptext").toggleClass("show");
});
jQuery('input[type="email"]').bind("cut copy paste", function (e) { e.preventDefault(); });
jQuery('#input_2_3').bind("cut copy paste", function (e) { e.preventDefault(); });
});
document.addEventListener("DOMContentLoaded", function() {
  const widgets = document.querySelectorAll(".checked_by");

  widgets.forEach(widget => {
    const name = widget.querySelector(".widget-names");
    const description = widget.querySelector(".widget-description");

    name.addEventListener("click", function() {
      name.classList.toggle("nameactive");
      description.classList.toggle("active");
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.sidebar-menu-pa .menu-item-has-children');
 
    menuItems.forEach(item => {
        const dropToggle = document.createElement('div');
        dropToggle.className = 'drop close';
        dropToggle.setAttribute('role', 'button');
        dropToggle.setAttribute('tabindex', '0');
        item.appendChild(dropToggle);
        const submenu = item.querySelector('ul.sub-menu');
        if (submenu) {
            submenu.style.maxHeight = '0';
            submenu.style.overflow = 'hidden';
            submenu.style.transition = 'max-height 0.3s ease';
            dropToggle.addEventListener('click', () => {
                const isOpen = submenu.classList.contains('open');
                if (isOpen) {
                    submenu.style.maxHeight = submenu.scrollHeight + 'px';
                    submenu.offsetHeight; // force reflow
                    submenu.style.maxHeight = '0';
                    submenu.classList.remove('open');
                    dropToggle.classList.remove('open');
                    dropToggle.classList.add('close');
                } else {
                    submenu.style.maxHeight = submenu.scrollHeight + 'px';
                    submenu.classList.add('open');
                    dropToggle.classList.remove('close');
                    dropToggle.classList.add('open');
                }
            });
            submenu.addEventListener('transitionend', () => {
                if (submenu.classList.contains('open')) {
                    submenu.style.maxHeight = 'none';
                }
            });
        }
    });
    const mountIfExists = (selector, options = {}, extensions = null) => {
        const el = document.querySelector(selector);
        if (el && typeof Splide !== 'undefined') {
            try {
                const splide = new Splide(el, options);
                splide.mount(extensions || {});
            } catch (e) {
                console.error(`Failed to mount Splide on ${selector}:`, e);
            }
    }
    };
    const splideExtensions = typeof Splide !== 'undefined' && Splide.Extensions ? Splide.Extensions : undefined;
    mountIfExists('#sidebar-reviews', {
        type: 'loop',
        perPage: 1,
        perMove: 1,
        autoplay: true,
        interval: 3000,
        speed: 3500,
        autoHeight:true
    });
});
jQuery(document).ready(function($) {
    $('.hm-banner-sec-lst').owlCarousel({
        items: 1,
        loop: true,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        smartSpeed: 1000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn'
    });
});


jQuery(document).ready(function ($) {
    $('.checked-left').on('click', function () {
        $(this).siblings('.widget-description').toggleClass('fact-active');
    });
    const headers = document.querySelectorAll('.accordion-profile');
    const contents = document.querySelectorAll('.accordion-profile-content');
    if (headers.length) {
        headers[0].classList.add('active');
        contents[0].style.maxHeight = contents[0].scrollHeight + 'px';
        headers.forEach(header => {
            header.addEventListener('click', function () {
                if (this.classList.contains('active')) {
                    return;
                }
                headers.forEach(h => h.classList.remove('active'));
                contents.forEach(c => c.style.maxHeight = null);
                this.classList.add('active');
                const content = this.nextElementSibling;
                content.style.maxHeight = content.scrollHeight + 'px';
            });
        });
    }
});
  jQuery('.srcshow').click(function () {
        jQuery(".srcbox").animate({'width': '100%'}, 500);
    });
    jQuery('.close_search').click(function () {
        jQuery(".srcbox").animate({'width': '0'}, 500);
    });
        jQuery('.tabs a').click(
            function(){
                var parentId = jQuery(this).closest('li').prop('id');
                jQuery('ul.tabs li').removeClass('selected');
                jQuery('.cont').css('display','none');
                jQuery('#'+parentId).addClass('selected');
                jQuery('.'+parentId).css('display','block');
            }
        )
const items = document.querySelectorAll(".hm-create-ready-category");
let current = 0;
let direction = 1; // 1 = forward, -1 = backward
function changeActive(index) {
    if (!items.length) return;
    items.forEach(item => item.classList.remove("active"));
    items[index].classList.add("active");
}
setInterval(() => {
    current += direction;
    if (current === items.length - 1) {
        direction = -1;
    }
    if (current === 0) {
        direction = 1;
    }
    changeActive(current);
}, 3000);

document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popupForm");
    if (!popup) return;
    document.addEventListener("click", function(e) {
        if (e.target && e.target.id === "popupbtn") {
            e.preventDefault();
            popup.style.display = "flex";
        }
        if (e.target && e.target.classList.contains("close-popup")) {
            popup.style.display = "none";
        }
    });
    popup.addEventListener("click", function(e) {
        if (e.target === popup) {
            popup.style.display = "none";
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const copyBtn = document.querySelector(".copy-btn");
    if (!copyBtn) return;
    copyBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const link = this.getAttribute("data-link");
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(link)
                .then(() => {
                    alert("Link Copied!");
                })
                .catch(err => {
                    console.log(err);
                });

        } else {
            const textArea = document.createElement("textarea");
            textArea.value = link;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                alert("Link Copied!");
            } catch (err) {
                alert("Copy Failed!");
            }
            document.body.removeChild(textArea);
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", function () {

            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove("active"));

            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove("show"));

            // Add active class to clicked button
            this.classList.add("active");

            // Show selected tab content
            const targetTab = this.getAttribute("data-tab");
            const targetContent = document.getElementById(targetTab);

            if (targetContent) {
                targetContent.classList.add("show");
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".vastra-tabs .pricing");
    const tabPanels = document.querySelectorAll(".vastra-tab-panel");

    tabButtons.forEach(button => {
        button.addEventListener("click", function () {

            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove("active"));

            // Hide all panels
            tabPanels.forEach(panel => {
                panel.style.display = "none";
            });

            // Activate clicked button
            this.classList.add("active");

            // Show corresponding panel
            const targetPanel = document.getElementById(this.dataset.tab);
            if (targetPanel) {
                targetPanel.style.display = "block";
            }
        });
    });

    // Initial state
    tabPanels.forEach(panel => {
        panel.style.display = "none";
    });

    const activeButton = document.querySelector(".vastra-tabs .pricing.active");
    if (activeButton) {
        document.getElementById(activeButton.dataset.tab).style.display = "block";
    }
});

document.addEventListener('wpcf7mailsent', function (event) {

    const wrapper = event.target.closest('.popup-box');

    wrapper.querySelector('.cf7-wrapper').innerHTML = `
        <div class="custom-success">
            <h2>Thank You!</h2>
            <p>Your enquiry has been submitted successfully.</p>
            <p>Our experts will contact you shortly.</p>

            <button class="close-popup-btn">Continue Browsing</button>
        </div>
    `;

});



document.addEventListener("DOMContentLoaded", function () {

    const counters = [
        { id: "10x", target: 10, suffix: "x" },
        { id: "80", target: 80, suffix: "%" },
        { id: "100", target: 100, suffix: "%" }
    ];

    const duration = 3000; // Animation duration in milliseconds

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                counters.forEach(counter => {
                    const element = document.getElementById(counter.id);

                    if (!element || element.dataset.animated) return;

                    element.dataset.animated = "true";

                    let startTime = null;

                    function animateCounter(timestamp) {
                        if (!startTime) startTime = timestamp;

                        const progress = Math.min(
                            (timestamp - startTime) / duration, 1
                        );

                        const currentValue = Math.floor(
                            progress * counter.target
                        );

                        element.textContent = currentValue + counter.suffix;

                        if (progress < 1) {
                            requestAnimationFrame(animateCounter);
                        } else {
                            element.textContent = counter.target + counter.suffix;
                        }
                    }

                    requestAnimationFrame(animateCounter);
                });

                observer.disconnect();
            }
        });
    }, {
        threshold: 0.3
    });

    const section = document.querySelector(".hm-brand-choose-sec");

    if (section) {
        observer.observe(section);
    }

});
