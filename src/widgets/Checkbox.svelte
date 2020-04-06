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

<label class="flex items-center {color}" class:cursor-not-allowed={disabled}
       class:cursor-pointer={!disabled} {disabled}>
  <input type="checkbox" bind:checked {disabled} on:change={handleChange}
         on:input={handleInput} hidden>
  <div
    class="select-none rounded-full hover:bg-gray-300 w-8 h-8 flex items-center justify-center">
    <span class="material-icons">
      {#if checked}
        check_box
      {:else if indeterminate}
        indeterminate_check_box
      {:else}
        check_box_outline_blank
      {/if}
    </span>
  </div>
  {#if label}
    <span>{label}</span>
  {:else}
    <slot></slot>
  {/if}
</label>

