/* eslint-disable no-unused-expressions */
import "./ui/ConvertPopupToOverlay.css";
import { createElement, useEffect, useState } from "react";
import { waitFor } from "./helpers/waitFor";

export default function ConvertPopupToOverlay({
    closeButtonClass,
    closeAction,
    position,
    shouldClosePage,
    size,
    showHeader,
    underlayColor
}) {
    const [canRender, setCanRender] = useState(false);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        if (document.querySelector(".convert-popup-to-overlay")) {
            setModal(document.querySelector(".convert-popup-to-overlay").closest(".modal-dialog"));
            setCanRender(true);
        }
    });

    function setUnderlayColor() {
        underlayColor && document.documentElement.style.setProperty(`--underlay-color`, underlayColor);
    }

    function removeUnderlay() {
        const underlay = document.querySelector(".popup-underlay.old");
        underlay && underlay.classList.remove("visible");
    }

    function AnimateCloseModal() {
        const modal = document.querySelector(".popup-overlay");
        modal && modal.classList.remove("visible");
        setTimeout(() => document.body.classList.remove("popup-overlay-noscroll"), 100);
        removeUnderlay();
    }

    function closeModal() {
        AnimateCloseModal();

        if (closeAction && closeAction.canExecute) {
            closeAction.execute();
        } else if (!closeAction && shouldClosePage === true) {
            const closeBtn = document.querySelector(".popup-overlay .close");
            setTimeout(() => closeBtn.click(), 300);
        }
    }

    function generateUnderlay() {
        modal.insertAdjacentHTML("beforeend", '<div class="popup-underlay"></div>');
        const underlay = document.querySelector(".popup-underlay:not(.old)");
        underlay && underlay.addEventListener("click", closeModal);
        underlay && underlay.classList.add("old");
        return underlay;
    }

    // overlay for the default close button
    function generateCloseBtn() {
        if (showHeader === true && shouldClosePage === true) {
            const modalContent = modal.querySelector(".modal-content");
            modalContent.insertAdjacentHTML("afterbegin", `<div class="popup-overlay__closebutton"></div>`);
            document.querySelector(".popup-overlay__closebutton").addEventListener("click", closeModal);
        }
    }

    function linkCloseButtons() {
        document.querySelectorAll(`.${closeButtonClass}`).forEach(closeBtn => {
            if (shouldClosePage === true) {
                closeBtn.addEventListener("click", closeModal);
            } else {
                closeBtn.addEventListener("click", AnimateCloseModal);
            }
        });
    }

    // Wait with transitions in case of progressbar
    function foundProgress() {
        return true;
    }

    if (canRender) {
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

        setUnderlayColor();
        const underlay = generateUnderlay();
        const progress = waitFor(".mx-progress", foundProgress, document);

        if (progress) {
            underlay.classList.remove("visible");
            modal.classList.remove("transition");
            modal.classList.remove("visible");
        } else {
            setTimeout(() => {
                generateCloseBtn();
                setTimeout(() => linkCloseButtons(), 300);
                setTimeout(() => underlay && underlay.classList.add("visible"), 300);
                setTimeout(() => modal && modal.classList.add("transition"), 300);
                setTimeout(() => modal && modal.classList.add("visible"), 300);
            }, 300);
        }

        return null;
    } else {
        return <div className="convert-popup-to-overlay"></div>;
    }
}
