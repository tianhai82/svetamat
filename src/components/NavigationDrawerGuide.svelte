<script>
  import NavigationDrawer from "../widgets/NavigationDrawer.svelte";
  import Checkbox from "../widgets/Checkbox.svelte";
  import Button from "../widgets/Button.svelte";
  import Input from "../widgets/Input.svelte";

  let visible = false;
  let modal = false;
  let marginTop = "mt-0";

  let showCode = false;
</script>

<h2 class="text-xl ml-4 font-semibold my-6">Navigation Drawer</h2>

<div class="bg-gray-200 rounded my-4 px-4 table w-full">
  <h3 class="text-lg font-bold ml-3 mt-5 mb-3">Properties</h3>
  <div class="table-row font-bold">
    <div class="table-cell py-3 px-3 border-b border-gray-400">Prop</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Description</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Type</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">Default</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">visible</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Shows or hides the navigation drawer.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">modal</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      When 'modal' is true, navigation drawer can be dismissed by clicking away.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">marginTop</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      Applies Tailwindcss margin top class to the Navigation Drawer. Accepts
      only valid Tailwindcss margin top class.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">string</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">''</div>
  </div>
</div>

<div class="bg-gray-200 rounded p-4 w-full">
  <h3 class="mx-2 mb-2 flex justify-between">
    <div class="text-lg font-bold">Demo</div>
    <Checkbox bind:checked={showCode}>Show Code</Checkbox>
  </h3>
  <NavigationDrawer bind:visible {modal} {marginTop}>
    <div class="h-full w-64 bg-yellow-800 text-white">My drawer</div>
  </NavigationDrawer>

  <div class="border border-gray-500 rounded px-3 py-4 w-full">
    <div class="flex flex-row flex-wrap">
      <div class="px-4">
        <Checkbox bind:checked={visible}>visible</Checkbox>
      </div>
      <div class="px-4">
        <Checkbox bind:checked={modal}>modal</Checkbox>
      </div>
    </div>

    <div class="w-full flex flex-row flex-wrap">
      <div class="px-4">
        <Input hideDetails outlined label="marginTop" bind:value={marginTop} />
      </div>
    </div>
  </div>
</div>

<pre
  class:hidden={!showCode}
  class="my-2 bg-gray-200 rounded p-5 font-light">
{`<NavigationDrawer bind:visible {modal} {marginTop}>
  <div class="h-full w-64 bg-yellow-800 text-white">My drawer</div>
</NavigationDrawer>`}
</pre>
