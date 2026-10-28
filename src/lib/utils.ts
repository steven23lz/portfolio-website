import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let supportsDisplayTransition: boolean | undefined

export function canTransitionDisplay(): boolean {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition
  if (
    typeof window === "undefined" ||
    !window.CSS?.supports?.("transition-behavior", "allow-discrete") ||
    !document.body
  ) {
    return false
  }
  const probe = document.createElement("div")
  probe.style.cssText =
    "transition: display 1s allow-discrete !important; display: block;"
  document.body.appendChild(probe)
  getComputedStyle(probe).display
  probe.style.display = "none"
  supportsDisplayTransition = getComputedStyle(probe).display === "block"
  probe.remove()
  return supportsDisplayTransition
}

export function supportsTopLayerExit(): boolean {
  return (
    typeof window !== "undefined" &&
    Boolean(window.CSS?.supports?.("overlay", "auto")) &&
    canTransitionDisplay()
  )
}

export async function closeTopLayer(element: HTMLDialogElement): Promise<void> {
  if (!supportsTopLayerExit()) {
    element.setAttribute("data-closing", "")
    const animations = element.getAnimations({ subtree: true })
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 2000)),
      ])
    }
    if (!element.hasAttribute("data-closing")) return
    element.removeAttribute("data-closing")
  }
  if (element.open) {
    element.close()
  }
}

export async function hideDiscreteElement(el: HTMLElement): Promise<void> {
  if (canTransitionDisplay()) {
    el.hidden = true
  } else {
    el.setAttribute("data-closing", "")
  }

  const animations = el.getAnimations()
  if (animations.length > 0) {
    await Promise.race([
      Promise.allSettled(animations.map((a) => a.finished)),
      new Promise((r) => setTimeout(r, 2000)),
    ])
  }

  if (el.hasAttribute("data-closing")) {
    el.removeAttribute("data-closing")
    el.hidden = true
  }
}

export function showDiscreteElement(el: HTMLElement): void {
  el.removeAttribute("data-closing")
  el.hidden = false
}
