<script>
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

const progress = tweened(0, {
  duration: 200,
  easing: cubicOut,
});

export let trackColor = 'bg-red-200';
export let fillColor = 'bg-blue-500';
export let height = 'h-1';
</script>

<style>
  .mdc-slider__track-container {
    overflow: hidden;
  }

  .mdc-slider__track {
    -webkit-transform-origin: left top;
    -ms-transform-origin: left top;
    transform-origin: left top;
    will-change: transform;
  }

  .mdc-slider__track.move {
    animation: increase 2s infinite;
  }

  @keyframes increase {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(200%);
    }
  }
</style>

<div
  class="relative w-full {height} block outline-none flex items-center">
  <div class="absolute w-full mdc-slider__track-container {trackColor} {height}">
    <div
      class="h-full w-1/2 absolute mdc-slider__track {fillColor} move"/>
  </div>
</div>
