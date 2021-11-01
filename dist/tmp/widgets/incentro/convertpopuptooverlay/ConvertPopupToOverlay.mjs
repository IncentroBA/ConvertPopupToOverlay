function ___$insertStyle(css) {
    if (!css || typeof window === 'undefined') {
        return;
    }
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.head.appendChild(style);
    return css;
}

import { useState, useEffect, createElement } from 'react';

___$insertStyle(".popup-overlay {\n  max-height: 100vh;\n  max-width: 100vw;\n}\n\n.popup-overlay--top {\n  top: 0 !important;\n  right: 0 !important;\n  bottom: auto !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(-100%);\n}\n\n.popup-overlay--right {\n  height: 100vh !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: auto !important;\n  transform: translateX(100%);\n}\n\n.popup-overlay--bottom {\n  top: auto !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(100%);\n}\n\n.popup-overlay--left {\n  height: 100vh !important;\n  top: 0 !important;\n  right: auto !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  transform: translateX(-100%);\n}\n\n.popup-overlay.transition {\n  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  will-change: transition;\n}\n\n.popup-overlay.transition.visible {\n  transform: translate(0%, 0%);\n}\n\n.popup-overlay .modal-header {\n  pointer-events: none;\n}\n\n.popup-overlay .modal-content {\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n}\n\n.popup-overlay .mx-resizer {\n  display: none;\n}\n\n.popup-underlay {\n  background-color: black;\n  height: 100vh;\n  left: 0;\n  position: fixed;\n  opacity: 0;\n  top: 0;\n  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  width: 100vw;\n  will-change: opacity;\n  z-index: 101;\n}\n\n.popup-overlay--remove-header .modal-header {\n  display: none;\n}\n\n.popup-overlay__closebutton {\n  height: 50px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 50px;\n}\n\n.popup-overlay__closebutton:hover {\n  cursor: pointer;\n}\n\n.popup-underlay.visible {\n  opacity: 0.45;\n}\n\n.popup-underlay.visible:hover {\n  cursor: pointer;\n}");

/* eslint-disable no-unused-expressions */
function ConvertPopupToOverlay({
  closeButtons,
  closePage,
  position,
  size,
  showHeader
}) {
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
      const modal = document.querySelector(".convert-popup-to-overlay").closest(".modal-dialog"); // overlay for th default close button

      if (showHeader === true && closePage === true) {
        const modalContent = modal.querySelector(".modal-content");
        modalContent.insertAdjacentHTML("afterbegin", `<div class="popup-overlay__closebutton ${closeButtons}"></div>`);
      }

      modal.classList.add("popup-overlay", `popup-overlay--${position}`);
      modal.parentNode.insertAdjacentHTML("beforeend", '<div class="popup-underlay"></div>');
      const underlay = document.querySelector(".popup-underlay:not(.old)"); // transition classes

      setTimeout(() => underlay.classList.add("visible"), 100);
      setTimeout(() => modal.classList.add("transition"), 100);
      setTimeout(() => modal.classList.add("visible"), 100); // underlay click

      document.querySelector(".popup-underlay:not(.old)").addEventListener("click", closeModal);
      setTimeout(() => underlay.classList.add("old"), 300);
      setTimeout(() => {
        // Set size as width
        if (position === "left" || position === "right") {
          modal.style.width = `${size}px`;
        } // Set size as height


        if (position === "top" || position === "bottom") {
          modal.style.height = `${size}px`;
        }
      }, 100); // Show/hide overlay header

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
    return createElement("div", {
      className: "convert-popup-to-overlay"
    });
  }
}

