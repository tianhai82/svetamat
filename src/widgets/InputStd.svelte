<script>
import { onMount } from 'svelte';
import { tweened } from 'svelte/motion';

export let label = '';
export let value = '';
export let borderColor = 'border-blue-700';
export let labelColor = 'text-blue-700';
export let helperText = '';
export let helperTextColor = '';
export let icon = '';

let hasFocus = false;
let iconCls = '';

onMount(() => {
  iconCls = icon ? 'absolute right-0 top-0 mt-5 mr-2 material-icons md-18 pointer-events-none' : 'hidden';
});

const y = tweened(1, {
  duration: 50,
});

$: labelTopPadding = `padding-top:${$y}rem;`;
$: helperTextCls = `text-sm px-2 font-light h-5 ${helperTextColor}`;

let labelCls = 'absolute left-0 px-2 text-sm text-gray-600 pointer-events-none';
let inputPadBottom = '';

function setLabelColor(prefix) {
  labelCls = `${prefix} ${labelColor}`;
}

let valueEmpty = false;
$: valueEmpty = !value || value.length === 0;

$: if (hasFocus) {
  y.set(0.25);
  setLabelColor('absolute left-0 px-2 text-sm pointer-events-none');
  inputPadBottom = 'padding-bottom:7px';
} else {
  inputPadBottom = 'padding-bottom:8px';
  labelCls = 'absolute left-0 px-2 text-sm pointer-events-none text-gray-600';
  if (valueEmpty) {
    y.set(1);
    labelCls = 'absolute left-0 px-2 pointer-events-none text-gray-600';
  } else {
    y.set(0.25);
  }
}
</script>

<div
  class="{hasFocus?
  `relative rounded-t border-b-2 bg-gray-300 ${borderColor}`:
  `relative rounded-t border-b border-gray-500 hover:border-gray-900 hover:bg-gray-100`}">
  <label
    style={labelTopPadding}
    class={labelCls}>
    {label}
  </label>
  <input type="text"
         bind:value={value}
         on:input
         on:focus="{() => hasFocus=true}"
         on:blur="{() => hasFocus=false}"
         on:focus
         on:blur
         on:keydown
         style="{inputPadBottom}"
         class="pt-6 appearance-none bg-transparent border-none w-full
         text-gray-800 px-2 focus:outline-none"/>
  <i class="{iconCls}">{icon}</i>
</div>
<div class={helperTextCls}>{helperText}</div>
