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
    return createElement("div", {
      className: "convert-popup-to-overlay"
    });
  }
}

export { ConvertPopupToOverlay as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgXCIuL3VpL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5jc3NcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udmVydFBvcHVwVG9PdmVybGF5KHtcbiAgICBjbG9zZUJ1dHRvbkNsYXNzLFxuICAgIGNsb3NlQnlBdHRyaWJ1dGUsXG4gICAgY2xvc2VQYWdlLFxuICAgIHBvc2l0aW9uLFxuICAgIHNpemUsXG4gICAgc2hvd0hlYWRlclxufSkge1xuICAgIGNvbnN0IFtjYW5SZW5kZXIsIHNldENhblJlbmRlcl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKSkge1xuICAgICAgICAgICAgLy8gb2xkIHBvcHVwP1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheVwiKSkge1xuICAgICAgICAgICAgICAgIC8vIGNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oXCJjbG9zZSBvbGQgbW9kYWwhISFcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpLmNsb3Nlc3QoXCIubW9kYWwtZGlhbG9nXCIpKTtcbiAgICAgICAgICAgIHNldENhblJlbmRlcih0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGNhblJlbmRlcikge1xuICAgICAgICBmdW5jdGlvbiBBbmltYXRlQ2xvc2VNb2RhbCgpIHtcbiAgICAgICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheVwiKTtcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHVuZGVybGF5ICYmIHVuZGVybGF5LnJlbW92ZSgpLCAzMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpO1xuICAgICAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpO1xuICAgICAgICAgICAgQW5pbWF0ZUNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIGNsb3NlUGFnZSA9PT0gdHJ1ZSAmJiBzZXRUaW1lb3V0KCgpID0+IGNsb3NlQnRuLmNsaWNrKCksIDMwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVVuZGVybGF5KCkge1xuICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Lm9sZFwiKSkge1xuICAgICAgICAgICAgICAgIG1vZGFsLnBhcmVudE5vZGUuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsICc8ZGl2IGNsYXNzPVwicG9wdXAtdW5kZXJsYXlcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXk6bm90KC5vbGQpXCIpO1xuICAgICAgICAgICAgICAgIHVuZGVybGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgICAgICAgICB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwib2xkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVDbG9zZUJ0bigpIHtcbiAgICAgICAgICAgIC8vIG92ZXJsYXkgZm9yIHRoZSBkZWZhdWx0IGNsb3NlIGJ1dHRvblxuICAgICAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IHRydWUgJiYgY2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9kYWxDb250ZW50ID0gbW9kYWwucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1jb250ZW50XCIpO1xuICAgICAgICAgICAgICAgIG1vZGFsQ29udGVudC5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICAgICAgICAgICAgICAgIFwiYWZ0ZXJiZWdpblwiLFxuICAgICAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cInBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uICR7Y2xvc2VCdXR0b25DbGFzc31cIj48L2Rpdj5gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdlbmVyYXRlVW5kZXJsYXkoKTtcbiAgICAgICAgZ2VuZXJhdGVDbG9zZUJ0bigpO1xuXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyhcIm1vZGFsXCIsIG1vZGFsKTtcblxuICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheVwiLCBgcG9wdXAtb3ZlcmxheS0tJHtwb3NpdGlvbn1gKTtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Lm9sZFwiKTtcblxuICAgICAgICAvLyB0cmFuc2l0aW9uIGNsYXNzZXNcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMTAwKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidHJhbnNpdGlvblwiKSwgMTAwKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMTAwKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIHdpZHRoXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwibGVmdFwiIHx8IHBvc2l0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS53aWR0aCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgaGVpZ2h0XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwidG9wXCIgfHwgcG9zaXRpb24gPT09IFwiYm90dG9tXCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5oZWlnaHQgPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICAvLyBTaG93L2hpZGUgb3ZlcmxheSBoZWFkZXJcbiAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS0tcmVtb3ZlLWhlYWRlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke2Nsb3NlQnV0dG9uQ2xhc3N9YCkuZm9yRWFjaChjbG9zZUJ0biA9PiB7XG4gICAgICAgICAgICBpZiAoY2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgQW5pbWF0ZUNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LW5vc2Nyb2xsXCIpO1xuXG4gICAgICAgIGlmIChjbG9zZUJ5QXR0cmlidXRlICYmIGNsb3NlQnlBdHRyaWJ1dGUuc3RhdHVzID09IFwiYXZhaWxhYmxlXCIgJiYgY2xvc2VCeUF0dHJpYnV0ZS52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKGNsb3NlQnlBdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgY2xvc2VCeUF0dHJpYnV0ZS5zZXRWYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNsb3NlTW9kYWwoKSwgMzAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiPjwvZGl2PjtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiQ29udmVydFBvcHVwVG9PdmVybGF5IiwiY2xvc2VCdXR0b25DbGFzcyIsImNsb3NlQnlBdHRyaWJ1dGUiLCJjbG9zZVBhZ2UiLCJwb3NpdGlvbiIsInNpemUiLCJzaG93SGVhZGVyIiwiY2FuUmVuZGVyIiwic2V0Q2FuUmVuZGVyIiwidXNlU3RhdGUiLCJtb2RhbCIsInNldE1vZGFsIiwidXNlRWZmZWN0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY29uc29sZSIsImluZm8iLCJjbG9zZXN0IiwiQW5pbWF0ZUNsb3NlTW9kYWwiLCJ1bmRlcmxheSIsImNsYXNzTGlzdCIsInJlbW92ZSIsImJvZHkiLCJzZXRUaW1lb3V0IiwiY2xvc2VNb2RhbCIsImNsb3NlQnRuIiwiY2xpY2siLCJnZW5lcmF0ZVVuZGVybGF5IiwicGFyZW50Tm9kZSIsImluc2VydEFkamFjZW50SFRNTCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGQiLCJnZW5lcmF0ZUNsb3NlQnRuIiwibW9kYWxDb250ZW50Iiwic3R5bGUiLCJ3aWR0aCIsImhlaWdodCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwic3RhdHVzIiwidmFsdWUiLCJzZXRWYWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFJZSxTQUFTQSxxQkFBVCxDQUErQjtBQUMxQ0MsRUFBQUEsZ0JBRDBDO0FBRTFDQyxFQUFBQSxnQkFGMEM7QUFHMUNDLEVBQUFBLFNBSDBDO0FBSTFDQyxFQUFBQSxRQUowQztBQUsxQ0MsRUFBQUEsSUFMMEM7QUFNMUNDLEVBQUFBO0FBTjBDLENBQS9CLEVBT1o7QUFDQyxRQUFNLENBQUNDLFNBQUQsRUFBWUMsWUFBWixJQUE0QkMsUUFBUSxDQUFDLEtBQUQsQ0FBMUM7QUFDQSxRQUFNLENBQUNDLEtBQUQsRUFBUUMsUUFBUixJQUFvQkYsUUFBUSxDQUFDLElBQUQsQ0FBbEM7QUFFQUcsRUFBQUEsU0FBUyxDQUFDLE1BQU07QUFDWixRQUFJQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsMkJBQXZCLENBQUosRUFBeUQ7QUFDckQ7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
