<script>
  import Button from "../widgets/Button.svelte";
  import Checkbox from "../widgets/Checkbox.svelte";
  import Input from "../widgets/Input.svelte";
  import Autocomplete from "../widgets/Autocomplete.svelte";

  let label = "Country Name";
  let items = [
    {
      countryCode: 'MYS',
      countryName: 'Malaysia',
    },
    {
      countryCode: 'JPN',
      countryName: 'Japan',
    },
    {
      countryCode: 'KOR',
      countryName: 'Korea',
    },
    {
      countryCode: "SGP",
      countryName: "Singapore",
    },
    {
      countryCode: "HKG",
      countryName: "Hong Kong",
    },
    {
      countryCode: "CHN",
      countryName: "China",
    },
  ];
  let value = "";
  let minCharactersToSearch = 0;
  let noResultsText = "No results found";
  let caseSensitive = false;
  let maxLen = undefined;
  let clearable = false;
  let disabled = false;
  let hideDetails = false;

  let borderColor = "border-gray-700";
  let labelColor = "text-gray-700";
  let helperText = "Select a country";
  let helperTextColor = "text-red-600";
  let outlined = false;

  let labelFieldName = "countryName";
  let keywordsFieldName = "countryCode";
  
  function keywordsFunction(item) {
    if (item === undefined || item === null) {
      return "";
    }
    return `${item.countryCode}|${item.countryName}`;
  }

  let showCode = false;
</script>

<h2 class="text-xl ml-4 font-semibold my-6">Auto Complete</h2>

<div class="bg-gray-200 rounded my-4 px-4 table w-full">
  <h3 class="text-lg font-bold ml-3 mt-5 mb-3">Properties</h3>
  <div class="table-row font-bold">
    <div class="table-cell py-3 px-3 border-b border-gray-400">Prop</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Description</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Type</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Default</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">label</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The label text of the auto complete input box.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">items</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The list of items to choose from. Accepts an array of strings or objects.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">array</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">[]</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">value</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The selected object/string.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      object/string
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      minCharactersToSearch
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The minimum number of characters entered to show the search result
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">number</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">0</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      noResultsText
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The text to show when no results are found
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      'No results found'
    </div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">maxLen</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The maximum number of search results shown
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">number</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">undefined</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">clearable</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Includes a clear button when 'clearable' is true
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">disabled</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Disables autocomplete box.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">hideDetails</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Hides helper text.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">borderColor</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The border color of the auto complete box. Accepts valid Tailwindcss
      border color class
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      border-gray-700
    </div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">labelColor</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The color of the label text. Accepts valid Tailwindcss text color class
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      text-gray-700
    </div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">helperText</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The helper text underneath the auto complete box.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      helperTextColor
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The color of the helper text underneath the auto complete box. Accepts
      Tailwindcss text color class
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">outlined</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Transformed this into a outlined auto complete box.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      labelFieldName
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      When an array of objects is passed to 'items', this prop specifies the
      field to display.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">undefined</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      caseSensitive
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Whether the search will be case sensitive.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      false
    </div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      keywordsFieldName
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The field to search when user types. When no value is specified, the field
      specified in labelFieldName will be used.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      *labelFieldName
    </div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      keywordsFunction
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The function to generate a keyword for each of the item in the array of
      'items' for the purpose of searching.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">function</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      <pre>
        {`function (item) {
  if (item === undefined || item === null) {
    return "";
  }
  return keywordsFieldName
    ? item[keywordsFieldName].toString()
    : item.toString();
}`}
      </pre>
    </div>
  </div>
</div>

