<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    export let label = '';
    export let value = false;
    export let textColor = 'text-black';
    export let trueColor = 'bg-black';
    export let falseColor = 'bg-white';

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
.toggle__dot {
  top: -.25rem;
  left: -.25rem;
  transition: all 0.3s ease-in-out;
}

input:checked ~ .toggle__dot {
  transform: translateX(100%);
}
</style>

<label class="flex items-center {disabled?'cursor-not-allowed':'cursor-pointer'}" {disabled}>
  <div class="relative">
    <input type="checkbox" class="hidden" disabled={disabled} bind:checked={value}/>
    <div class="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
    <div class="toggle__dot absolute w-6 h-6 {value?trueColor:falseColor} rounded-full shadow inset-y-0 left-0"></div>
  </div>
    <!-- label -->
  <div class="ml-3">
    {#if label}
      <span class={textColor}>{label}</span>
    {:else}
      <slot></slot>
    {/if}
  </div>
</label>
