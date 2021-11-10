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

  ___$insertStyle(".popup-overlay {\n  max-height: 100vh;\n  max-width: 100vw;\n}\n\n.popup-overlay--top {\n  top: 0 !important;\n  right: 0 !important;\n  bottom: auto !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(-100%);\n}\n\n.popup-overlay--right {\n  height: 100vh !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: auto !important;\n  transform: translateX(100%);\n}\n\n.popup-overlay--bottom {\n  top: auto !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(100%);\n}\n\n.popup-overlay--left {\n  height: 100vh !important;\n  top: 0 !important;\n  right: auto !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  transform: translateX(-100%);\n}\n\n.popup-overlay.transition {\n  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  will-change: transition;\n}\n\n.popup-overlay.transition.visible {\n  transform: translate(0%, 0%);\n}\n\n.popup-overlay .modal-header {\n  pointer-events: none;\n}\n\n.popup-overlay .modal-content {\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n}\n\n.popup-overlay .mx-resizer {\n  display: none;\n}\n\n.popup-underlay {\n  background-color: black;\n  height: 100vh;\n  left: 0;\n  position: fixed;\n  opacity: 0;\n  top: 0;\n  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  width: 100vw;\n  will-change: opacity;\n  z-index: 101;\n}\n\n.popup-overlay--remove-header .modal-header {\n  display: none;\n}\n\n.popup-overlay__closebutton {\n  height: 50px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 50px;\n}\n\n.popup-overlay__closebutton:hover {\n  cursor: pointer;\n}\n\n.popup-underlay.visible {\n  opacity: 0.45;\n}\n\n.popup-underlay.visible:hover {\n  cursor: pointer;\n}\n\nbody.popup-overlay-noscroll {\n  overflow: hidden;\n}");

  /* eslint-disable no-unused-expressions */
  function ConvertPopupToOverlay({
    closeButtonClass,
    closeByAttribute,
    closePage,
    position,
    size,
    showHeader
  }) {
    const [canRender, setCanRender] = react.useState(false);
    const [modal, setModal] = react.useState(null);
    react.useEffect(() => {
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
          modalContent.insertAdjacentHTML("afterbegin", `<div class="popup-overlay__closebutton ${closeButtonClass}"></div>`);
        }
      }

      generateUnderlay();
      generateCloseBtn(); // console.info("modal", modal);

      modal.classList.add("popup-overlay", `popup-overlay--${position}`);
      const underlay = document.querySelector(".popup-underlay.old"); // transition classes

      setTimeout(() => underlay.classList.add("visible"), 100);
      setTimeout(() => modal.classList.add("transition"), 100);
      setTimeout(() => modal.classList.add("visible"), 100);
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
      return react.createElement("div", {
        className: "convert-popup-to-overlay"
      });
    }
  }

  return ConvertPopupToOverlay;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvQ29udmVydFBvcHVwVG9PdmVybGF5LmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbmltcG9ydCBcIi4vdWkvQ29udmVydFBvcHVwVG9PdmVybGF5LmNzc1wiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb252ZXJ0UG9wdXBUb092ZXJsYXkoe1xuICAgIGNsb3NlQnV0dG9uQ2xhc3MsXG4gICAgY2xvc2VCeUF0dHJpYnV0ZSxcbiAgICBjbG9zZVBhZ2UsXG4gICAgcG9zaXRpb24sXG4gICAgc2l6ZSxcbiAgICBzaG93SGVhZGVyXG59KSB7XG4gICAgY29uc3QgW2NhblJlbmRlciwgc2V0Q2FuUmVuZGVyXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpKSB7XG4gICAgICAgICAgICAvLyBvbGQgcG9wdXA/XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpKSB7XG4gICAgICAgICAgICAgICAgLy8gY2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcImNsb3NlIG9sZCBtb2RhbCEhIVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0TW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikuY2xvc2VzdChcIi5tb2RhbC1kaWFsb2dcIikpO1xuICAgICAgICAgICAgc2V0Q2FuUmVuZGVyKHRydWUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoY2FuUmVuZGVyKSB7XG4gICAgICAgIGZ1bmN0aW9uIEFuaW1hdGVDbG9zZU1vZGFsKCkge1xuICAgICAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5XCIpO1xuICAgICAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlcIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgICAgIHVuZGVybGF5ICYmIHVuZGVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdW5kZXJsYXkgJiYgdW5kZXJsYXkucmVtb3ZlKCksIDMwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgICAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlcIik7XG4gICAgICAgICAgICBjb25zdCBjbG9zZUJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIik7XG4gICAgICAgICAgICBBbmltYXRlQ2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgY2xvc2VQYWdlID09PSB0cnVlICYmIHNldFRpbWVvdXQoKCkgPT4gY2xvc2VCdG4uY2xpY2soKSwgMzAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlVW5kZXJsYXkoKSB7XG4gICAgICAgICAgICBpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXkub2xkXCIpKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwucGFyZW50Tm9kZS5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgJzxkaXYgY2xhc3M9XCJwb3B1cC11bmRlcmxheVwiPjwvZGl2PicpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheTpub3QoLm9sZClcIik7XG4gICAgICAgICAgICAgICAgdW5kZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgICAgIHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJvbGRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUNsb3NlQnRuKCkge1xuICAgICAgICAgICAgLy8gb3ZlcmxheSBmb3IgdGhlIGRlZmF1bHQgY2xvc2UgYnV0dG9uXG4gICAgICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gdHJ1ZSAmJiBjbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RhbENvbnRlbnQgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLWNvbnRlbnRcIik7XG4gICAgICAgICAgICAgICAgbW9kYWxDb250ZW50Lmluc2VydEFkamFjZW50SFRNTChcbiAgICAgICAgICAgICAgICAgICAgXCJhZnRlcmJlZ2luXCIsXG4gICAgICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwicG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b24gJHtjbG9zZUJ1dHRvbkNsYXNzfVwiPjwvZGl2PmBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2VuZXJhdGVVbmRlcmxheSgpO1xuICAgICAgICBnZW5lcmF0ZUNsb3NlQnRuKCk7XG5cbiAgICAgICAgLy8gY29uc29sZS5pbmZvKFwibW9kYWxcIiwgbW9kYWwpO1xuXG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5XCIsIGBwb3B1cC1vdmVybGF5LS0ke3Bvc2l0aW9ufWApO1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXkub2xkXCIpO1xuXG4gICAgICAgIC8vIHRyYW5zaXRpb24gY2xhc3Nlc1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAxMDApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc2l0aW9uXCIpLCAxMDApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAxMDApO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgd2lkdGhcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJsZWZ0XCIgfHwgcG9zaXRpb24gPT09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLndpZHRoID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXQgc2l6ZSBhcyBoZWlnaHRcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJ0b3BcIiB8fCBwb3NpdGlvbiA9PT0gXCJib3R0b21cIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmhlaWdodCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIC8vIFNob3cvaGlkZSBvdmVybGF5IGhlYWRlclxuICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LS1yZW1vdmUtaGVhZGVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7Y2xvc2VCdXR0b25DbGFzc31gKS5mb3JFYWNoKGNsb3NlQnRuID0+IHtcbiAgICAgICAgICAgIGlmIChjbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBBbmltYXRlQ2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIik7XG5cbiAgICAgICAgaWYgKGNsb3NlQnlBdHRyaWJ1dGUgJiYgY2xvc2VCeUF0dHJpYnV0ZS5zdGF0dXMgPT0gXCJhdmFpbGFibGVcIiAmJiBjbG9zZUJ5QXR0cmlidXRlLnZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oY2xvc2VCeUF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgICAgICBjbG9zZUJ5QXR0cmlidXRlLnNldFZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2xvc2VNb2RhbCgpLCAzMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udmVydC1wb3B1cC10by1vdmVybGF5XCI+PC9kaXY+O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJDb252ZXJ0UG9wdXBUb092ZXJsYXkiLCJjbG9zZUJ1dHRvbkNsYXNzIiwiY2xvc2VCeUF0dHJpYnV0ZSIsImNsb3NlUGFnZSIsInBvc2l0aW9uIiwic2l6ZSIsInNob3dIZWFkZXIiLCJjYW5SZW5kZXIiLCJzZXRDYW5SZW5kZXIiLCJ1c2VTdGF0ZSIsIm1vZGFsIiwic2V0TW9kYWwiLCJ1c2VFZmZlY3QiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjb25zb2xlIiwiaW5mbyIsImNsb3Nlc3QiLCJBbmltYXRlQ2xvc2VNb2RhbCIsInVuZGVybGF5IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYm9keSIsInNldFRpbWVvdXQiLCJjbG9zZU1vZGFsIiwiY2xvc2VCdG4iLCJjbGljayIsImdlbmVyYXRlVW5kZXJsYXkiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZCIsImdlbmVyYXRlQ2xvc2VCdG4iLCJtb2RhbENvbnRlbnQiLCJzdHlsZSIsIndpZHRoIiwiaGVpZ2h0IiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJzdGF0dXMiLCJ2YWx1ZSIsInNldFZhbHVlIiwiY3JlYXRlRWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQTtFQUllLFNBQVNBLHFCQUFULENBQStCO0VBQzFDQyxFQUFBQSxnQkFEMEM7RUFFMUNDLEVBQUFBLGdCQUYwQztFQUcxQ0MsRUFBQUEsU0FIMEM7RUFJMUNDLEVBQUFBLFFBSjBDO0VBSzFDQyxFQUFBQSxJQUwwQztFQU0xQ0MsRUFBQUE7RUFOMEMsQ0FBL0IsRUFPWjtFQUNDLFFBQU0sQ0FBQ0MsU0FBRCxFQUFZQyxZQUFaLElBQTRCQyxjQUFRLENBQUMsS0FBRCxDQUExQztFQUNBLFFBQU0sQ0FBQ0MsS0FBRCxFQUFRQyxRQUFSLElBQW9CRixjQUFRLENBQUMsSUFBRCxDQUFsQztFQUVBRyxFQUFBQSxlQUFTLENBQUMsTUFBTTtFQUNaLFFBQUlDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QiwyQkFBdkIsQ0FBSixFQUF5RDtFQUNyRDtFQUNBLFVBQUlELFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixnQkFBdkIsQ0FBSixFQUE4QztFQUMxQztFQUNBQyxRQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxvQkFBYjtFQUNIOztFQUVETCxNQUFBQSxRQUFRLENBQUNFLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QiwyQkFBdkIsRUFBb0RHLE9BQXBELENBQTRELGVBQTVELENBQUQsQ0FBUjtFQUNBVCxNQUFBQSxZQUFZLENBQUMsSUFBRCxDQUFaO0VBQ0g7RUFDSixHQVhRLENBQVQ7O0VBYUEsTUFBSUQsU0FBSixFQUFlO0VBQ1gsYUFBU1csaUJBQVQsR0FBNkI7RUFDekIsWUFBTUMsUUFBUSxHQUFHTixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQWpCO0VBQ0EsWUFBTUosS0FBSyxHQUFHRyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZ0JBQXZCLENBQWQ7RUFDQUosTUFBQUEsS0FBSyxDQUFDVSxTQUFOLENBQWdCQyxNQUFoQixDQUF1QixTQUF2QjtFQUNBRixNQUFBQSxRQUFRLElBQUlBLFFBQVEsQ0FBQ0MsU0FBVCxDQUFtQkMsTUFBbkIsQ0FBMEIsU0FBMUIsQ0FBWjtFQUNBUixNQUFBQSxRQUFRLENBQUNTLElBQVQsQ0FBY0YsU0FBZCxDQUF3QkMsTUFBeEIsQ0FBK0Isd0JBQS9CO0VBQ0FFLE1BQUFBLFVBQVUsQ0FBQyxNQUFNSixRQUFRLElBQUlBLFFBQVEsQ0FBQ0UsTUFBVCxFQUFuQixFQUFzQyxHQUF0QyxDQUFWO0VBQ0g7O0VBRUQsYUFBU0csVUFBVCxHQUFzQjtFQUNsQixZQUFNZCxLQUFLLEdBQUdHLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixnQkFBdkIsQ0FBZDtFQUNBLFlBQU1XLFFBQVEsR0FBR2YsS0FBSyxDQUFDSSxhQUFOLENBQW9CLFFBQXBCLENBQWpCO0VBQ0FJLE1BQUFBLGlCQUFpQjtFQUNqQmYsTUFBQUEsU0FBUyxLQUFLLElBQWQsSUFBc0JvQixVQUFVLENBQUMsTUFBTUUsUUFBUSxDQUFDQyxLQUFULEVBQVAsRUFBeUIsR0FBekIsQ0FBaEM7RUFDSDs7RUFFRCxhQUFTQyxnQkFBVCxHQUE0QjtFQUN4QixVQUFJLENBQUNkLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixxQkFBdkIsQ0FBTCxFQUFvRDtFQUNoREosUUFBQUEsS0FBSyxDQUFDa0IsVUFBTixDQUFpQkMsa0JBQWpCLENBQW9DLFdBQXBDLEVBQWlELG9DQUFqRDtFQUNBLGNBQU1WLFFBQVEsR0FBR04sUUFBUSxDQUFDQyxhQUFULENBQXVCLDJCQUF2QixDQUFqQjtFQUNBSyxRQUFBQSxRQUFRLENBQUNXLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DTixVQUFuQztFQUNBTCxRQUFBQSxRQUFRLENBQUNDLFNBQVQsQ0FBbUJXLEdBQW5CLENBQXVCLEtBQXZCO0VBQ0g7RUFDSjs7RUFFRCxhQUFTQyxnQkFBVCxHQUE0QjtFQUN4QjtFQUNBLFVBQUkxQixVQUFVLEtBQUssSUFBZixJQUF1QkgsU0FBUyxLQUFLLElBQXpDLEVBQStDO0VBQzNDLGNBQU04QixZQUFZLEdBQUd2QixLQUFLLENBQUNJLGFBQU4sQ0FBb0IsZ0JBQXBCLENBQXJCO0VBQ0FtQixRQUFBQSxZQUFZLENBQUNKLGtCQUFiLENBQ0ksWUFESixFQUVLLDBDQUF5QzVCLGdCQUFpQixVQUYvRDtFQUlIO0VBQ0o7O0VBRUQwQixJQUFBQSxnQkFBZ0I7RUFDaEJLLElBQUFBLGdCQUFnQixHQXRDTDs7RUEwQ1h0QixJQUFBQSxLQUFLLENBQUNVLFNBQU4sQ0FBZ0JXLEdBQWhCLENBQW9CLGVBQXBCLEVBQXNDLGtCQUFpQjNCLFFBQVMsRUFBaEU7RUFDQSxVQUFNZSxRQUFRLEdBQUdOLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixxQkFBdkIsQ0FBakIsQ0EzQ1c7O0VBOENYUyxJQUFBQSxVQUFVLENBQUMsTUFBTUosUUFBUSxDQUFDQyxTQUFULENBQW1CVyxHQUFuQixDQUF1QixTQUF2QixDQUFQLEVBQTBDLEdBQTFDLENBQVY7RUFDQVIsSUFBQUEsVUFBVSxDQUFDLE1BQU1iLEtBQUssQ0FBQ1UsU0FBTixDQUFnQlcsR0FBaEIsQ0FBb0IsWUFBcEIsQ0FBUCxFQUEwQyxHQUExQyxDQUFWO0VBQ0FSLElBQUFBLFVBQVUsQ0FBQyxNQUFNYixLQUFLLENBQUNVLFNBQU4sQ0FBZ0JXLEdBQWhCLENBQW9CLFNBQXBCLENBQVAsRUFBdUMsR0FBdkMsQ0FBVjtFQUVBUixJQUFBQSxVQUFVLENBQUMsTUFBTTtFQUNiO0VBQ0EsVUFBSW5CLFFBQVEsS0FBSyxNQUFiLElBQXVCQSxRQUFRLEtBQUssT0FBeEMsRUFBaUQ7RUFDN0NNLFFBQUFBLEtBQUssQ0FBQ3dCLEtBQU4sQ0FBWUMsS0FBWixHQUFxQixHQUFFOUIsSUFBSyxJQUE1QjtFQUNILE9BSlk7OztFQU1iLFVBQUlELFFBQVEsS0FBSyxLQUFiLElBQXNCQSxRQUFRLEtBQUssUUFBdkMsRUFBaUQ7RUFDN0NNLFFBQUFBLEtBQUssQ0FBQ3dCLEtBQU4sQ0FBWUUsTUFBWixHQUFzQixHQUFFL0IsSUFBSyxJQUE3QjtFQUNIO0VBQ0osS0FUUyxFQVNQLEdBVE8sQ0FBVixDQWxEVzs7RUE4RFgsUUFBSUMsVUFBVSxLQUFLLEtBQW5CLEVBQTBCO0VBQ3RCSSxNQUFBQSxLQUFLLENBQUNVLFNBQU4sQ0FBZ0JXLEdBQWhCLENBQW9CLDhCQUFwQjtFQUNIOztFQUVEbEIsSUFBQUEsUUFBUSxDQUFDd0IsZ0JBQVQsQ0FBMkIsSUFBR3BDLGdCQUFpQixFQUEvQyxFQUFrRHFDLE9BQWxELENBQTBEYixRQUFRLElBQUk7RUFDbEUsVUFBSXRCLFNBQVMsS0FBSyxJQUFsQixFQUF3QjtFQUNwQnNCLFFBQUFBLFFBQVEsQ0FBQ0ssZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUNOLFVBQW5DO0VBQ0gsT0FGRCxNQUVPO0VBQ0hDLFFBQUFBLFFBQVEsQ0FBQ0ssZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUNaLGlCQUFuQztFQUNIO0VBQ0osS0FORDtFQVFBTCxJQUFBQSxRQUFRLENBQUNTLElBQVQsQ0FBY0YsU0FBZCxDQUF3QlcsR0FBeEIsQ0FBNEIsd0JBQTVCOztFQUVBLFFBQUk3QixnQkFBZ0IsSUFBSUEsZ0JBQWdCLENBQUNxQyxNQUFqQixJQUEyQixXQUEvQyxJQUE4RHJDLGdCQUFnQixDQUFDc0MsS0FBakIsS0FBMkIsSUFBN0YsRUFBbUc7RUFDL0Z6QixNQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYWQsZ0JBQWdCLENBQUNzQyxLQUE5QjtFQUNBdEMsTUFBQUEsZ0JBQWdCLENBQUN1QyxRQUFqQixDQUEwQixLQUExQjtFQUNBbEIsTUFBQUEsVUFBVSxDQUFDLE1BQU1DLFVBQVUsRUFBakIsRUFBcUIsR0FBckIsQ0FBVjtFQUNIOztFQUVELFdBQU8sSUFBUDtFQUNILEdBbkZELE1BbUZPO0VBQ0gsV0FBT2tCO0VBQUssTUFBQSxTQUFTLEVBQUM7RUFBZixNQUFQO0VBQ0g7RUFDSjs7Ozs7Ozs7In0=
