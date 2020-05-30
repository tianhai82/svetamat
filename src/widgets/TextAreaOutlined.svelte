<script>
import { onMount } from 'svelte';
import { tweened } from 'svelte/motion';
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

export let label = '';
export let value = '';
export let number = false;
export let borderColor = 'border-gray-700';
export let labelColor = 'text-gray-700';
export let helperText = '';
export let helperTextColor = '';
export let icon = '';
export let clearable = false;
export let disabled = false;
export let hideDetails = false;
export let readonly = false;
export let height;

let hasFocus = false;
let iconCls = '';
let boxWidth;

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

$: labelTranslateStyle = `transform:translateY(${$y}rem);`;
$: helperTextCls = `text-sm px-2 font-light h-5 ${helperTextColor}`;

let fieldsetCls = 'border border-gray-500';
let labelCls = 'text-gray-600 ';

let legendStyle = '';
let labelWidth;
onMount(() => {
  iconCls = icon ? 'material-icons md-18 pointer-events-none' : 'hidden';
});

function setFocusState() {
  labelCls = `text-sm ${labelColor} `;
  y.set(-1.35);
  fieldsetCls = `border-2 ${borderColor} `;
}

function setFieldsetCls(cls) {
  fieldsetCls = cls + ' ';
}

function setLabelCls(cls) {
  labelCls = cls + ' ';
}

function setLegendStyle(style) {
  legendStyle = style;
}

$: if (labelWidth) {
  if (!hasFocus && (value == null || value.toString().length === 0)) {
    setLegendStyle('');
  } else {
    setLegendStyle(`width:${labelWidth + 4}px;margin-left:6px;`);
  }
}


$: if (hasFocus) {
  setFocusState();
} else {
  if (!disabled) {
    setFieldsetCls('border border-gray-500 hover:border-gray-900');
  } else {
    setFieldsetCls('border');
  }
  if (value == null || value.toString().length === 0) {
    setLabelCls('text-gray-600');
    y.set(-0.15);
  } else {
    setLabelCls('text-sm text-gray-600');
    y.set(-1.35);
  }
}

function clear() {
  value = '';
  dispatch('clear');
}
</script>
<div class="flex flex-col" bind:clientWidth={boxWidth}>
  <fieldset {disabled}
            class="{`${fieldsetCls}relative rounded`}" class:opacity-50={disabled}>
    <legend style="{legendStyle}">&#8203</legend>
    <label
      bind:clientWidth={labelWidth}
      style={`${labelTranslateStyle} max-width:${boxWidth-16}px;`}
      class={`${labelCls}absolute left-0 mx-2 pointer-events-none truncate`}>
      {label}
    </label>
    <div class="flex justify-between">
      <textarea {type} {readonly}
             {value} {disabled}
             on:input={handleInput}
             on:focus="{() => hasFocus=true}"
             on:blur="{() => hasFocus=false}"
             on:focus
             on:blur
             on:keydown
             on:click
             style="padding-bottom: 3px;"
             class="{`appearance-none bg-transparent border-none w-full
         text-gray-800 px-2 focus:outline-none ${height}`}"/>
      <div class="float-right flex items-center mr-2">
        <i class="{clearable&&!disabled?'material-icons md-18 mr-2 cursor-pointer':''}"
           class:hidden={!clearable || disabled}
           on:click={clear}>clear</i>
        <i class="{iconCls}" class:opacity-50={disabled}>{icon}</i>
      </div>
    </div>
  </fieldset>
  {#if !hideDetails}
    <div class={helperTextCls}>{helperText}</div>
  {/if}
</div>
