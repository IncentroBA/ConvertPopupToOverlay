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

  ___$insertStyle(".popup-overlay {\n  max-height: 100vh;\n  max-width: 100vw;\n}\n\n.popup-overlay--top {\n  top: 0 !important;\n  right: 0 !important;\n  bottom: auto !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(-100%);\n}\n\n.popup-overlay--right {\n  height: 100vh !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: auto !important;\n  transform: translateX(100%);\n}\n\n.popup-overlay--bottom {\n  top: auto !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(100%);\n}\n\n.popup-overlay--left {\n  height: 100vh !important;\n  top: 0 !important;\n  right: auto !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  transform: translateX(-100%);\n}\n\n.popup-overlay.transition {\n  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  will-change: transition;\n}\n\n.popup-overlay.transition.visible {\n  transform: translate(0%, 0%);\n}\n\n.popup-overlay .modal-header {\n  pointer-events: none;\n}\n\n.popup-overlay .modal-content {\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n}\n\n.popup-overlay .mx-resizer {\n  display: none;\n}\n\n.popup-underlay {\n  background-color: black;\n  height: 100vh;\n  left: 0;\n  position: fixed;\n  opacity: 0;\n  top: 0;\n  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  width: 100vw;\n  will-change: opacity;\n  z-index: 101;\n}\n\n.popup-overlay--remove-header .modal-header {\n  display: none;\n}\n\n.popup-overlay__closebutton {\n  height: 50px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 50px;\n}\n\n.popup-overlay__closebutton:hover {\n  cursor: pointer;\n}\n\n.popup-underlay.visible {\n  opacity: 0.45;\n}\n\n.popup-underlay.visible:hover {\n  cursor: pointer;\n}");

  /* eslint-disable no-unused-expressions */
  function ConvertPopupToOverlay({
    closeButtons,
    closePage,
    position,
    size,
    showHeader
  }) {
    const [canRender, setCanRender] = react.useState(false);
    react.useEffect(() => {
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
      return react.createElement("div", {
        className: "convert-popup-to-overlay"
      });
    }
  }

  return ConvertPopupToOverlay;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvQ29udmVydFBvcHVwVG9PdmVybGF5LmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbmltcG9ydCBcIi4vdWkvQ29udmVydFBvcHVwVG9PdmVybGF5LmNzc1wiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb252ZXJ0UG9wdXBUb092ZXJsYXkoeyBjbG9zZUJ1dHRvbnMsIGNsb3NlUGFnZSwgcG9zaXRpb24sIHNpemUsIHNob3dIZWFkZXIgfSkge1xuICAgIGNvbnN0IFtjYW5SZW5kZXIsIHNldENhblJlbmRlcl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBmdW5jdGlvbiBBbmltYXRlQ2xvc2VNb2RhbCgpIHtcbiAgICAgICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheVwiKTtcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdW5kZXJsYXkgJiYgdW5kZXJsYXkucmVtb3ZlKCksIDMwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgICAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlcIik7XG4gICAgICAgICAgICBjb25zdCBjbG9zZUJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIik7XG4gICAgICAgICAgICBBbmltYXRlQ2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgY2xvc2VQYWdlID09PSB0cnVlICYmIHNldFRpbWVvdXQoKCkgPT4gY2xvc2VCdG4uY2xpY2soKSwgMzAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKSkge1xuICAgICAgICAgICAgLy8gb2xkIHBvcHVwP1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheVwiKSkge1xuICAgICAgICAgICAgICAgIGNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0Q2FuUmVuZGVyKHRydWUpO1xuICAgICAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKS5jbG9zZXN0KFwiLm1vZGFsLWRpYWxvZ1wiKTtcblxuICAgICAgICAgICAgLy8gb3ZlcmxheSBmb3IgdGggZGVmYXVsdCBjbG9zZSBidXR0b25cbiAgICAgICAgICAgIGlmIChzaG93SGVhZGVyID09PSB0cnVlICYmIGNsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vZGFsQ29udGVudCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtY29udGVudFwiKTtcbiAgICAgICAgICAgICAgICBtb2RhbENvbnRlbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgICAgICAgICAgICAgICBcImFmdGVyYmVnaW5cIixcbiAgICAgICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJwb3B1cC1vdmVybGF5X19jbG9zZWJ1dHRvbiAke2Nsb3NlQnV0dG9uc31cIj48L2Rpdj5gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXlcIiwgYHBvcHVwLW92ZXJsYXktLSR7cG9zaXRpb259YCk7XG4gICAgICAgICAgICBtb2RhbC5wYXJlbnROb2RlLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCAnPGRpdiBjbGFzcz1cInBvcHVwLXVuZGVybGF5XCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXk6bm90KC5vbGQpXCIpO1xuXG4gICAgICAgICAgICAvLyB0cmFuc2l0aW9uIGNsYXNzZXNcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdW5kZXJsYXkuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDEwMCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc2l0aW9uXCIpLCAxMDApO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMTAwKTtcblxuICAgICAgICAgICAgLy8gdW5kZXJsYXkgY2xpY2tcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXk6bm90KC5vbGQpXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdW5kZXJsYXkuY2xhc3NMaXN0LmFkZChcIm9sZFwiKSwgMzAwKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgd2lkdGhcbiAgICAgICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwibGVmdFwiIHx8IHBvc2l0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUud2lkdGggPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgaGVpZ2h0XG4gICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcInRvcFwiIHx8IHBvc2l0aW9uID09PSBcImJvdHRvbVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmhlaWdodCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwMCk7XG5cbiAgICAgICAgICAgIC8vIFNob3cvaGlkZSBvdmVybGF5IGhlYWRlclxuICAgICAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktLXJlbW92ZS1oZWFkZXJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke2Nsb3NlQnV0dG9uc31gKS5mb3JFYWNoKGNsb3NlQnRuID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgQW5pbWF0ZUNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwgW2NhblJlbmRlciwgY2xvc2VCdXR0b25zLCBjbG9zZVBhZ2UsIHBvc2l0aW9uLCBzaXplLCBzaG93SGVhZGVyXSk7XG5cbiAgICBpZiAoY2FuUmVuZGVyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiPjwvZGl2PjtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiQ29udmVydFBvcHVwVG9PdmVybGF5IiwiY2xvc2VCdXR0b25zIiwiY2xvc2VQYWdlIiwicG9zaXRpb24iLCJzaXplIiwic2hvd0hlYWRlciIsImNhblJlbmRlciIsInNldENhblJlbmRlciIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiQW5pbWF0ZUNsb3NlTW9kYWwiLCJ1bmRlcmxheSIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm1vZGFsIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwic2V0VGltZW91dCIsImNsb3NlTW9kYWwiLCJjbG9zZUJ0biIsImNsaWNrIiwiY2xvc2VzdCIsIm1vZGFsQ29udGVudCIsImluc2VydEFkamFjZW50SFRNTCIsImFkZCIsInBhcmVudE5vZGUiLCJhZGRFdmVudExpc3RlbmVyIiwic3R5bGUiLCJ3aWR0aCIsImhlaWdodCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiY3JlYXRlRWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQTtFQUllLFNBQVNBLHFCQUFULENBQStCO0VBQUVDLEVBQUFBLFlBQUY7RUFBZ0JDLEVBQUFBLFNBQWhCO0VBQTJCQyxFQUFBQSxRQUEzQjtFQUFxQ0MsRUFBQUEsSUFBckM7RUFBMkNDLEVBQUFBO0VBQTNDLENBQS9CLEVBQXdGO0VBQ25HLFFBQU0sQ0FBQ0MsU0FBRCxFQUFZQyxZQUFaLElBQTRCQyxjQUFRLENBQUMsS0FBRCxDQUExQztFQUVBQyxFQUFBQSxlQUFTLENBQUMsTUFBTTtFQUNaLGFBQVNDLGlCQUFULEdBQTZCO0VBQ3pCLFlBQU1DLFFBQVEsR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLGlCQUF2QixDQUFqQjtFQUNBLFlBQU1DLEtBQUssR0FBR0YsUUFBUSxDQUFDQyxhQUFULENBQXVCLGdCQUF2QixDQUFkO0VBQ0FDLE1BQUFBLEtBQUssQ0FBQ0MsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUIsU0FBdkI7RUFDQUwsTUFBQUEsUUFBUSxJQUFJQSxRQUFRLENBQUNJLFNBQVQsQ0FBbUJDLE1BQW5CLENBQTBCLFNBQTFCLENBQVo7RUFDQUMsTUFBQUEsVUFBVSxDQUFDLE1BQU1OLFFBQVEsSUFBSUEsUUFBUSxDQUFDSyxNQUFULEVBQW5CLEVBQXNDLEdBQXRDLENBQVY7RUFDSDs7RUFFRCxhQUFTRSxVQUFULEdBQXNCO0VBQ2xCLFlBQU1KLEtBQUssR0FBR0YsUUFBUSxDQUFDQyxhQUFULENBQXVCLGdCQUF2QixDQUFkO0VBQ0EsWUFBTU0sUUFBUSxHQUFHTCxLQUFLLENBQUNELGFBQU4sQ0FBb0IsUUFBcEIsQ0FBakI7RUFDQUgsTUFBQUEsaUJBQWlCO0VBQ2pCUixNQUFBQSxTQUFTLEtBQUssSUFBZCxJQUFzQmUsVUFBVSxDQUFDLE1BQU1FLFFBQVEsQ0FBQ0MsS0FBVCxFQUFQLEVBQXlCLEdBQXpCLENBQWhDO0VBQ0g7O0VBRUQsUUFBSVIsUUFBUSxDQUFDQyxhQUFULENBQXVCLDJCQUF2QixDQUFKLEVBQXlEO0VBQ3JEO0VBQ0EsVUFBSUQsUUFBUSxDQUFDQyxhQUFULENBQXVCLGdCQUF2QixDQUFKLEVBQThDO0VBQzFDSyxRQUFBQSxVQUFVO0VBQ2I7O0VBRURYLE1BQUFBLFlBQVksQ0FBQyxJQUFELENBQVo7RUFDQSxZQUFNTyxLQUFLLEdBQUdGLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QiwyQkFBdkIsRUFBb0RRLE9BQXBELENBQTRELGVBQTVELENBQWQsQ0FQcUQ7O0VBVXJELFVBQUloQixVQUFVLEtBQUssSUFBZixJQUF1QkgsU0FBUyxLQUFLLElBQXpDLEVBQStDO0VBQzNDLGNBQU1vQixZQUFZLEdBQUdSLEtBQUssQ0FBQ0QsYUFBTixDQUFvQixnQkFBcEIsQ0FBckI7RUFDQVMsUUFBQUEsWUFBWSxDQUFDQyxrQkFBYixDQUNJLFlBREosRUFFSywwQ0FBeUN0QixZQUFhLFVBRjNEO0VBSUg7O0VBRURhLE1BQUFBLEtBQUssQ0FBQ0MsU0FBTixDQUFnQlMsR0FBaEIsQ0FBb0IsZUFBcEIsRUFBc0Msa0JBQWlCckIsUUFBUyxFQUFoRTtFQUNBVyxNQUFBQSxLQUFLLENBQUNXLFVBQU4sQ0FBaUJGLGtCQUFqQixDQUFvQyxXQUFwQyxFQUFpRCxvQ0FBakQ7RUFDQSxZQUFNWixRQUFRLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QiwyQkFBdkIsQ0FBakIsQ0FwQnFEOztFQXVCckRJLE1BQUFBLFVBQVUsQ0FBQyxNQUFNTixRQUFRLENBQUNJLFNBQVQsQ0FBbUJTLEdBQW5CLENBQXVCLFNBQXZCLENBQVAsRUFBMEMsR0FBMUMsQ0FBVjtFQUNBUCxNQUFBQSxVQUFVLENBQUMsTUFBTUgsS0FBSyxDQUFDQyxTQUFOLENBQWdCUyxHQUFoQixDQUFvQixZQUFwQixDQUFQLEVBQTBDLEdBQTFDLENBQVY7RUFDQVAsTUFBQUEsVUFBVSxDQUFDLE1BQU1ILEtBQUssQ0FBQ0MsU0FBTixDQUFnQlMsR0FBaEIsQ0FBb0IsU0FBcEIsQ0FBUCxFQUF1QyxHQUF2QyxDQUFWLENBekJxRDs7RUE0QnJEWixNQUFBQSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsMkJBQXZCLEVBQW9EYSxnQkFBcEQsQ0FBcUUsT0FBckUsRUFBOEVSLFVBQTlFO0VBQ0FELE1BQUFBLFVBQVUsQ0FBQyxNQUFNTixRQUFRLENBQUNJLFNBQVQsQ0FBbUJTLEdBQW5CLENBQXVCLEtBQXZCLENBQVAsRUFBc0MsR0FBdEMsQ0FBVjtFQUVBUCxNQUFBQSxVQUFVLENBQUMsTUFBTTtFQUNiO0VBQ0EsWUFBSWQsUUFBUSxLQUFLLE1BQWIsSUFBdUJBLFFBQVEsS0FBSyxPQUF4QyxFQUFpRDtFQUM3Q1csVUFBQUEsS0FBSyxDQUFDYSxLQUFOLENBQVlDLEtBQVosR0FBcUIsR0FBRXhCLElBQUssSUFBNUI7RUFDSCxTQUpZOzs7RUFNYixZQUFJRCxRQUFRLEtBQUssS0FBYixJQUFzQkEsUUFBUSxLQUFLLFFBQXZDLEVBQWlEO0VBQzdDVyxVQUFBQSxLQUFLLENBQUNhLEtBQU4sQ0FBWUUsTUFBWixHQUFzQixHQUFFekIsSUFBSyxJQUE3QjtFQUNIO0VBQ0osT0FUUyxFQVNQLEdBVE8sQ0FBVixDQS9CcUQ7O0VBMkNyRCxVQUFJQyxVQUFVLEtBQUssS0FBbkIsRUFBMEI7RUFDdEJTLFFBQUFBLEtBQUssQ0FBQ0MsU0FBTixDQUFnQlMsR0FBaEIsQ0FBb0IsOEJBQXBCO0VBQ0g7O0VBRURaLE1BQUFBLFFBQVEsQ0FBQ2tCLGdCQUFULENBQTJCLElBQUc3QixZQUFhLEVBQTNDLEVBQThDOEIsT0FBOUMsQ0FBc0RaLFFBQVEsSUFBSTtFQUM5RCxZQUFJakIsU0FBUyxLQUFLLElBQWxCLEVBQXdCO0VBQ3BCaUIsVUFBQUEsUUFBUSxDQUFDTyxnQkFBVCxDQUEwQixPQUExQixFQUFtQ1IsVUFBbkM7RUFDSCxTQUZELE1BRU87RUFDSEMsVUFBQUEsUUFBUSxDQUFDTyxnQkFBVCxDQUEwQixPQUExQixFQUFtQ2hCLGlCQUFuQztFQUNIO0VBQ0osT0FORDtFQU9IO0VBQ0osR0F2RVEsRUF1RU4sQ0FBQ0osU0FBRCxFQUFZTCxZQUFaLEVBQTBCQyxTQUExQixFQUFxQ0MsUUFBckMsRUFBK0NDLElBQS9DLEVBQXFEQyxVQUFyRCxDQXZFTSxDQUFUOztFQXlFQSxNQUFJQyxTQUFKLEVBQWU7RUFDWCxXQUFPLElBQVA7RUFDSCxHQUZELE1BRU87RUFDSCxXQUFPMEI7RUFBSyxNQUFBLFNBQVMsRUFBQztFQUFmLE1BQVA7RUFDSDtFQUNKOzs7Ozs7OzsifQ==