export { ConvertPopupToOverlay as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgXCIuL3VpL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5jc3NcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udmVydFBvcHVwVG9PdmVybGF5KHsgY2xvc2VCdXR0b25zLCBjbG9zZVBhZ2UsIHBvc2l0aW9uLCBzaXplLCBzaG93SGVhZGVyIH0pIHtcbiAgICBjb25zdCBbY2FuUmVuZGVyLCBzZXRDYW5SZW5kZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgZnVuY3Rpb24gQW5pbWF0ZUNsb3NlTW9kYWwoKSB7XG4gICAgICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXlcIik7XG4gICAgICAgICAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheVwiKTtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHVuZGVybGF5ICYmIHVuZGVybGF5LnJlbW92ZSgpLCAzMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpO1xuICAgICAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpO1xuICAgICAgICAgICAgQW5pbWF0ZUNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIGNsb3NlUGFnZSA9PT0gdHJ1ZSAmJiBzZXRUaW1lb3V0KCgpID0+IGNsb3NlQnRuLmNsaWNrKCksIDMwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikpIHtcbiAgICAgICAgICAgIC8vIG9sZCBwb3B1cD9cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlcIikpIHtcbiAgICAgICAgICAgICAgICBjbG9zZU1vZGFsKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldENhblJlbmRlcih0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikuY2xvc2VzdChcIi5tb2RhbC1kaWFsb2dcIik7XG5cbiAgICAgICAgICAgIC8vIG92ZXJsYXkgZm9yIHRoIGRlZmF1bHQgY2xvc2UgYnV0dG9uXG4gICAgICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gdHJ1ZSAmJiBjbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RhbENvbnRlbnQgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLWNvbnRlbnRcIik7XG4gICAgICAgICAgICAgICAgbW9kYWxDb250ZW50Lmluc2VydEFkamFjZW50SFRNTChcbiAgICAgICAgICAgICAgICAgICAgXCJhZnRlcmJlZ2luXCIsXG4gICAgICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwicG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b24gJHtjbG9zZUJ1dHRvbnN9XCI+PC9kaXY+YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5XCIsIGBwb3B1cC1vdmVybGF5LS0ke3Bvc2l0aW9ufWApO1xuICAgICAgICAgICAgbW9kYWwucGFyZW50Tm9kZS5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgJzxkaXYgY2xhc3M9XCJwb3B1cC11bmRlcmxheVwiPjwvZGl2PicpO1xuICAgICAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Om5vdCgub2xkKVwiKTtcblxuICAgICAgICAgICAgLy8gdHJhbnNpdGlvbiBjbGFzc2VzXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAxMDApO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidHJhbnNpdGlvblwiKSwgMTAwKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDEwMCk7XG5cbiAgICAgICAgICAgIC8vIHVuZGVybGF5IGNsaWNrXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Om5vdCgub2xkKVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJvbGRcIiksIDMwMCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIHdpZHRoXG4gICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcImxlZnRcIiB8fCBwb3NpdGlvbiA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLndpZHRoID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIGhlaWdodFxuICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJ0b3BcIiB8fCBwb3NpdGlvbiA9PT0gXCJib3R0b21cIikge1xuICAgICAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5oZWlnaHQgPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgICAgICAvLyBTaG93L2hpZGUgb3ZlcmxheSBoZWFkZXJcbiAgICAgICAgICAgIGlmIChzaG93SGVhZGVyID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LS1yZW1vdmUtaGVhZGVyXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtjbG9zZUJ1dHRvbnN9YCkuZm9yRWFjaChjbG9zZUJ0biA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIEFuaW1hdGVDbG9zZU1vZGFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIFtjYW5SZW5kZXIsIGNsb3NlQnV0dG9ucywgY2xvc2VQYWdlLCBwb3NpdGlvbiwgc2l6ZSwgc2hvd0hlYWRlcl0pO1xuXG4gICAgaWYgKGNhblJlbmRlcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIj48L2Rpdj47XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbIkNvbnZlcnRQb3B1cFRvT3ZlcmxheSIsImNsb3NlQnV0dG9ucyIsImNsb3NlUGFnZSIsInBvc2l0aW9uIiwic2l6ZSIsInNob3dIZWFkZXIiLCJjYW5SZW5kZXIiLCJzZXRDYW5SZW5kZXIiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIkFuaW1hdGVDbG9zZU1vZGFsIiwidW5kZXJsYXkiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJtb2RhbCIsImNsYXNzTGlzdCIsInJlbW92ZSIsInNldFRpbWVvdXQiLCJjbG9zZU1vZGFsIiwiY2xvc2VCdG4iLCJjbGljayIsImNsb3Nlc3QiLCJtb2RhbENvbnRlbnQiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJhZGQiLCJwYXJlbnROb2RlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFJZSxTQUFTQSxxQkFBVCxDQUErQjtBQUFFQyxFQUFBQSxZQUFGO0FBQWdCQyxFQUFBQSxTQUFoQjtBQUEyQkMsRUFBQUEsUUFBM0I7QUFBcUNDLEVBQUFBLElBQXJDO0FBQTJDQyxFQUFBQTtBQUEzQyxDQUEvQixFQUF3RjtBQUNuRyxRQUFNLENBQUNDLFNBQUQsRUFBWUMsWUFBWixJQUE0QkMsUUFBUSxDQUFDLEtBQUQsQ0FBMUM7QUFFQUMsRUFBQUEsU0FBUyxDQUFDLE1BQU07QUFDWixhQUFTQyxpQkFBVCxHQUE2QjtBQUN6QixZQUFNQyxRQUFRLEdBQUdDLFFBQVEs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
