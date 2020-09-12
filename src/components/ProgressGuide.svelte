<script>
  import Progress from "../widgets/Progress.svelte";
  import Button from "../widgets/Button.svelte";
  import Input from "../widgets/Input.svelte";
  import Checkbox from "../widgets/Checkbox.svelte";

  let trackColor = "bg-red-200";
  let fillColor = "bg-blue-500";
  let height = "h-1";

  let showCode = false;
</script>

<h2 class="text-xl ml-4 font-semibold my-6">Progress</h2>

<div class="bg-gray-200 rounded my-4 px-4 table w-full">
  <h3 class="text-lg font-bold ml-3 mt-5 mb-3">Properties</h3>
  <div class="table-row font-bold">
    <div class="table-cell py-3 px-3 border-b border-gray-400">Prop</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Description</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Type</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Default</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">trackColor</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The background color of the progress bar. Accepts valid Tailwindcss
      background color class.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">bg-red-200</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">fillColor</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The color of the moving part of the progress bar. Accepts valid
      Tailwindcss background color class.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">bg-blue-500</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">height</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The height of the progress bar. Accepts valid Tailwindcss height class.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">h-1</div>
  </div>
</div>


<div class="bg-gray-200 rounded p-4 w-full">
    <h3 class="mx-2 mb-2 flex justify-between">
      <div class="text-lg font-bold">Demo</div>
      <Checkbox bind:checked={showCode}>Show Code</Checkbox>
    </h3>
    <Progress {trackColor} {fillColor} {height}>
    </Progress>
  
    <div class="border border-gray-500 rounded px-3 py-4 w-full">
      <div class="w-full flex flex-row flex-wrap">
        <div class="px-4">
          <Input hideDetails outlined label="trackColor" bind:value={trackColor} />
        </div>
        <div class="px-4">
          <Input hideDetails outlined label="fillColor" bind:value={fillColor} />
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
  {`<Progress {trackColor} {fillColor} {height}>
</Progress>`}
  </pre>
  