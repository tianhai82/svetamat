<script>
  import { createEventDispatcher } from "svelte";
  import Input from "./Input.svelte";

  const dispatch = createEventDispatcher();

  export let label = "";
  export let items = [];
  export let value = [];
  export let minCharactersToSearch = 0;
  export let noResultsText = "No results found";
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

  let listVisible = false;
  let icon;
  let highlightIndex = -1;
  let text = "";

  $: icon = listVisible ? "arrow_drop_up" : "arrow_drop_down";

  function onFocus(e) {
    listVisible = true;
    searching = false;
    flattenList = [];
    if (text) {
      e.target.selectionStart = 0;
      e.target.selectionEnd = text.toString().length;
    }
  }

  $: if (value) {
    setText();
    layers = [[...items]];
    let tempList = items;
    for (let i = 0; i < value.length; i++) {
      const item = tempList.find((it) => it[keywordsFieldName] === value[i]);
      if (item && item.children && item.children.length > 0) {
        layers = [...layers, [...item.children]];
        tempList = item.children;
      } else {
        break;
      }
    }
  }

  function onClear() {
    listVisible = false;
    searching = false;
    flattenList = [];
    value = [];
    layers = [[...items]];
    text = "";
  }

  function setText() {
    text = value.join(" / ");
  }

  function itemClicked(item, i) {
    searching = false;
    flattenList = [];
    value = value.slice(0, i);
    value = [...value, item[keywordsFieldName]];
    setText();
    if (item.children && item.children.length > 0) {
      layers = layers.slice(0, i + 1);
      layers = [...layers, [...item.children]];
    } else {
      listVisible = false;
    }
  }

  let layers = [[...items]];

  let searching = false;

  function onInput(e) {
    searching = true;
    const t = e.detail;
    if (t.length >= minCharactersToSearch) {
      const baseKeyword = caseSensitive ? t : t.toLowerCase();
      flattenList = getListWithKeyword([], items, baseKeyword);
    } else {
      flattenList = [];
    }
  }

  function getListWithKeyword(keywords, tree, t) {
    let masterList = [];
    for (let i = 0; i < tree.length; i++) {
      let k = keywordsFunction(tree[i]);
      k = caseSensitive ? k : k.toLowerCase();
      const display = tree[i][keywordsFieldName];
      if (k.includes(t)) {
        const flatten = getFlatList(
          [[...keywords, display]],
          [...keywords, display],
          tree[i].children
        );
        masterList = [...masterList, ...flatten];
      } else if (tree[i].children && tree[i].children.length > 0) {
        const list = getListWithKeyword(
          [...keywords, display],
          tree[i].children,
          t
        );
        masterList = [...masterList, ...list];
      }
    }
    return masterList;
  }

  function getFlatList(masterList, keywords, children) {
    if (!children || children.length === 0) {
      return masterList;
    }
    for (let i = 0; i < children.length; i++) {
      const childKeyword = keywordsFunction(children[i]);
      if (childKeyword) {
        const childKeywords = [...keywords, children[i][keywordsFieldName]];
        masterList = [...masterList, childKeywords];
        masterList = getFlatList(
          masterList,
          childKeywords,
          children[i].children
        );
      }
    }
    return masterList;
  }

  let flattenList = [];

  function flattenListClicked(list) {
    searching = false;
    listVisible = false;
    value = [...list];
    setText();
    flattenList = [];
    layers = [[...items]];
    let tempList = items;
    for (let i = 0; i < list.length; i++) {
      const item = tempList.find((it) => it[keywordsFieldName] === list[i]);
      if (item && item.children && item.children.length > 0) {
        layers = [...layers, [...item.children]];
        tempList = item.children;
      } else {
        break;
      }
    }
  }

  let isItemSelected;
  $: isItemSelected = (item, i) => {
    if (value[i] === item[keywordsFieldName]) {
      return true;
    }
    return false;
  };

  function onBlur() {
    if (mouseover) return;
    listVisible = false;
    setText();
  }

  let mouseover;
  
  function handleKeydown(e) {
    listVisible = e.key !== "Escape";
  }
</script>

<style>
  .active {
    @apply bg-gray-300 font-medium;
  }
</style>

<div class="relative">
  <div class="relative z-20">
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
  </div>
  <div
    tabindex="0"
    on:blur={onBlur}
    on:mouseenter={() => (mouseover = true)}
    on:mouseleave={() => (mouseover = false)}
    class={`focus:outline-none absolute z-30 bg-white rounded-sm elevation-4 ${hideDetails ? 'mt-0' : '-mt-5'} ${listVisible ? '' : 'hidden'}`}>
    {#if items.length > 0 && flattenList.length === 0 && !searching}
      <div class="flex">
        {#each layers as items, i}
          <ul
            style="max-height: 320px;min-width:210px;"
            class="flex flex-col border-r my-2 overflow-y-auto">
            {#each items as item}
              <li
                class:active={isItemSelected(item, i)}
                on:click={() => itemClicked(item, i)}
                class="flex items-center justify-between hover:bg-gray-200 p-3">
                {item[labelFieldName]}
                {#if item.children && item.children.length > 0}
                  <span
                    class="material-icons ml-3 w-3">keyboard_arrow_right</span>
                {/if}
              </li>
            {/each}
          </ul>
        {/each}
      </div>
    {:else if flattenList.length > 0}
      <ul
        style="max-height: 320px;"
        class="flex flex-col border-r my-2 overflow-y-auto">
        {#each flattenList as list}
          <li
            on:click={() => flattenListClicked(list)}
            class="flex items-center justify-between hover:bg-gray-200 p-3">
            {list.join(' / ')}
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
<!--{#if listVisible}-->
<!--  <div-->
<!--    on:click={() => (listVisible = false)}-->
<!--    tabindex="-1"-->
<!--    class="bg-red-400 opacity-75 z-10 fixed focus:outline-none inset-0 h-full w-full cursor-default"></div>-->
<!--{/if}-->
