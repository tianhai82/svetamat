<script>
import InputStd from './InputStd.svelte';
import InputOutlined from './InputOutlined.svelte';

export let label = '';
export let value = '';
export let number = false;
export let borderColor = 'border-gray-700';
export let labelColor = 'text-gray-700';
export let helperText = '';
export let helperTextColor = '';
export let outlined = false;
export let icon = '';
export let clearable = false;
export let disabled = false;
export let hideDetails = false;
export let readonly = false;

</script>
{#if !outlined}
  <InputStd {label} bind:value={value} {borderColor} {labelColor} {helperText} {icon}
            {number} {clearable} {disabled} {hideDetails} {readonly}
            on:focus
            on:blur
            on:keydown
            on:clear
            on:click
            {helperTextColor} on:input/>
{:else}
  <InputOutlined {label} bind:value={value} {borderColor} {labelColor} {helperText} {icon}
                 {number} {clearable} {disabled} {hideDetails} {readonly}
                 on:focus
                 on:blur
                 on:keydown
                 on:clear
                 on:click
                 {helperTextColor} on:input/>
{/if}

