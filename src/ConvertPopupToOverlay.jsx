/* eslint-disable no-unused-expressions */
import "./ui/ConvertPopupToOverlay.css";
import { createElement, useEffect, useState } from "react";

export default function ConvertPopupToOverlay({
    closeButtonClass,
    closeByAttribute,
    closePage,
    position,
    size,
    showHeader
}) {
    const [canRender, setCanRender] = useState(false);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        if (document.querySelector(".convert-popup-to-overlay")) {
            // old popup?
            if (document.querySelector(".popup-overlay")) {
                // closeModal();
                console.info("close old modal!!!");
            }

            setModal(document.querySelector(".convert-popup-to-overlay").closest(".modal-dialog"));
            setCanRender(true);
        }
    });

    if (canRender) {
        function AnimateCloseModal() {
            const underlay = document.querySelector(".popup-underlay");
            const modal = document.querySelector(".popup-overlay");
            modal.classList.remove("visible");
            underlay && underlay.classList.remove("visible");
            document.body.classList.remove("popup-overlay-noscroll");
            setTimeout(() => underlay && underlay.remove(), 300);
        }

        function closeModal() {
            const modal = document.querySelector(".popup-overlay");
            const closeBtn = modal.querySelector(".close");
            AnimateCloseModal();
            closePage === true && setTimeout(() => closeBtn.click(), 300);
        }

        function generateUnderlay() {
            if (!document.querySelector(".popup-underlay.old")) {
                modal.parentNode.insertAdjacentHTML("beforeend", '<div class="popup-underlay"></div>');
                const underlay = document.querySelector(".popup-underlay:not(.old)");
                underlay.addEventListener("click", closeModal);
                underlay.classList.add("old");
            }
        }

        function generateCloseBtn() {
            // overlay for the default close button
            if (showHeader === true && closePage === true) {
                const modalContent = modal.querySelector(".modal-content");
                modalContent.insertAdjacentHTML(
                    "afterbegin",
                    `<div class="popup-overlay__closebutton ${closeButtonClass}"></div>`
                );
            }
        }

        generateUnderlay();
        generateCloseBtn();

        // console.info("modal", modal);

        modal.classList.add("popup-overlay", `popup-overlay--${position}`);
        const underlay = document.querySelector(".popup-underlay.old");

        // transition classes
        setTimeout(() => underlay.classList.add("visible"), 100);
        setTimeout(() => modal.classList.add("transition"), 100);
        setTimeout(() => modal.classList.add("visible"), 100);

        setTimeout(() => {
            // Set size as width
            if (position === "left" || position === "right") {
                modal.style.width = `${size}px`;
            }
            // Set size as height
            if (position === "top" || position === "bottom") {
                modal.style.height = `${size}px`;
            }
        }, 100);

        // Show/hide overlay header
        if (showHeader === false) {
            modal.classList.add("popup-overlay--remove-header");
        }

        document.querySelectorAll(`.${closeButtonClass}`).forEach(closeBtn => {
            if (closePage === true) {
                closeBtn.addEventListener("click", closeModal);
            } else {
                closeBtn.addEventListener("click", AnimateCloseModal);
            }
        });

        document.body.classList.add("popup-overlay-noscroll");

        if (closeByAttribute && closeByAttribute.status == "available" && closeByAttribute.value === true) {
            console.info(closeByAttribute.value);
            closeByAttribute.setValue(false);
            setTimeout(() => closeModal(), 300);
        }

        return null;
    } else {
        return <div className="convert-popup-to-overlay"></div>;
    }
}
