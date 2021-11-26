define(['react'], (function (react) { 'use strict';

    

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

    ___$insertStyle(".popup-overlay {\n  max-height: 100vh;\n  max-width: 100vw;\n}\n\n.popup-overlay--top {\n  top: 0 !important;\n  right: 0 !important;\n  bottom: auto !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(-100%);\n}\n\n.popup-overlay--right {\n  height: 100vh !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: auto !important;\n  transform: translateX(100%);\n}\n\n.popup-overlay--bottom {\n  top: auto !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(100%);\n}\n\n.popup-overlay--left {\n  height: 100vh !important;\n  top: 0 !important;\n  right: auto !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  transform: translateX(-100%);\n}\n\n.popup-overlay.transition {\n  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  will-change: transition;\n}\n\n.popup-overlay.transition.visible {\n  transform: translate(0%, 0%);\n}\n\n.popup-overlay .modal-header {\n  pointer-events: none;\n}\n\n.popup-overlay .modal-content {\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n}\n\n.popup-overlay .mx-resizer {\n  display: none;\n}\n\n.popup-overlay .popup-underlay {\n  background-color: var(--underlay-color, black);\n  bottom: 0;\n  content: \"\";\n  display: block;\n  left: calc(0px - 100vw);\n  opacity: 0;\n  position: fixed;\n  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  top: 0;\n  right: 0;\n  will-change: opacity;\n  z-index: -1;\n}\n\n.popup-overlay--remove-header .modal-header {\n  display: none;\n}\n\n.popup-overlay__closebutton {\n  height: 50px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 50px;\n}\n\n.popup-overlay__closebutton:hover {\n  cursor: pointer;\n}\n\n.popup-underlay.visible {\n  opacity: 0.45;\n}\n\n.popup-underlay.visible:hover {\n  cursor: pointer;\n}\n\nbody.popup-overlay-noscroll {\n  overflow: hidden;\n}");

    function waitFor(elementClass, callback, parent) {
      const context = parent || document;

      if (context.querySelector(elementClass)) {
        callback();
      } else {
        const observer = new MutationObserver(() => {
          if (context.querySelector(elementClass)) {
            observer.disconnect();
            callback();
          }
        }); // Start observing

        observer.observe(context, {
          childList: true,
          //This is a must have for the observer with subtree
          subtree: true //Set to true if changes must also be observed in descendants.

        });
      }
    }

    /* eslint-disable no-unused-expressions */
    function ConvertPopupToOverlay({
      closeButtonClass,
      closeAction,
      position,
      shouldClosePage,
      size,
      showHeader,
      underlayColor
    }) {
      const [canRender, setCanRender] = react.useState(false);
      const [modal, setModal] = react.useState(null);
      react.useEffect(() => {
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
        document.body.classList.remove("popup-overlay-noscroll");
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
      } // overlay for the default close button


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
      } // Wait with transitions in case of progressbar


      function foundProgress() {
        return true;
      }

      if (canRender) {
        modal.classList.add("popup-overlay", `popup-overlay--${position}`);
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
            linkCloseButtons();
            setTimeout(() => underlay && underlay.classList.add("visible"), 300);
            setTimeout(() => modal && modal.classList.add("transition"), 300);
            setTimeout(() => modal && modal.classList.add("visible"), 300);
          }, 300);
        }

        return null;
      } else {
        return react.createElement("div", {
          className: "convert-popup-to-overlay"
        });
      }
    }

    return ConvertPopupToOverlay;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy93YWl0Rm9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3IoZWxlbWVudENsYXNzLCBjYWxsYmFjaywgcGFyZW50KSB7XG4gIGNvbnN0IGNvbnRleHQgPSBwYXJlbnQgfHwgZG9jdW1lbnQ7XG5cbiAgaWYgKGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50Q2xhc3MpKSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIC8vIFN0YXJ0IG9ic2VydmluZ1xuICAgIG9ic2VydmVyLm9ic2VydmUoY29udGV4dCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLCAvL1RoaXMgaXMgYSBtdXN0IGhhdmUgZm9yIHRoZSBvYnNlcnZlciB3aXRoIHN1YnRyZWVcbiAgICAgIHN1YnRyZWU6IHRydWUsIC8vU2V0IHRvIHRydWUgaWYgY2hhbmdlcyBtdXN0IGFsc28gYmUgb2JzZXJ2ZWQgaW4gZGVzY2VuZGFudHMuXG4gICAgfSk7XG4gIH1cbn07IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgXCIuL3VpL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5jc3NcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHdhaXRGb3IgfSBmcm9tIFwiLi9oZWxwZXJzL3dhaXRGb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udmVydFBvcHVwVG9PdmVybGF5KHtcbiAgICBjbG9zZUJ1dHRvbkNsYXNzLFxuICAgIGNsb3NlQWN0aW9uLFxuICAgIHBvc2l0aW9uLFxuICAgIHNob3VsZENsb3NlUGFnZSxcbiAgICBzaXplLFxuICAgIHNob3dIZWFkZXIsXG4gICAgdW5kZXJsYXlDb2xvclxufSkge1xuICAgIGNvbnN0IFtjYW5SZW5kZXIsIHNldENhblJlbmRlcl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKSkge1xuICAgICAgICAgICAgc2V0TW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikuY2xvc2VzdChcIi5tb2RhbC1kaWFsb2dcIikpO1xuICAgICAgICAgICAgc2V0Q2FuUmVuZGVyKHRydWUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzZXRVbmRlcmxheUNvbG9yKCkge1xuICAgICAgICB1bmRlcmxheUNvbG9yICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShgLS11bmRlcmxheS1jb2xvcmAsIHVuZGVybGF5Q29sb3IpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZVVuZGVybGF5KCkge1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXkub2xkXCIpO1xuICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBBbmltYXRlQ2xvc2VNb2RhbCgpIHtcbiAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlcIik7XG4gICAgICAgIG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJwb3B1cC1vdmVybGF5LW5vc2Nyb2xsXCIpO1xuICAgICAgICByZW1vdmVVbmRlcmxheSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XG4gICAgICAgIEFuaW1hdGVDbG9zZU1vZGFsKCk7XG5cbiAgICAgICAgaWYgKGNsb3NlQWN0aW9uICYmIGNsb3NlQWN0aW9uLmNhbkV4ZWN1dGUpIHtcbiAgICAgICAgICAgIGNsb3NlQWN0aW9uLmV4ZWN1dGUoKTtcbiAgICAgICAgfSBlbHNlIGlmICghY2xvc2VBY3Rpb24gJiYgc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheSAuY2xvc2VcIik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNsb3NlQnRuLmNsaWNrKCksIDMwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVVuZGVybGF5KCkge1xuICAgICAgICBtb2RhbC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgJzxkaXYgY2xhc3M9XCJwb3B1cC11bmRlcmxheVwiPjwvZGl2PicpO1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXk6bm90KC5vbGQpXCIpO1xuICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgIHVuZGVybGF5ICYmIHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJvbGRcIik7XG4gICAgICAgIHJldHVybiB1bmRlcmxheTtcbiAgICB9XG5cbiAgICAvLyBvdmVybGF5IGZvciB0aGUgZGVmYXVsdCBjbG9zZSBidXR0b25cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUNsb3NlQnRuKCkge1xuICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gdHJ1ZSAmJiBzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsQ29udGVudCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtY29udGVudFwiKTtcbiAgICAgICAgICAgIG1vZGFsQ29udGVudC5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlcmJlZ2luXCIsIGA8ZGl2IGNsYXNzPVwicG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b25cIj48L2Rpdj5gKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlua0Nsb3NlQnV0dG9ucygpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7Y2xvc2VCdXR0b25DbGFzc31gKS5mb3JFYWNoKGNsb3NlQnRuID0+IHtcbiAgICAgICAgICAgIGlmIChzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBBbmltYXRlQ2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdhaXQgd2l0aCB0cmFuc2l0aW9ucyBpbiBjYXNlIG9mIHByb2dyZXNzYmFyXG4gICAgZnVuY3Rpb24gZm91bmRQcm9ncmVzcygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNhblJlbmRlcikge1xuICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheVwiLCBgcG9wdXAtb3ZlcmxheS0tJHtwb3NpdGlvbn1gKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIHdpZHRoXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwibGVmdFwiIHx8IHBvc2l0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS53aWR0aCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgaGVpZ2h0XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwidG9wXCIgfHwgcG9zaXRpb24gPT09IFwiYm90dG9tXCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5oZWlnaHQgPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICAvLyBTaG93L2hpZGUgb3ZlcmxheSBoZWFkZXJcbiAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS0tcmVtb3ZlLWhlYWRlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIik7XG5cbiAgICAgICAgc2V0VW5kZXJsYXlDb2xvcigpO1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGdlbmVyYXRlVW5kZXJsYXkoKTtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB3YWl0Rm9yKFwiLm14LXByb2dyZXNzXCIsIGZvdW5kUHJvZ3Jlc3MsIGRvY3VtZW50KTtcblxuICAgICAgICBpZiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHVuZGVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInRyYW5zaXRpb25cIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGdlbmVyYXRlQ2xvc2VCdG4oKTtcbiAgICAgICAgICAgICAgICBsaW5rQ2xvc2VCdXR0b25zKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc2l0aW9uXCIpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDMwMCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udmVydC1wb3B1cC10by1vdmVybGF5XCI+PC9kaXY+O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJ3YWl0Rm9yIiwiZWxlbWVudENsYXNzIiwiY2FsbGJhY2siLCJwYXJlbnQiLCJjb250ZXh0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZGlzY29ubmVjdCIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiQ29udmVydFBvcHVwVG9PdmVybGF5IiwiY2xvc2VCdXR0b25DbGFzcyIsImNsb3NlQWN0aW9uIiwicG9zaXRpb24iLCJzaG91bGRDbG9zZVBhZ2UiLCJzaXplIiwic2hvd0hlYWRlciIsInVuZGVybGF5Q29sb3IiLCJjYW5SZW5kZXIiLCJzZXRDYW5SZW5kZXIiLCJ1c2VTdGF0ZSIsIm1vZGFsIiwic2V0TW9kYWwiLCJ1c2VFZmZlY3QiLCJjbG9zZXN0Iiwic2V0VW5kZXJsYXlDb2xvciIsImRvY3VtZW50RWxlbWVudCIsInN0eWxlIiwic2V0UHJvcGVydHkiLCJyZW1vdmVVbmRlcmxheSIsInVuZGVybGF5IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiQW5pbWF0ZUNsb3NlTW9kYWwiLCJib2R5IiwiY2xvc2VNb2RhbCIsImNhbkV4ZWN1dGUiLCJleGVjdXRlIiwiY2xvc2VCdG4iLCJzZXRUaW1lb3V0IiwiY2xpY2siLCJnZW5lcmF0ZVVuZGVybGF5IiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZCIsImdlbmVyYXRlQ2xvc2VCdG4iLCJtb2RhbENvbnRlbnQiLCJsaW5rQ2xvc2VCdXR0b25zIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJmb3VuZFByb2dyZXNzIiwid2lkdGgiLCJoZWlnaHQiLCJwcm9ncmVzcyIsImNyZWF0ZUVsZW1lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQU8sU0FBU0EsT0FBVCxDQUFpQkMsWUFBakIsRUFBK0JDLFFBQS9CLEVBQXlDQyxNQUF6QyxFQUFpRDtJQUN0RCxRQUFNQyxPQUFPLEdBQUdELE1BQU0sSUFBSUUsUUFBMUI7O0lBRUEsTUFBSUQsT0FBTyxDQUFDRSxhQUFSLENBQXNCTCxZQUF0QixDQUFKLEVBQXlDO0lB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
