<script>
  import Button from "../widgets/Button.svelte";
  import Checkbox from "../widgets/Checkbox.svelte";
  import Input from "../widgets/Input.svelte";
  import Slider from "../widgets/Slider.svelte";

  let value = 0.5;
  let min = 0;
  let max = 1;
  let step = 0.02;
  let thumbColor = "text-red-500";
  let trackEmptyColor = "bg-blue-200";
  let trackFilledColor = "bg-blue-600";

  let showCode = false;
</script>

<h2 class="text-xl ml-4 font-semibold my-6">Slider</h2>

<div class="bg-gray-200 rounded my-4 px-4 table w-full">
  <h3 class="text-lg font-bold ml-3 mt-5 mb-3">Properties</h3>
  <div class="table-row font-bold">
    <div class="table-cell py-3 px-3 border-b border-gray-400">Prop</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Description</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Type</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Default</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">value</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The value of the slider
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">number</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">undefined</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">max</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The max value of the slider
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">number</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">1</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">min</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The min value of the slider
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">number</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">0</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">step</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The size of each movement of the slider
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">number</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">undefined</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">thumbColor</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The color of the slider thumb. Accepts a valid Tailwindcss text color
      class.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      text-blue-500
    </div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      trackEmptyColor
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The color of the empty slider track. Accepts a valid Tailwindcss
      background color class.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">bg-blue-200</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      trackFilledColor
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      The color of the filled slider track. Accepts a valid Tailwindcss
      background color class.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">bg-blue-500</div>
  </div>
</div>

<div class="bg-gray-200 rounded p-4 w-full">
  <h3 class="mx-2 mb-2 flex justify-between">
    <div class="text-lg font-bold">Demo</div>
    <Checkbox bind:checked={showCode}>Show Code</Checkbox>
  </h3>
  <div class="my-2">
    <Slider
      bind:value
      {min}
      {max}
      {step}
      {thumbColor}
      {trackEmptyColor}
      {trackFilledColor} />
  </div>
  <div class="border border-gray-500 rounded px-3 py-4 w-full">
    <div class="w-full flex flex-row flex-wrap">
      <div class="px-4 pb-2">
        <Input number hideDetails outlined label="value" bind:value />
      </div>
      <div class="px-4 pb-2">
        <Input number hideDetails outlined label="max" bind:value={max} />
      </div>
      <div class="px-4 pb-2">
        <Input number hideDetails outlined label="min" bind:value={min} />
      </div>
      <div class="px-4 pb-2">
        <Input number hideDetails outlined label="step" bind:value={step} />
      </div>
      <div class="px-4 pb-2">
        <Input
          hideDetails
          outlined
          label="thumbColor"
          bind:value={thumbColor} />
      </div>
      <div class="px-4 pb-2">
        <Input
          hideDetails
          outlined
          label="trackEmptyColor"
          bind:value={trackEmptyColor} />
      </div>
      <div class="px-4 pb-2">
        <Input
          hideDetails
          outlined
          label="trackFilledColor"
          bind:value={trackFilledColor} />
      </div>
    </div>
  </div>
</div>

<pre
  class:hidden={!showCode}
  class="my-2 bg-gray-200 rounded p-5 font-light">
{`<Slider
  bind:value
  {min}
  {max}
  {step}
  {thumbColor}
  {trackEmptyColor}
  {trackFilledColor} />`}
</pre>
