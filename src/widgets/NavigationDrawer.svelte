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
      <div class="w-full h-full fixed left-0 bg-black opacity-50 z-30" transition:fade="{{duration:300}}"
           on:click={()=>visible=!visible}>
      </div>
      <div class="elevation-8 z-40" class:`${marginTop}`={marginTop}
           transition:fly="{{ x: -300, duration: 300 }}">
        <slot></slot>
      </div>
    </div>
  {/if}
{:else}
  {#if visible}
    <div transition:fly="{{ x: -300, duration: 300 }}"
         class="{`elevation-8 fixed top-0 bottom-0 left-0 z-40 ${marginTop}`}">
      <slot></slot>
    </div>
  {/if}
{/if}
