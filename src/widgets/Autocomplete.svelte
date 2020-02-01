<script>
import { createEventDispatcher } from 'svelte';
import Input from './Input.svelte';

const dispatch = createEventDispatcher();

export let label = '';
export let items = [];
export let value = '';
export let minCharactersToSearch = 0;
export let noResultsText = 'No results found';
export let maxLen = undefined;

export let borderColor = 'border-blue-700';
export let labelColor = 'text-blue-700';
export let helperText = '';
export let helperTextColor = '';
export let outlined = false;

export let labelFieldName = undefined;
export let keywordsFieldName = labelFieldName;
export let keywordsFunction = function (item) {
  if (item === undefined || item === null) {
    return '';
  }
  return keywordsFieldName ? item[keywordsFieldName] : item;
};

let filteredListItems = [];
let text = '';
let listVisible = false;
let itemClicked = false;
let icon;
let highlightIndex = -1;

$: icon = listVisible ? 'arrow_drop_up' : 'arrow_drop_down';
$: {
  if (text.length >= minCharactersToSearch) {
    const tempFiltered = items.filter(it => keywordsFunction(it)
      .includes(text.toLowerCase()));
    filteredListItems = maxLen ? tempFiltered.slice(0, maxLen) : tempFiltered;
  }
}

function setVal(item) {
  itemClicked = false;
  listVisible = false;
  highlightIndex = -1;
  if (value !== item) {
    value = item;
    dispatch('change', item);
  }
  if (typeof item === 'string') {
    text = item;
  } else {
    text = item[labelFieldName];
  }
}

function up(listSize, currentIndex) {
  if (currentIndex === 0 || currentIndex === -1) {
    return listSize - 1;
  }
  return currentIndex - 1;
}

function down(listSize, currentIndex) {
  if (currentIndex === listSize - 1) {
    return 0;
  }
  return currentIndex + 1;
}

function handleKeydown(e) {
  listVisible = e.key !== 'Escape';
  if (e.key === 'ArrowDown') {
    highlightIndex = down(filteredListItems.length, highlightIndex);
  } else if (e.key === 'ArrowUp') {
    highlightIndex = up(filteredListItems.length, highlightIndex);
  } else if (e.key === 'Escape') {
    highlightIndex = -1;
  } else if (e.key === 'Enter') {
    if (highlightIndex >= 0 && highlightIndex < filteredListItems.length) {
      setVal(filteredListItems[highlightIndex]);
    }
  }
}

function onFocus(e) {
  listVisible = true;
  if (text) {
    e.target.selectionStart = 0;
    e.target.selectionEnd = text.length;
  }
}

function onBlur() {
  if (itemClicked) return;
  listVisible = false;
  if (typeof value === 'string') {
    text = value || '';
  } else {
    text = value[labelFieldName] || '';
  }
  highlightIndex = -1;
}
</script>

<div class="relative">
  <Input {outlined} icon="{icon}"
         bind:value={text}
         {label} {labelColor} {borderColor} {helperText} {helperTextColor}
         on:keydown={handleKeydown}
         on:blur={onBlur}
         on:focus="{onFocus}"/>
  <div style="max-height: 320px;"
        on:mouseenter={()=> itemClicked = true}
        on:mouseleave={()=> itemClicked = false}
       class="absolute -mt-4 bg-white rounded-sm w-full shadow-lg z-10 overflow-y-auto {listVisible
      && text.length>=minCharactersToSearch ? '' : 'hidden'}">
    {#if filteredListItems.length>0}
      <ul class="my-2">
        {#each filteredListItems as item,i}
          <li
            class="{`p-3 cursor-pointer hover:bg-gray-200 ${highlightIndex===i?'bg-gray-300':''}`}"
            on:click|stopPropagation|preventDefault={setVal(item)}>{labelFieldName? item[labelFieldName]: item}</li>
        {/each}
      </ul>
    {:else}
      <div class="m-3" on:mousedown|stopPropagation|preventDefault>{noResultsText}</div>
    {/if}
  </div>
</div>
