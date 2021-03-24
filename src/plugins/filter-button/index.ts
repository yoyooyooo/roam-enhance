import { runPlugin } from "@/utils/common";

runPlugin("filter-button", () => {
  document.arrive(
    ".roam-app span.bp3-icon.bp3-icon-filter",
    { existing: true },
    (a: HTMLSpanElement) => {
      if (a.style.color === "rgb(168, 42, 42)") {
        a.classList.add("filtering");
      } else {
        a.classList.remove("filtering");
      }
    }
  );
});
