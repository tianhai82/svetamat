<script>
import { createEventDispatcher } from 'svelte';
import Input from './Input.svelte';

const dispatch = createEventDispatcher();

export let label = '';
export let accept = '';
export let clearable = false;
export let disabled = false;

export let borderColor = 'border-gray-700';
export let labelColor = 'text-gray-700';
export let helperText = '';
export let helperTextColor = '';
export let outlined = false;
export let icon = '';
export let hideDetails = false;
export let multiple = false;
export let value = null;

let text = '';
let fileInput;

function selectFile() {
  fileInput.value = '';
  fileInput.click();
}

$: if (!value) {
  text = '';
}

function fileSelected(e) {
  value = e.target.files;
  dispatch(e.type, e.target.files);
  text = '';
  const texts = [];

  for (let i = 0; i < e.target.files.length; i++) {
    texts.push(e.target.files[i].name);
  }
  text = texts.join(', ');
}
</script>

<Input {outlined} icon="{icon}" {clearable} {disabled} {hideDetails} readonly
       {label} {labelColor} {borderColor} {helperText} {helperTextColor}
       bind:value={text}
       on:focus
       on:blur
       on:keydown
       on:clear
       on:click={selectFile}
/>
<input type="file" {accept} {multiple} bind:this={fileInput} class="hidden"
       on:change={fileSelected}>
