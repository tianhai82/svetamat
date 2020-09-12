<script>
  import Button from "../widgets/Button.svelte";
  import Checkbox from "../widgets/Checkbox.svelte";
  import Input from "../widgets/Input.svelte";

  let text = false;
  let fab = false;
  let outlined = false;
  let rounded = false;
  let tile = false;
  let block = false;
  let xs = false;
  let sm = false;
  let lg = false;
  let xl = false;
  let disabled = false;
  let textColor = "text-white";
  let outlineColor = "border-black";
  let bgColor = "bg-red-700";

  let showCode = false;
</script>

<h2 class="text-xl ml-4 font-semibold my-6">Button</h2>

<div class="bg-gray-200 rounded my-4 px-4 table w-full">
  <h3 class="text-lg font-bold ml-3 mt-5 mb-3">Properties</h3>
  <div class="table-row font-bold">
    <div class="table-cell py-3 px-3 border-b border-gray-400">Prop</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Description</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Type</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Default</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">text</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Removes the elevation.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">fab</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Floating Action Button.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">outlined</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Removes the elevation and applies a thin border
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">rounded</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Applies a large border radius on the button.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">tile</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Removes the component's border-radius.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">block</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Expands the button to 100% of available space.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">xs</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Extra small button
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">sm</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Small button
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">lg</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Large button
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">xl</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Extra large button
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">disabled</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Removes the ability to click or target the component.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">textColor</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Applies Tailwindcss text color to the button. Accepts only valid Tailwindcss
      text color class
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">text-black</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      outlineColor
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Applies Tailwindcss border color to the button. Accepts only valid
      Tailwindcss border color class
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      border-black
    </div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3">bgColor</div>
    <div class="table-cell py-3 px-3">
      Applies Tailwindcss background color to the button. Accepts only valid
      Tailwindcss background color class
    </div>
    <div class="table-cell py-3 px-3">string</div>
    <div class="table-cell py-3 px-3">bg-transparent</div>
  </div>
</div>

<div class="bg-gray-200 rounded p-4 w-full">
  <h3 class="mx-2 mb-2 flex justify-between">
    <div class="text-lg font-bold">Demo</div>
    <Checkbox bind:checked={showCode}>Show Code</Checkbox>
  </h3>

  <div class="flex flex-col">
    <div class="flex items-center mb-4">
      <Button
        {text}
        {fab}
        {outlined}
        {rounded}
        {tile}
        {block}
        {xs}
        {sm}
        {lg}
        {xl}
        {disabled}
        {textColor}
        {outlineColor}
        {bgColor}
        on:click={() => alert("Hello World!")}>
        Demo Button
      </Button>
    </div>
    <div class="border border-gray-500 rounded px-3 py-4 w-full">
      <div class="flex flex-row flex-wrap mb-3">
        <div class="px-4">
          <Checkbox bind:checked={text}>text</Checkbox>
        </div>
        <div class="px-4">
          <Checkbox bind:checked={fab}>fab</Checkbox>
        </div>
        <div class="px-4">
          <Checkbox bind:checked={outlined}>outlined</Checkbox>
        </div>
        <div class="px-4">
          <Checkbox bind:checked={rounded}>rounded</Checkbox>
        </div>
        <div class="px-4">
          <Checkbox bind:checked={tile}>tile</Checkbox>
        </div>
        <div class="px-4">
          <Checkbox bind:checked={block}>block</Checkbox>
        </div>
        <div class="px-4">
          <Checkbox bind:checked={xs}>xs</Checkbox>
        </div>
        <div class="px-4">
          <Checkbox bind:checked={sm}>sm</Checkbox>
        </div>
        <div class="px-4">
          <Checkbox bind:checked={lg}>lg</Checkbox>
        </div>
        <div class="px-4">
          <Checkbox bind:checked={xl}>xl</Checkbox>
        </div>
        <div class="px-4">
          <Checkbox bind:checked={disabled}>disabled</Checkbox>
        </div>
      </div>
      <div
        class="w-full flex flex-row flex-wrap">
        <div class="px-4">
          <Input hideDetails outlined label="textColor" bind:value={textColor} />
        </div>
        <div class="px-4">
          <Input hideDetails outlined label="outlineColor" bind:value={outlineColor} />
        </div>
        <div class="px-4">
          <Input hideDetails outlined label="bgColor" bind:value={bgColor} />
        </div>
      </div>
    </div>
  </div>
</div>

<pre
  class:hidden={!showCode}
  class="my-2 bg-gray-200 rounded p-5 font-light">
{`<Button
  {text}
  {fab}
  {outlined}
  {rounded}
  {tile}
  {block}
  {xs}
  {sm}
  {lg}
  {xl}
  {disabled}
  {textColor}
  {outlineColor}
  {bgColor}
  on:click={() => alert("Hello World!")}>
  Demo Button
</Button>`}
  </pre>
