<script>
import { fly, fade } from 'svelte/transition';

export let modal = false;
export let visible = false;
export let marginTop = '';
</script>
{#if modal}
  {#if visible}
    <div
         class="{`flex fixed top-0 bottom-0 z-40 left-0 right-0 ${marginTop}`}">
      <div class="shadow-2xl" class:`${marginTop}`={marginTop}
           transition:fly="{{ x: -300, duration: 300 }}">
        <slot></slot>
      </div>
      <div class="w-full h-full bg-black opacity-50" transition:fade="{{duration:300}}"
           on:click={()=>visible=!visible}></div>
    </div>
  {/if}
{:else}
  {#if visible}
    <div transition:fly="{{ x: -300, duration: 300 }}"
         class="{`shadow-2xl fixed top-0 bottom-0 left-0 z-40 ${marginTop}`}">
      <slot></slot>
    </div>
  {/if}
{/if}
