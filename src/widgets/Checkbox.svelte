<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

export let label = '';
export let checked = false;
export let indeterminate = false;
export let color = 'text-black';
export let disabled = false;

function handleChange(e) {
  indeterminate = false;
  dispatch('change', e.target.checked);
}

function handleInput(e) {
  indeterminate = false;
  dispatch('input', e.target.checked);
}

</script>

<style>

</style>

<label class="h-12 flex items-center {color}" class:cursor-not-allowed={disabled}
       class:cursor-pointer={!disabled} {disabled}>
  <input type="checkbox" bind:checked {disabled} on:change={handleChange}
         on:input={handleInput} hidden>
  <span
    class="material-icons hover:rounded-full hover:bg-gray-300 hover:h-8 hover:w-8 flex w-8 items-center justify-center">
    {#if checked}
      check_box
    {:else if indeterminate}
      indeterminate_check_box
    {:else}
      check_box_outline_blank
    {/if}
  </span>
  {#if label}
    <span>{label}</span>
  {:else}
    <slot></slot>
  {/if}
</label>

