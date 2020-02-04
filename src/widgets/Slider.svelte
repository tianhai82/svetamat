<script>
export let value;
export let min = 0;
export let max = 1;
export let step = undefined;
export let thumbColor = 'text-blue-500';
export let trackEmptyColor = 'bg-blue-200';
export let trackFilledColor = 'bg-blue-500';

let normalisedValue;
$: normalisedValue = scaleValue(value, min, max, 0, 1);

let normalisedStep = undefined;
$: if (step != null) {
  normalisedStep = step / (max - min);
} else {
  normalisedStep = undefined;
}

let width;
let container;
let oldVal;
let dragStartX;
let mousedown = false;

function roundToStep(v, step) {
  if (step == null) {
    return v;
  }
  return Math.round(v / step) * step;
}

function scaleValue(v, oldMin, oldMax, newMin, newMax) {
  if (v < oldMin) {
    return newMin;
  }
  if (v > oldMax) {
    return newMax;
  }
  const oldRange = oldMax - oldMin;
  const newRange = newMax - newMin;
  if (oldRange <= 0 || newRange <= 0) {
    throw new Error('max should be greater than min');
  }
  return +(((v - oldMin) * newRange) / oldRange + newMin).toPrecision(12);
}

function touchStart(e) {
  if (window.PointerEvent) {
    return;
  }
  const rect = container.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left;
  const v = x / width;
  if (v < 0) {
    normalisedValue = 0;
  } else if (v > 1) {
    normalisedValue = 1;
  } else {
    normalisedValue = roundToStep(v, normalisedStep);
  }
  dragStartX = e.touches[0].screenX;
  oldVal = normalisedValue;
  value = scaleValue(normalisedValue, 0, 1, min, max);
  mousedown = true;
}

function touchMove(e) {
  if (window.PointerEvent) {
    return;
  }
  if (!mousedown) {
    return;
  }
  const change = e.touches[0].screenX - dragStartX;
  const v = change / width + oldVal;
  if (v < 0) {
    normalisedValue = 0;
  } else if (v > 1) {
    normalisedValue = 1;
  } else {
    normalisedValue = roundToStep(v, normalisedStep);
  }
  value = scaleValue(normalisedValue, 0, 1, min, max);
}

function dragStart(e) {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left; //x position within the element.
  const v = x / width;
  if (v < 0) {
    normalisedValue = 0;
  } else if (v > 1) {
    normalisedValue = 1;
  } else {
    normalisedValue = roundToStep(v, normalisedStep);
  }
  dragStartX = e.screenX;
  oldVal = normalisedValue;
  mousedown = true;
  value = scaleValue(normalisedValue, 0, 1, min, max);
  document.body.addEventListener('pointermove', dragging);
}

function dragging(e) {
  if (e.pressure === 0) {
    document.body.removeEventListener('pointermove', dragging);
    mousedown = false;
    return;
  }
  if (!mousedown) {
    return;
  }
  const change = e.screenX - dragStartX;
  const v = change / width + oldVal;
  if (v < 0) {
    normalisedValue = 0;
  } else if (v > 1) {
    normalisedValue = 1;
  } else {
    normalisedValue = roundToStep(v, normalisedStep);
  }
  value = scaleValue(normalisedValue, 0, 1, min, max);
}

function dragEnd(e) {
  document.body.removeEventListener('pointermove', dragging);
  mousedown = false;
}

let thumbSize = 0.75;
$: thumbSize = mousedown ? 1.4 : 0.75;
</script>

<style>
  .mdc-slider {
    -ms-touch-action: none;
    touch-action: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .mdc-slider__track-container {
    top: 50%;
    height: 2px;
    overflow: hidden;
  }

  .mdc-slider__track {
    -webkit-transform-origin: left top;
    -ms-transform-origin: left top;
    transform-origin: left top;
    will-change: transform;
  }

  .mdc-slider__thumb-container {
    position: absolute;
    margin-top: 7px;
    left: 0;
    width: 21px;
    height: 100%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    will-change: transform;
  }

  .mdc-slider__thumb {
    stroke-width: 3.5;
    -webkit-transition: fill 0.1s ease-out, stroke 0.1s ease-out,
    -webkit-transform 0.1s ease-out;
    -o-transition: transform 0.1s ease-out, fill 0.1s ease-out,
    stroke 0.1s ease-out;
    transition: transform 0.1s ease-out, fill 0.1s ease-out,
    stroke 0.1s ease-out, -webkit-transform 0.1s ease-out;
  }

  .mdc-slider__focus-ring {
    width: 21px;
    height: 21px;
    border-radius: 50%;
    -webkit-transition: opacity 0.26667s ease-out,
    background-color 0.26667s ease-out, -webkit-transform 0.26667s ease-out;
    -o-transition: transform 0.26667s ease-out, opacity 0.26667s ease-out,
    background-color 0.26667s ease-out;
    transition: transform 0.26667s ease-out, opacity 0.26667s ease-out,
    background-color 0.26667s ease-out, -webkit-transform 0.26667s ease-out;
  }
</style>

<div
  class="relative w-full h-8 cursor-pointer block outline-none mdc-slider"
  tabindex="0"
  role="slider"
  bind:clientWidth={width}
  bind:this={container}
  on:touchstart|stopPropagation|preventDefault={touchStart}
  on:touchmove|stopPropagation|preventDefault={touchMove}
  on:touchend|stopPropagation|preventDefault={dragEnd}
  on:pointerdown|stopPropagation|preventDefault={dragStart}
  on:pointerup|stopPropagation|preventDefault={dragEnd}>
  <div class="absolute w-full mdc-slider__track-container {trackEmptyColor}">
    <div
      class="h-full w-full absolute mdc-slider__track {trackFilledColor}"
      style="transform: scaleX({normalisedValue});"/>
  </div>
  <div
    class="mdc-slider__thumb-container"
    style="transform: translateX({width * normalisedValue}px) translateX(-50%);">
    <svg
      class="absolute left-0 top-0 fill-current {thumbColor} mdc-slider__thumb"
      style="transform: scale({thumbSize});"
      width="21"
      height="21">
      <circle cx="10.5" cy="10.5" r="7.875"/>
    </svg>
    <div
      style="transform: scale(1.125);"
      class="mdc-slider__focus-ring {trackFilledColor} hover:opacity-25
      opacity-0"/>
  </div>
</div>
