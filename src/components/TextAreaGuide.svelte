<script>
  import Button from "../widgets/Button.svelte";
  import Checkbox from "../widgets/Checkbox.svelte";
  import Input from "../widgets/Input.svelte";
  import TextArea from "../widgets/TextArea.svelte";

  let label = "Enter Your Name";
  let value = "Peter Piper";
  let number = false;
  let borderColor = "border-gray-700";
  let labelColor = "text-gray-700";
  let helperText = "";
  let helperTextColor = "text-red-600";
  let outlined = false;
  let icon = "spellcheck";
  let clearable = false;
  let disabled = false;
  let hideDetails = false;
  let readonly = false;
  let height = "h-20";

  let showCode = false;
</script>

<h2 class="text-xl ml-4 font-semibold my-6">Text Area</h2>

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
      The label text of the text area.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">value</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The value of the text area.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">number</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Specifies whether it's a number type text area.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">borderColor</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The border color of the text area. Accepts valid Tailwindcss border color
      class
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
      The helper text underneath the text area.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      helperTextColor
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The color of the helper text underneath the text area. Accepts Tailwindcss
      text color class
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">outlined</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Transformed this into a outlined text area.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">icon</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The icon to display on the right of the text area. <br /> Accepts a material
      icon from this list <a
        class="text-blue-600"
        href="https://material.io/resources/icons/?style=baseline">https://material.io/resources/icons/?style=baseline</a>
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
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
      Disables text area.
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
    <div class="table-cell py-3 px-3 border-b border-gray-400">readonly</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Makes text area readonly
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">height</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Height of the text area. Accepts Tailwindcss height class.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">h-20</div>
  </div>
</div>

<div class="bg-gray-200 rounded p-4 w-full">
  <h3 class="mx-2 mb-2 flex justify-between">
    <div class="text-lg font-bold">Demo</div>
    <Checkbox bind:checked={showCode}>Show Code</Checkbox>
  </h3>
  <div class="my-2">
    <TextArea
      {label}
      bind:value
      {number}
      {borderColor}
      {labelColor}
      {helperText}
      {helperTextColor}
      {outlined}
      {icon}
      {clearable}
      {disabled}
      {hideDetails}
      {readonly}
      {height} />
  </div>
  <div class="border border-gray-500 rounded px-3 py-4 w-full">
    <div class="w-full flex flex-row flex-wrap">
      <div class="px-4">
        <Checkbox label="number" bind:checked={number} />
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
      <div class="px-4">
        <Checkbox label="readonly" bind:checked={readonly} />
      </div>
    </div>
    <div class="w-full flex flex-row flex-wrap">
      <div class="px-4 pb-2">
        <Input hideDetails outlined label="label" bind:value={label} />
      </div>
      <div class="px-4 pb-2">
        <Input hideDetails outlined label="value" bind:value />
      </div>
      <div class="px-4 pb-2">
        <Input hideDetails outlined label="icon" bind:value={icon} />
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
      <div class="px-4 pb-2">
        <Input hideDetails outlined label="height" bind:value={height} />
      </div>
    </div>
  </div>
</div>

<pre
  class:hidden={!showCode}
  class="my-2 bg-gray-200 rounded p-5 font-light">
  {`<TextArea
  {label}
  bind:value
  {number}
  {borderColor}
  {labelColor}
  {helperText}
  {helperTextColor}
  {outlined}
  {icon}
  {clearable}
  {disabled}
  {hideDetails}
  {readonly}
  {height} />`}
  </pre>