<div class="bg-gray-200 rounded p-4 w-full">
  <h3 class="mx-2 mb-2 flex justify-between">
    <div class="text-lg font-bold">Demo</div>
    <Checkbox bind:checked={showCode}>Show Code</Checkbox>
  </h3>
  <div class="my-2">
    <Autocomplete
      {label}
      {items}
      {caseSensitive}
      bind:value
      {minCharactersToSearch}
      {noResultsText}
      {maxLen}
      {borderColor}
      {labelColor}
      {helperText}
      {helperTextColor}
      {outlined}
      {clearable}
      {disabled}
      {hideDetails}
      {labelFieldName}
      {keywordsFieldName}
      {keywordsFunction} />
  </div>
  <div class="border border-gray-500 rounded px-3 py-4 w-full">
    <div class="w-full flex flex-row flex-wrap">
      <div class="px-4">
        <Checkbox label="caseSensitive" bind:checked={caseSensitive} />
      </div>
      <div class="px-4">
        <Checkbox label="outlined" bind:checked={outlined} />
      </div>
      <div class="px-4">
        <Checkbox label="clearable" bind:checked={clearable} />
      </div>
      <div class="px-4">
        <Checkbox label="disabled" bind:checked={disabled} />
      </div>
      <div class="px-4">
        <Checkbox label="hideDetails" bind:checked={hideDetails} />
      </div>
    </div>
    <div class="w-full flex flex-row flex-wrap">
      <div class="px-4 pb-2">
        <Input hideDetails outlined label="label" bind:value={label} />
      </div>
      <div class="px-4 pb-2">
        <Input
          readonly
          hideDetails
          outlined
          label="value[keywordsFieldName]"
          value={value[keywordsFieldName]} />
      </div>
      <div class="px-4 pb-2">
        <Input
          number
          hideDetails
          outlined
          label="minCharactersToSearch"
          bind:value={minCharactersToSearch} />
      </div>
      <div class="px-4 pb-2">
        <Input
          number
          hideDetails
          outlined
          label="maxLen"
          bind:value={maxLen} />
      </div>
      <div class="px-4 pb-2">
        <Input
          hideDetails
          outlined
          label="noResultsText"
          bind:value={noResultsText} />
      </div>
      <div class="px-4 pb-2">
        <Autocomplete
          hideDetails
          outlined
          label="labelFieldName"
          items={['countryCode','countryName']}
          bind:value={labelFieldName} />
      </div>
      <div class="px-4 pb-2">
        <Autocomplete
          hideDetails
          outlined
          label="keywordsFieldName"
          items={['countryCode','countryName']}
          bind:value={keywordsFieldName} />
      </div>
      <div class="px-4 pb-2">
        <Input
          hideDetails
          outlined
          label="borderColor"
          bind:value={borderColor} />
      </div>
      <div class="px-4 pb-2">
        <Input
          hideDetails
          outlined
          label="labelColor"
          bind:value={labelColor} />
      </div>
      <div class="px-4 pb-2">
        <Input
          hideDetails
          outlined
          label="helperText"
          bind:value={helperText} />
      </div>
      <div class="px-4 pb-2">
        <Input
          hideDetails
          outlined
          label="helperTextColor"
          bind:value={helperTextColor} />
      </div>
    </div>
  </div>
</div>

<pre
  class:hidden={!showCode}
  class="my-2 bg-gray-200 rounded p-5 font-light text-sm">
{`
let items = [
  {
    countryCode: 'MYS',
    countryName: 'Malaysia',
  },
  {
    countryCode: 'JPN',
    countryName: 'Japan',
  },
  {
    countryCode: 'KOR',
    countryName: 'Korea',
  },
  {
    countryCode: "SGP",
    countryName: "Singapore",
  },
  {
    countryCode: "HKG",
    countryName: "Hong Kong",
  },
  {
    countryCode: "CHN",
    countryName: "China",
  },
];
function keywordsFunction(item) {
  if (item === undefined || item === null) {
    return "";
  }
  return (item.countryCode + "|" + item.countryName);
}

<Autocomplete
  {label}
  {items}
  {caseSensitive}
  bind:value
  {minCharactersToSearch}
  {noResultsText}
  {maxLen}
  {borderColor}
  {labelColor}
  {helperText}
  {helperTextColor}
  {outlined}
  {clearable}
  {disabled}
  {hideDetails}
  {labelFieldName}
  {keywordsFieldName}
  {keywordsFunction} />`}
</pre>
