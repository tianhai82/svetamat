<script>
  import TextAreaStd from "./TextAreaStd.svelte";
  import TextAreaOutlined from "./TextAreaOutlined.svelte";

  export let label = "";
  export let value = "";
  export let number = false;
  export let borderColor = "border-gray-700";
  export let labelColor = "text-gray-700";
  export let helperText = "";
  export let helperTextColor = "";
  export let outlined = false;
  export let icon = "";
  export let clearable = false;
  export let disabled = false;
  export let hideDetails = false;
  export let readonly = false;
  export let height = "h-20";
</script>

{#if !outlined}
  <TextAreaStd
    {height}
    {label}
    bind:value
    {borderColor}
    {labelColor}
    {helperText}
    {icon}
    {number}
    {clearable}
    {disabled}
    {hideDetails}
    {readonly}
    on:focus
    on:blur
    on:keydown
    on:clear
    on:click
    {helperTextColor}
    on:input />
{:else}
  <TextAreaOutlined
    {height}
    {label}
    bind:value
    {borderColor}
    {labelColor}
    {helperText}
    {icon}
    {number}
    {clearable}
    {disabled}
    {hideDetails}
    {readonly}
    on:focus
    on:blur
    on:keydown
    on:clear
    on:click
    {helperTextColor}
    on:input />
{/if}
