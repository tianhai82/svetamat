<script>
  import { createEventDispatcher } from "svelte";
  import Input from "./Input.svelte";

  const dispatch = createEventDispatcher();

  export let label = "";
  export let items = [];
  export let value = "";
  export let minCharactersToSearch = 0;
  export let noResultsText = "No results found";
  export let maxLen = undefined;
  export let clearable = false;
  export let disabled = false;
  export let hideDetails = false;

  export let borderColor = "border-gray-700";
  export let labelColor = "text-gray-700";
  export let helperText = "";
  export let helperTextColor = "";
  export let outlined = false;

  export let labelFieldName = undefined;
  export let keywordsFieldName = labelFieldName;
  export let caseSensitive = false;
  export let keywordsFunction = function (item) {
    if (item === undefined || item === null) {
      return "";
    }
    return keywordsFieldName
      ? item[keywordsFieldName].toString()
      : item.toString();
  };

  let filteredListItems = [];
  let listVisible = false;
  let itemClicked = false;
  let icon;
  let highlightIndex = -1;
  let text = "";

  $: icon = listVisible ? "arrow_drop_up" : "arrow_drop_down";

  function onInput(e) {
    const t = e.detail;
    if (t.length >= minCharactersToSearch) {
      let tempFiltered;
      if (caseSensitive) {
        tempFiltered = items.filter((it) =>
          keywordsFunction(it).includes(t)
        );
      } else{
        tempFiltered = items.filter((it) =>
          keywordsFunction(it).toLowerCase().includes(t.toLowerCase())
        );
      }
      filteredListItems = maxLen ? tempFiltered.slice(0, maxLen) : tempFiltered;
    }
  }

  $: if (value) {
    if (!items.some((it) => keywordsFunction(it) === keywordsFunction(value))) {
      value = null;
    }
  }

  $: if (value == null) {
    setText("");
  } else if (typeof value === "string") {
    setText(value || "");
  } else if (typeof value === "number") {
    setText(value == null ? "" : value);
  } else if (typeof value === "boolean") {
    setText(value == null ? "" : value);
  } else {
    setText(value[labelFieldName] == null ? "" : value[labelFieldName]);
  }

  function setText(v) {
    text = v;
  }

  function isItemSelected(item) {
    if (value === item) return true;
    return false;
  }

  function setVal(item) {
    itemClicked = false;
    listVisible = false;
    highlightIndex = -1;
    if (value !== item) {
      value = item;
      dispatch("change", item);
    } else {
      onBlur();
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
    listVisible = e.key !== "Escape";
    if (e.key === "ArrowDown") {
      highlightIndex = down(filteredListItems.length, highlightIndex);
    } else if (e.key === "ArrowUp") {
      highlightIndex = up(filteredListItems.length, highlightIndex);
    } else if (e.key === "Escape") {
      highlightIndex = -1;
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && highlightIndex < filteredListItems.length) {
        setVal(filteredListItems[highlightIndex]);
      }
    }
  }

  function onFocus(e) {
    filteredListItems = maxLen ? items.slice(0, maxLen) : items;
    listVisible = true;
    if (text) {
      e.target.selectionStart = 0;
      e.target.selectionEnd = text.toString().length;
    }
  }

  function onBlur() {
    if (itemClicked) return;
    listVisible = false;
    if (value == null) {
      text = "";
    } else if (typeof value === "string") {
      text = value || "";
    } else if (typeof value === "number") {
      text = value == null ? "" : value;
    } else if (typeof value === "boolean") {
      text = value == null ? "" : value;
    } else {
      text = value[labelFieldName] || "";
    }
    highlightIndex = -1;
  }

  function onClear() {
    value = null;
    text = "";
    dispatch("change", null);
  }
</script>

<style>
  .active {
    @apply bg-gray-300 font-medium;
  }
</style>

<div class="relative">
  <Input
    {outlined}
    {icon}
    {clearable}
    {disabled}
    {hideDetails}
    {label}
    {labelColor}
    {borderColor}
    {helperText}
    {helperTextColor}
    bind:value={text}
    on:input={onInput}
    on:keydown={handleKeydown}
    on:blur={onBlur}
    on:focus={onFocus}
    on:clear={onClear} />
  <div
    style="max-height: 320px;"
    on:mouseenter={() => (itemClicked = true)}
    on:mouseleave={() => (itemClicked = false)}
    class={`absolute bg-white rounded-sm w-full elevation-4 z-30 overflow-y-auto ${hideDetails ? 'mt-0' : '-mt-5'} ${listVisible && text.toString().length >= minCharactersToSearch ? '' : 'hidden'}`}>
    {#if filteredListItems.length > 0}
      <ul class="my-2">
        {#each filteredListItems as item, i}
          <li
            class={`p-3 cursor-pointer hover:bg-gray-200 ${highlightIndex === i ? 'bg-gray-300' : ''}`}
            class:active={isItemSelected(item)}
            on:click|stopPropagation|preventDefault={setVal(item)}>
            {labelFieldName ? item[labelFieldName] : item}
          </li>
        {/each}
      </ul>
    {:else}
      <div class="m-3" on:mousedown|stopPropagation|preventDefault>
        {noResultsText}
      </div>
    {/if}
  </div>
</div>
