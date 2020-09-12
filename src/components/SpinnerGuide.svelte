<script>
  import Spinner from "../widgets/Spinner.svelte";
  import Button from "../widgets/Button.svelte";
  import Input from "../widgets/Input.svelte";
  import Checkbox from "../widgets/Checkbox.svelte";

  let color = "text-purple-500";
  let width = "w-8";
  let height = "h-8";

  let showCode = false;
</script>

<h2 class="text-xl ml-4 font-semibold my-6">Spinner</h2>

<div class="bg-gray-200 rounded my-4 px-4 table w-full">
  <h3 class="text-lg font-bold ml-3 mt-5 mb-3">Properties</h3>
  <div class="table-row font-bold">
    <div class="table-cell py-3 px-3 border-b border-gray-400">Prop</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Description</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Type</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Default</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">color</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The color of the spinner. Accepts valid Tailwindcss text color class.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      text-purple-500
    </div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">width</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The width of the spinner. Accepts valid Tailwindcss width class.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">w-8</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">height</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The height of the spinner. Accepts valid Tailwindcss height class.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">h-8</div>
  </div>
</div>

<div class="bg-gray-200 rounded p-4 w-full">
  <h3 class="mx-2 mb-2 flex justify-between">
    <div class="text-lg font-bold">Demo</div>
    <Checkbox bind:checked={showCode}>Show Code</Checkbox>
  </h3>
  <Spinner {color} {width} {height} />

  <div class="border border-gray-500 rounded px-3 py-4 w-full">
    <div class="w-full flex flex-row flex-wrap">
      <div class="px-4">
        <Input hideDetails outlined label="color" bind:value={color} />
      </div>
      <div class="px-4">
        <Input hideDetails outlined label="width" bind:value={width} />
      </div>
      <div class="px-4">
        <Input hideDetails outlined label="height" bind:value={height} />
      </div>
    </div>
  </div>
</div>

<pre
  class:hidden={!showCode}
  class="my-2 bg-gray-200 rounded p-5 font-light">
    {`<Spinner {color} {width} {height} />`}
</pre>
