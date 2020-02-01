<script>
import InputStd from './InputStd.svelte';
import InputOutlined from './InputOutlined.svelte';

export let label = '';
export let value = '';
export let borderColor = 'border-blue-700';
export let labelColor = 'text-blue-700';
export let helperText = '';
export let helperTextColor = '';
export let outlined = false;
export let icon = '';

let lblColor = labelColor;
let hasFocus = false;
let labelCls = 'absolute left-0 px-2 text-sm text-gray-600';
let outlinedlabelCls = '';

$: if (hasFocus) {

} else {
  if (value.length > 0) {

  } else {

  }
}


</script>
{#if !outlined}
  <InputStd {label} bind:value={value} {borderColor} {labelColor} {helperText} {icon}
            on:focus
            on:blur
            on:keydown
            {helperTextColor} on:input/>
{:else}
  <InputOutlined {label} bind:value={value} {borderColor} {labelColor} {helperText} {icon}
                 on:focus
                 on:blur
                 on:keydown
                 {helperTextColor} on:input/>
{/if}

