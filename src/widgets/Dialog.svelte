<script>
import { fade, scale } from 'svelte/transition';

export let visible = false;
export let permanent = false;
</script>

{#if visible}
  <div class="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-40">
    <div class="absolute h-full w-full bg-black opacity-50"
         transition:fade="{{duration:100}}"
         on:click="{()=> {if(!permanent) visible=false}}">
    </div>
    <div class="z-40" transition:scale="{{duration:200}}">
      <slot></slot>
    </div>
  </div>
{/if}
