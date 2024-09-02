import "./ui/ConvertPopupToOverlay.css";
import { createElement, useEffect, useState } from "react";
import { waitFor } from "./helpers/waitFor";

export default function ConvertPopupToOverlay({
    closeAction,
    closeButtonClass,
    overlayStyle,
    position,
    shouldClosePage,
    showHeader,
    size,
    underlayColor
}) {
    const [canRender, setCanRender] = useState(false);
    const [modal, setModal] = useState(null);
    const page = document.querySelector(".mx-page");

    useEffect(() => {
        if (document.querySelector(".convert-popup-to-overlay")) {
            setModal(document.querySelector(".convert-popup-to-overlay").closest(".modal-dialog"));
            setCanRender(true);
        }

        return () => {};
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
        overlayStyle === "push" ? (page.style.transform = `translate(0px)`) : null;
        if (overlayStyle === "push") {
            setTimeout(() => modal && modal.classList.remove("visible"), 400);
        } else {
            modal && modal.classList.remove("visible");
        }
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
        underlay?.addEventListener("click", closeModal);
        underlay?.classList.add("old");
        return underlay;
    }

    // overlay for the default close button
    function generateCloseBtn() {
        if (showHeader === true && shouldClosePage === true) {
            const modalContent = modal.querySelector(".modal-content");
            modalContent.insertAdjacentHTML("afterbegin", `<div class="popup-overlay__closebutton"></div>`);
            document.querySelector(".popup-overlay__closebutton")?.addEventListener("click", closeModal);
        }
    }

    function linkCloseButtons() {
        document.querySelectorAll(`.${closeButtonClass}`).forEach(closeBtn => {
            if (shouldClosePage === true) {
                closeBtn?.addEventListener("click", closeModal);
            } else {
                closeBtn?.addEventListener("click", AnimateCloseModal);
            }
        });
    }

    // Wait with transitions in case of progressbar
    function foundProgress() {
        return true;
    }

    if (canRender) {
        setTimeout(() => {
            modal.classList.add("popup-overlay", `popup-overlay--${position}`);

            if (overlayStyle === "push") {
                page.classList.add("mx-page--push");
            }

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
            showHeader === false && modal.classList.add("popup-overlay--remove-header");
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
                    if (overlayStyle === "over") {
                        underlay && underlay.classList.add("visible");
                    } else {
                        underlay && underlay.classList.add("hidden");
                    }

                    if (overlayStyle !== "push") {
                        setTimeout(() => modal && modal.classList.add("transition"), 100);
                    }
                    setTimeout(() => modal && modal.classList.add("visible"), 100);

                    if (overlayStyle === "push") {
                        if (position === "left") {
                            page.style.transform = `translateX(${size}px)`;
                        }
                        if (position === "right") {
                            page.style.transform = `translateX(-${size}px)`;
                        }
                        if (position === "top") {
                            page.style.transform = `translateY(${size}px)`;
                        }
                        if (position === "bottom") {
                            page.style.transform = `translateY(-${size}px)`;
                        }
                    }
                }, 200);
            }
        }, 2);

        return null;
    } else {
        return <div className="convert-popup-to-overlay"></div>;
    }
}
