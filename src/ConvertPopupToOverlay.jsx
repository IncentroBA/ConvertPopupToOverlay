import "./ui/ConvertPopupToOverlay.css";
import { useEffect, useState } from "react";
import { waitFor } from "./helpers/waitFor";

export default function ConvertPopupToOverlay({
    closeAction,
    closeButtonClass,
    overlayStyle,
    position,
    renderAsDrawer,
    renderUnderlay,
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

    const setUnderlayColor = () => {
        underlayColor && document.documentElement.style.setProperty(`--underlay-color`, underlayColor);
    }

    const removeUnderlay = () => {
        const underlay = document.querySelector(".popup-underlay.old");
        underlay && underlay.classList.remove("visible");
        setTimeout(() => {
            document.querySelector(".mx-page > .popup-underlay")?.remove();
        }, 300);
    }

    const AnimateCloseModal = () => {
        const modal = document.querySelector(".popup-overlay");
        overlayStyle === "push" ? (page.style.transform = `translate(0px)`) : null;
        if (overlayStyle === "push") {
            setTimeout(() => {
                modal && modal.classList.remove("visible");
                page.classList.remove("mx-page--push");
            }, 400);
        } else {
            modal && modal.classList.remove("visible");
        }
        removeUnderlay();
    }

    const closeModal = () => {
        AnimateCloseModal();

        if (closeAction && closeAction.canExecute) {
            closeAction.execute();
        } else if (!closeAction && shouldClosePage === true) {
            const closeBtn = document.querySelector(".popup-overlay .close");
            setTimeout(() => closeBtn.click(), 300);
        }
    }

    const generateUnderlay = () => {
        if (overlayStyle === "push") {
            page.insertAdjacentHTML("afterbegin", '<div class="popup-underlay"></div>');
        } else {
            modal.insertAdjacentHTML("beforeend", '<div class="popup-underlay"></div>');
        }
        const underlay = document.querySelector(".popup-underlay:not(.old)");
        underlay?.addEventListener("click", closeModal);
        underlay?.classList.add("old");
        return underlay;
    }

    // overlay for the default close button
    const generateCloseBtn = () => {
        if (showHeader === true && shouldClosePage === true) {
            const modalContent = modal.querySelector(".modal-content");
            modalContent.insertAdjacentHTML("afterbegin", `<div class="popup-overlay__closebutton"></div>`);
            document.querySelector(".popup-overlay__closebutton")?.addEventListener("click", closeModal);
        }
    }

    const linkCloseButtons = () => {
        document.querySelectorAll(`.${closeButtonClass}`).forEach(closeBtn => {
            if (shouldClosePage === true) {
                closeBtn?.addEventListener("click", closeModal);
            } else {
                closeBtn?.addEventListener("click", AnimateCloseModal);
            }
        });
    }

    const createDrawerHandle = () => {
        if (!renderAsDrawer) return;
        
        const modalContent = modal.querySelector(".modal-content");
        const handle = document.createElement("div");
        handle.className = "popup-overlay__drawer-handle";
        modalContent.insertAdjacentElement("afterbegin", handle);
        return handle;
    }

    const setupDrawerDrag = () => {
        if (!renderAsDrawer) return;
        
        const modalOverlay = document.querySelector(".popup-overlay");
        const underlay = document.querySelector(".popup-underlay");
        let startY = 0;
        let currentY = 0;
        let isDragging = false;

        const getDragThreshold = () => window.innerHeight / 2;

        const handleMouseDown = (event) => {
             isDragging = true;
             startY = event.clientY;
             currentY = 0;
             modalOverlay.classList.add("popup-overlay--dragging");
         };

        const handleMouseMove = (event) => {
            if (!isDragging) return;
            
            currentY = event.clientY - startY;
            if (currentY > 0) {
                 modalOverlay.style.transform = `translateY(${currentY}px)`;
                const opacity = Math.max(0, 1 - currentY / window.innerHeight);
                if (underlay) {
                    underlay.style.opacity = opacity;
                }
             }
        };

        const handleMouseUp = () => {
            isDragging = false;
            modalOverlay.classList.remove("popup-overlay--dragging");
            
            if (currentY > getDragThreshold()) {
                closeModal();
            } else {
                modalOverlay.style.transform = "";
                if (underlay) {
                    underlay.style.opacity = "";
                }
            }
        };

        // Add listeners to modal content for drag initiation
        const modalContent = modalOverlay.querySelector(".modal-content");
        modalContent?.addEventListener("mousedown", handleMouseDown);
        
        // Add listeners to the drawer handle for drag initiation
        const handle = modalOverlay.querySelector(".popup-overlay__drawer-handle");
        handle?.addEventListener("mousedown", handleMouseDown);
        handle?.addEventListener("mousemove", handleMouseMove);
        handle?.addEventListener("mouseup", handleMouseUp);

        // Touch events for mobile
        const handleTouchStart = (event) => {
            isDragging = true;
            startY = event.touches[0].clientY;
            currentY = 0;
            modalOverlay.classList.add("popup-overlay--dragging");
        };

        const handleTouchMove = (event) => {
            if (!isDragging) return;
            
            currentY = event.touches[0].clientY - startY;
            if (currentY > 0) {
                modalOverlay.style.transform = `translateY(${currentY}px)`;
                const opacity = Math.max(0, 1 - currentY / getDragThreshold());
                if (underlay) {
                    underlay.style.opacity = opacity;
                }
             }
        };

        const handleTouchEnd = () => {
            isDragging = false;
            modalOverlay.classList.remove("popup-overlay--dragging");
            
            if (currentY > getDragThreshold()) {
                closeModal();
            } else {
                modalOverlay.style.transform = "";
            }
        };

        modalContent?.addEventListener("touchstart", handleTouchStart);
        handle?.addEventListener("touchstart", handleTouchStart);
        handle?.addEventListener("touchmove", handleTouchMove);
        handle?.addEventListener("touchend", handleTouchEnd);
    }

    // Wait with transitions in case of progressbar
    const foundProgress = () => {
        return true;
    }

    if (canRender) {
        setTimeout(() => {
            const drawerClass = renderAsDrawer ? "popup-overlay--drawer" : "";

            modal.classList.add("popup-overlay", `popup-overlay--${position}`, drawerClass);

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

                    if (renderAsDrawer) {
                        createDrawerHandle();
                        setupDrawerDrag();
                    }
                    
                    if (renderUnderlay === true) {
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
                            underlay.classList.add("popup-underlay--left");
                        }
                        if (position === "right") {
                            page.style.transform = `translateX(-${size}px)`;
                            underlay.classList.add("popup-underlay--right");
                        }
                        if (position === "top") {
                            page.style.transform = `translateY(${size}px)`;
                            underlay.classList.add("popup-underlay--top");
                        }
                        if (position === "bottom") {
                            page.style.transform = `translateY(-${size}px)`;
                            underlay.classList.add("popup-underlay--bottom");
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
