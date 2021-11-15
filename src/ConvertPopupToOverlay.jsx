/* eslint-disable no-unused-expressions */
import "./ui/ConvertPopupToOverlay.css";
import { createElement, useEffect, useState } from "react";
import { waitFor } from "./helpers/waitFor";

export default function ConvertPopupToOverlay({ closeButtonClass, closePage, position, size, showHeader }) {
    const [canRender, setCanRender] = useState(false);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        if (document.querySelector(".convert-popup-to-overlay")) {
            setModal(document.querySelector(".convert-popup-to-overlay").closest(".modal-dialog"));
            setCanRender(true);
        }
    });

    if (canRender) {
        function removeUnderlay() {
            const underlay = document.querySelector(".popup-underlay");
            underlay && underlay.classList.remove("visible");

            if (document.querySelector(".popup-underlay.old:not(.visible)")) {
                document.querySelector(".popup-underlay.old:not(.visible)").remove();
            }
        }

        function AnimateCloseModal() {
            const modal = document.querySelector(".popup-overlay");
            modal && modal.classList.remove("visible");
            document.body.classList.remove("popup-overlay-noscroll");
        }

        function closeModal() {
            AnimateCloseModal();
            removeUnderlay();
            if (closePage === true) {
                const modal = document.querySelector(".popup-overlay");
                const closeBtn = modal.querySelector(".close");
                setTimeout(() => closeBtn.click(), 300);
            }
        }

        function generateUnderlay() {
            const oldUnderlay = document.querySelector(".popup-underlay");

            if (!oldUnderlay) {
                removeUnderlay();
            }

            modal.insertAdjacentHTML("beforeend", '<div class="popup-underlay"></div>');
            const underlay = document.querySelector(".popup-underlay:not(.old)");
            underlay.addEventListener("click", closeModal);
            underlay.classList.add("old");
            return underlay;
        }

        // overlay for the default close button
        function generateCloseBtn() {
            if (showHeader === true && closePage === true) {
                const modalContent = modal.querySelector(".modal-content");
                modalContent.insertAdjacentHTML(
                    "afterbegin",
                    `<div class="popup-overlay__closebutton ${closeButtonClass}"></div>`
                );
            }
        }
        
        function linkCloseButtons() {
            document.querySelectorAll(`.${closeButtonClass}`).forEach(closeBtn => {
                if (closePage === true) {
                    closeBtn.addEventListener("click", closeModal);
                } else {
                    closeBtn.addEventListener("click", AnimateCloseModal);
                }
            });
        }

        modal.classList.add("popup-overlay", `popup-overlay--${position}`);
        
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

        document.body.classList.add("popup-overlay-noscroll");
        
        // Wait with transitions in case of progressbar
        function foundProgress() {
            return true;
        }
        const progress = waitFor(".mx-progress", foundProgress, document);
        if (progress) {
            underlay.classList.remove("visible");
            modal.classList.remove("transition");
            modal.classList.remove("visible");
        } else {
            setTimeout(() => {
                const underlay = generateUnderlay();
                generateCloseBtn();
                linkCloseButtons();
                setTimeout(() => underlay.classList.add("visible"), 300);
                setTimeout(() => modal.classList.add("transition"), 300);
                setTimeout(() => modal.classList.add("visible"), 300);
            }, 300);
        }

        return null;
    } else {
        return <div className="convert-popup-to-overlay"></div>;
    }
}
