<script>
  import Button from "../widgets/Button.svelte";
  import Checkbox from "../widgets/Checkbox.svelte";
  import Input from "../widgets/Input.svelte";

  let label1 = "Checkbox with label";
  let checked1 = false;
  let indeterminate1 = false;
  let color1 = "text-green-500";
  let disabled1 = false;

  let checked2 = false;
  let indeterminate2 = false;
  let color2 = "text-red-700";
  let disabled2 = false;

  let showCode = false;
</script>

<h2 class="text-xl ml-4 font-semibold my-6">Checkbox</h2>

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
      The label text of the checkbox.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">checked</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The checked status of the checkbox.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      indeterminate
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Whether the checked status is indeterminate.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">color</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The color of the checkbox and its label. Accepts Tailwindcss text color
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">text-black</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">disabled</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Whether the checkbox is disabled.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
</div>

<div class="bg-gray-200 rounded p-4 w-full">
  <h3 class="mx-2 mb-2 flex justify-between">
    <div class="text-lg font-bold">Demo</div>
    <Checkbox bind:checked={showCode}>Show Code</Checkbox>
  </h3>
  <div class="mt-2 mb-1">
    <Checkbox
      label={label1}
      bind:checked={checked1}
      bind:indeterminate={indeterminate1}
      color={color1}
      disabled={disabled1} />
  </div>
  <div class="border border-gray-500 rounded px-3 py-4 w-full">
    <div class="w-full flex flex-row flex-wrap">
      <div class="px-4">
        <Checkbox label="checked" bind:checked={checked1} />
      </div>
      <div class="px-4">
        <Checkbox label="indeterminate" bind:checked={indeterminate1} />
      </div>
      <div class="px-4">
        <Checkbox label="disabled" bind:checked={disabled1} />
      </div>
    </div>
    <div class="w-full flex flex-row flex-wrap">
      <div class="px-4 pb-2">
        <Input hideDetails outlined label="label" bind:value={label1} />
      </div>
      <div class="px-4 pb-2">
        <Input hideDetails outlined label="color" bind:value={color1} />
      </div>
    </div>
  </div>

  <div class="mb-1 mt-6">
    <Checkbox
      bind:checked={checked2}
      bind:indeterminate={indeterminate2}
      color={color2}
      disabled={disabled2}>
      <i class="material-icons text-blue-700">facebook</i>
      <span class="text-orange-500">Checkbox with slot</span>
    </Checkbox>
  </div>
  <div class="border border-gray-500 rounded px-3 py-4 w-full">
    <div class="w-full flex flex-row flex-wrap">
      <div class="px-4">
        <Checkbox label="checked" bind:checked={checked2} />
      </div>
      <div class="px-4">
        <Checkbox label="indeterminate" bind:checked={indeterminate2} />
      </div>
      <div class="px-4">
        <Checkbox label="disabled" bind:checked={disabled2} />
      </div>
    </div>
    <div class="w-full flex flex-row flex-wrap">
      <div class="px-4 pb-2">
        <Input hideDetails outlined label="color" bind:value={color2} />
      </div>
    </div>
  </div>
</div>

<pre
  class:hidden={!showCode}
  class="my-2 bg-gray-200 rounded p-5 font-light">
{`<Checkbox
  label={label1}
  bind:checked={checked1}
  bind:indeterminate={indeterminate1}
  color={color1}
  disabled={disabled1} />
    
<Checkbox
  bind:checked={checked2}
  bind:indeterminate={indeterminate2}
  color={color2}
  disabled={disabled2}>
  <i class="material-icons text-blue-700">facebook</i>
  <span class="text-orange-500">Checkbox with slot</span>
</Checkbox>`}
</pre>
