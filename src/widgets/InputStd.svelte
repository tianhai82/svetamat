<script>
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let label = "";
  export let value = "";
  export let number = false;
  export let borderColor = "border-gray-700";
  export let labelColor = "text-gray-700";
  export let helperText = "";
  export let helperTextColor = "";
  export let icon = "";
  export let clearable = false;
  export let disabled = false;
  export let hideDetails = false;
  export let readonly = false;
  export let password = false;
  export let date = false;

  let hasFocus = false;
  let iconCls = "";
  let boxWidth;

  $: iconCls = icon ? "material-icons md-18 pointer-events-none" : "hidden";

  const y = tweened(1, {
    duration: 50
  });

  let type = "text";
  $: if (password) {
    type = "password";
  } else if (number) {
    type = "number";
  } else if (date) {
    type = "date";
  } else {
    type = "text";
  }

  function handleInput(event) {
    switch (type) {
      case "text":
        value = event.target.value;
        break;
      case "number":
        value = +event.target.value;
      default:
        value = event.target.value;
    }
    dispatch("input", value);
  }

  $: labelTopPadding = `transform:translateY(${$y}rem);`;
  $: helperTextCls = `text-sm px-2 font-light h-5 ${helperTextColor}`;

  let labelCls =
    "absolute left-0 px-2 text-sm text-gray-600 pointer-events-none";
  let inputPadBottom = "";

  function setLabelColor(prefix) {
    labelCls = `${prefix} ${labelColor}`;
  }

  let valueEmpty = false;
  $: valueEmpty = value == null || value.toString().length === 0;

  $: if (hasFocus) {
    y.set(0.25);
    setLabelColor("absolute left-0 px-2 text-sm pointer-events-none");
    inputPadBottom = "padding-bottom:7px";
  } else {
    inputPadBottom = "padding-bottom:8px";
    labelCls = "absolute left-0 px-2 text-sm pointer-events-none text-gray-600";
    if (type !== "date" && valueEmpty) {
      y.set(1);
      labelCls = "absolute left-0 px-2 pointer-events-none text-gray-600";
    } else {
      y.set(0.25);
    }
  }

  function clear() {
    value = "";
    dispatch("clear");
  }
</script>

<style>
  .disabled {
    @apply border-b border-dashed;
  }
</style>

<div class="flex flex-col" bind:clientWidth={boxWidth}>
  <div
    class:opacity-50={disabled}
    class:disabled
    class={hasFocus ? `relative rounded-t border-b-2 bg-gray-300 ${borderColor}` : `relative rounded-t border-b border-gray-500${disabled ? '' : ' hover:border-gray-900 hover:bg-gray-100'}`}>
    <label
      style={`${labelTopPadding} max-width:${boxWidth}px;`}
      class={`${labelCls} truncate`}>
      {label}
    </label>
    <div class="flex justify-between">
      <input
        {type}
        {readonly}
        {value}
        {disabled}
        on:input={handleInput}
        on:focus={() => (hasFocus = true)}
        on:blur={() => (hasFocus = false)}
        on:focus
        on:blur
        on:keydown
        on:keyup
        on:click
        style={inputPadBottom}
        class="pt-6 appearance-none bg-transparent border-none w-full
        text-gray-800 px-2 focus:outline-none" />
      <div class="float-right flex items-center mr-2 mt-3">
        <i
          class={clearable && !disabled ? 'material-icons md-18 mr-2 cursor-pointer' : ''}
          class:hidden={!clearable || disabled}
          on:click={clear}>
          clear
        </i>
        <i class={iconCls} class:opacity-50={disabled}>{icon}</i>
      </div>
    </div>
  </div>
  {#if !hideDetails}
    <div class={helperTextCls}>{helperText}</div>
  {/if}
</div>
