<script>
import { onMount } from 'svelte';
import { tweened } from 'svelte/motion';
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

export let label = '';
export let value = '';
export let number = false;
export let borderColor = 'border-blue-700';
export let labelColor = 'text-blue-700';
export let helperText = '';
export let helperTextColor = '';
export let icon = '';

let hasFocus = false;
let iconCls = '';

const y = tweened(0.75, {
  duration: 50,
});

let type = 'text';
$: if (number) type = 'number';

function handleInput(event) {
  switch (type) {
    case 'text':
      value = event.target.value;
      break;
    case 'number':
      value = +event.target.value;
  }
  dispatch('input', value);
}

$: labelTopPadding = `margin-top:${$y}rem;`;
$: helperTextCls = `text-sm px-2 font-light h-5 ${helperTextColor}`;

let fieldsetCls = 'relative rounded border border-gray-500';
let labelCls = 'absolute left-0 px-2 text-gray-600 pointer-events-none';
let inputPadBottom = 'padding-bottom:8px';

let labelElement;
let legendStyle = '';
let labelWidth;
onMount(() => {
  labelWidth = labelElement.offsetWidth * 7 / 8 + 5;
  iconCls = icon ? 'absolute right-0 bottom-0 pb-3 pr-2 material-icons md-18 pointer-events-none' : 'hidden';
});

function setFieldSetColor(prefix) {
  fieldsetCls = `${prefix} ${borderColor}`;
}

function setLabelColor(prefix) {
  labelCls = `${prefix} ${labelColor}`;
}

let valueEmpty = false;
$: valueEmpty = value == null || value.toString().length === 0;

$: if (hasFocus) {
  setLabelColor('absolute left-0 px-2 text-sm pointer-events-none');
  setFieldSetColor('relative rounded border-2');
  y.set(-1.2);
  legendStyle = `width:${labelWidth}px;margin-left:6px;`;
  inputPadBottom = 'margin-bottom:4px';
} else {
  fieldsetCls = 'relative rounded border border-gray-500 hover:border-gray-900';
  inputPadBottom = 'margin-bottom:5px;';
  if (valueEmpty) {
    legendStyle = '';
    labelCls = 'absolute left-0 ml-2 pointer-events-none text-gray-600';
    y.set(0);
  } else {
    labelCls = 'absolute left-0 px-2 text-sm pointer-events-none text-gray-600';
    legendStyle = `width:${labelWidth}px;margin-left:6px;`;
    y.set(-1.2);
  }
}
</script>
<fieldset
  class="{fieldsetCls}">
  <legend class="text-sm" style="{legendStyle}">&#8203</legend>
  <label
    bind:this={labelElement}
    style={labelTopPadding}
    class={labelCls}>
    {label}
  </label>
  <input {type}
         {value}
         on:input={handleInput}
         on:focus="{() => hasFocus=true}"
         on:blur="{() => hasFocus=false}"
         on:focus
         on:blur
         on:keydown
         style="{inputPadBottom}"
         class="h-8 appearance-none bg-transparent border-none w-full
         text-gray-800 px-2 focus:outline-none"/>
  <i class="{iconCls}">{icon}</i>
</fieldset>
<div class={helperTextCls}>{helperText}</div>
