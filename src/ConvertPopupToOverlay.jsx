/* eslint-disable no-unused-expressions */
import "./ui/ConvertPopupToOverlay.css";
import { createElement, useEffect, useState } from "react";

export default function ConvertPopupToOverlay({ closeButtons, closePage, position, size, showHeader }) {
    const [canRender, setCanRender] = useState(false);

    useEffect(() => {
        function AnimateCloseModal() {
            const underlay = document.querySelector(".popup-underlay");
            const modal = document.querySelector(".popup-overlay");
            modal.classList.remove("visible");
            underlay && underlay.classList.remove("visible");
            setTimeout(() => underlay && underlay.remove(), 300);
        }

        function closeModal() {
            const modal = document.querySelector(".popup-overlay");
            const closeBtn = modal.querySelector(".close");
            AnimateCloseModal();
            closePage === true && setTimeout(() => closeBtn.click(), 300);
        }

        if (document.querySelector(".convert-popup-to-overlay")) {
            // old popup?
            if (document.querySelector(".popup-overlay")) {
                closeModal();
            }

            setCanRender(true);
            const modal = document.querySelector(".convert-popup-to-overlay").closest(".modal-dialog");

            // overlay for th default close button
            if (showHeader === true && closePage === true) {
                const modalContent = modal.querySelector(".modal-content");
                modalContent.insertAdjacentHTML(
                    "afterbegin",
                    `<div class="popup-overlay__closebutton ${closeButtons}"></div>`
                );
            }

            modal.classList.add("popup-overlay", `popup-overlay--${position}`);
            modal.parentNode.insertAdjacentHTML("beforeend", '<div class="popup-underlay"></div>');
            const underlay = document.querySelector(".popup-underlay:not(.old)");

            // transition classes
            setTimeout(() => underlay.classList.add("visible"), 100);
            setTimeout(() => modal.classList.add("transition"), 100);
            setTimeout(() => modal.classList.add("visible"), 100);

            // underlay click
            document.querySelector(".popup-underlay:not(.old)").addEventListener("click", closeModal);
            setTimeout(() => underlay.classList.add("old"), 300);

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

            document.querySelectorAll(`.${closeButtons}`).forEach(closeBtn => {
                if (closePage === true) {
                    closeBtn.addEventListener("click", closeModal);
                } else {
                    closeBtn.addEventListener("click", AnimateCloseModal);
                }
            });
        }
    }, [canRender, closeButtons, closePage, position, size, showHeader]);

    if (canRender) {
        return null;
    } else {
        return <div className="convert-popup-to-overlay"></div>;
    }
}
