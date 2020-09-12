<script>
  import Dialog from "../widgets/Dialog.svelte";
  import Checkbox from "../widgets/Checkbox.svelte";
  import Button from "../widgets/Button.svelte";

  let visible = false;
  let permanent = false;

  let textColor = "text-white";
  let bgColor = "bg-blue-600";

  let showCode = false;
</script>

<h2 class="text-xl ml-4 font-semibold my-6">Dialog</h2>

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
      Shows or hides the dialog.
    </div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">boolean</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">false</div>
  </div>
  <div class="table-row">
    <div class="table-cell py-3 px-3 border-b border-gray-400">permanent</div>
    <div class="table-cell py-3 px-3 border-b border-gray-400">
      When 'permanent' is true, dialog is not dismissable by clicking away.
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

  <Dialog bind:visible bind:permanent>
    <div class="bg-white p-4 rounded">
      <div class="font-semibold text-lg p-3">My Dialog</div>
      <div class="p-3">
        <Button
          outlineColor="border-green-700"
          textColor="text-green-700"
          outlined
          on:click={() => (visible = false)}>
          Close
        </Button>
      </div>
    </div>
  </Dialog>

  <div class="border border-gray-500 rounded px-3 py-4 w-full">
    <div class="flex flex-row flex-wrap">
      <div class="px-4">
        <Checkbox bind:checked={visible}>visible</Checkbox>
      </div>
      <div class="px-4">
        <Checkbox bind:checked={permanent}>permanent</Checkbox>
      </div>
    </div>
  </div>
</div>

<pre
  class:hidden={!showCode}
  class="my-2 bg-gray-200 rounded p-5 font-light">
{`<div class="bg-gray-200 rounded p-4 w-full">
    <h3 class="text-lg font-bold ml-2 flex justify-between">
        Demo
        <Checkbox bind:checked={showCode}>Show Code</Checkbox>
    </h3>

    <Dialog bind:visible bind:permanent>
        <div class="bg-white p-4 rounded">
        <div class="font-semibold text-lg p-3">My Dialog</div>
        <div class="p-3">
            <Button
            outlineColor="border-green-700"
            textColor="text-green-700"
            outlined
            on:click={() => (visible = false)}>
            Close
            </Button>
        </div>
        </div>
    </Dialog>

    <div class="border border-gray-500 rounded px-3 py-4 w-full">
        <div class="flex flex-row flex-wrap">
        <div class="px-4">
            <Checkbox bind:checked={visible}>visible</Checkbox>
        </div>
        <div class="px-4">
            <Checkbox bind:checked={permanent}>permanent</Checkbox>
        </div>
        </div>
    </div>
</div>`}
</pre>
