<script>
    import Button from "../widgets/Button.svelte";
    import Checkbox from "../widgets/Checkbox.svelte";
    import Toggle from "../widgets/Toggle.svelte";
    import Input from "../widgets/Input.svelte";
  
    let label = "Toggle with label";
    let value = false;
    
    let textColor = "text-green-500";
    let trueColor = "bg-red-600";
    let falseColor = "bg-blue-600";

    let disabled = false;
  
    let showCode = false;
  </script>
  
  <h2 class="text-xl ml-4 font-semibold my-6">Toggle</h2>
  
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
        The label text of the toggle.
      </div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
    </div>
    <div class="table-row">
      <div class="table-cell py-3 px-3 border-b border-gray-400">value</div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">
        The value of the checkbox.
      </div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
    </div>

    <div class="table-row">
      <div class="table-cell py-3 px-3 border-b border-gray-400">textColor</div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">
        The color of the label. Accepts Tailwindcss text color
      </div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">text-black</div>
    </div>
    <div class="table-row">
      <div class="table-cell py-3 px-3 border-b border-gray-400">trueColor</div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">
        The color of the toggle when value is true. Accepts Tailwindcss background color
      </div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">bg-red-600</div>
    </div>
    <div class="table-row">
      <div class="table-cell py-3 px-3 border-b border-gray-400">falseColor</div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">
        The color of the toggle when value is false. Accepts Tailwindcss background color
      </div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
      <div class="table-cell py-3 px-3 border-b border-gray-400">bg-red-100</div>
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
      <Toggle
        label={label}
        bind:value
        textColor={textColor}
        trueColor={trueColor}
        falseColor={falseColor}
        disabled={disabled} />
    </div>
    <div class="border border-gray-500 rounded px-3 py-4 w-full">
      <div class="w-full flex flex-row flex-wrap">
        <div class="px-4">
          <Checkbox label="value" bind:checked={value} />
        </div>
        <div class="px-4">
          <Checkbox label="disabled" bind:checked={disabled} />
        </div>
      </div>
      <div class="w-full flex flex-row flex-wrap">
        <div class="px-4 pb-2">
          <Input hideDetails outlined label="label" bind:value={label} />
        </div>
        <div class="px-4 pb-2">
          <Input hideDetails outlined label="textColor" bind:value={textColor} />
        </div>
        <div class="px-4 pb-2">
          <Input hideDetails outlined label="trueColor" bind:value={trueColor} />
        </div>
        <div class="px-4 pb-2">
          <Input hideDetails outlined label="falseColor" bind:value={falseColor} />
        </div>
      </div>
    </div>
  </div>
  
  <pre
    class:hidden={!showCode}
    class="my-2 bg-gray-200 rounded p-5 font-light">
  {``}
  </pre>
  