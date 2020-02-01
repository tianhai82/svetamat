<script>
  import Tailwindcss from "./Tailwindcss.svelte";
  import Button from "./widgets/Button.svelte";
  import Input from "./widgets/Input.svelte";
  import Autocomplete from "./widgets/Autocomplete.svelte";
  import NavigationDrawer from "./widgets/NavigationDrawer.svelte";
  import Dialog from "./widgets/Dialog.svelte";
  import Slider from "./widgets/Slider.svelte";
  import { countries } from "./countries";

  export let name = "";
  let countrySelected = {};
  let error = "";
  let sliderValue = 10;
  $: if (name.trim().length === 0) {
    error = "Please enter a name";
  } else {
    error = "";
  }

  const fruits = ["apple", "orange", "pear", "strawberry"];
  let fruit = "";

  function countryChanged(item) {
    console.log(item);
  }

  let visible = false;
  let dialogVisible = false;
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<Tailwindcss />
<div
  class="bg-blue-800 fixed left-0 right-0 top-0 h-16 mt-0 z-10 flex items-center
  justify-between">
  <div class="flex items-center">
    <i
      class="material-icons text-white ml-6 cursor-pointer ripple"
      on:click={() => (visible = !visible)}>
      menu
    </i>
    <span class="ml-4 text-xl font-semibold text-white">Time to Trade</span>
  </div>
  <span class="mr-6 text-lg uppercase text-white">Tan Yin Loo</span>
</div>
<div class="mb-5 mt-16 lg:px-32 px-4">
  <NavigationDrawer bind:visible marginTop="mt-16">
    <div class="w-56 bg-red-100 h-full">
      <h3 class="font-medium px-6 pb-3 pt-4 tracking-wide text-gray-900">
        Menu
      </h3>
      <ul class="">
        <li on:click|preventDefault
          class="px-4 py-3 hover:bg-gray-200 text-gray-800 text-sm tracking-wide">
          Stock Analysis
        </li>
        <li on:click|preventDefault
          class="px-4 py-3 hover:bg-gray-200 text-gray-800 text-sm tracking-wide">
          Subscriptions
        </li>
      </ul>
    </div>
  </NavigationDrawer>
  <div class="flex flex-row-reverse">
    <Button
      text
      textColor="text-gray-900"
      on:click={() => (dialogVisible = !dialogVisible)}>
      Toggle
    </Button>
  </div>
  <Button on:click={() => (sliderValue = 10)} bgColor="bg-purple-300">
    Reset Slider Value
  </Button>
  <div>
    {sliderValue}
    <input
      class="w-full"
      bind:value={sliderValue}
      type="range"
      min="9"
      max="11"
      step="0.03" />

    <Slider
      min={9}
      max={11}
      step={0.03}
      bind:value={sliderValue}
      thumbColor="text-red-600"
      trackEmptyColor="bg-red-200"
      trackFilledColor="bg-red-600" />
  </div>

  <h1>
    Hello {countrySelected.name ? countrySelected.name : 'No country selected'}!
  </h1>
  <Button textColor="text-white" bgColor="bg-orange-500">Normal Button</Button>
  <Button
    textColor="text-orange-500"
    outlineColor="border-orange-500"
    outlined
    rounded>
    Normal Button
  </Button>
  <Button textColor="text-orange-500" text>Normal Button</Button>
  <div>fruit: {fruit}</div>
  <Autocomplete
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Nameol"
    bind:value={fruit}
    items={fruits} />
  <Input
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Namewertyu uiou"
    icon="search"
    helperText={error}
    helperTextColor="text-red-500"
    bind:value={name} />
  <Button textColor="text-white" bgColor="bg-orange-500" rounded>
    Normal Button
  </Button>
  {name} {error}
  <Input
    outlined
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Namewert"
    icon="search"
    helperText={error}
    helperTextColor="text-red-500"
    bind:value={name} />
  <Input
    outlined
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Namewert Country here is very long"
    icon="search"
    helperText={error}
    helperTextColor="text-red-500"
    bind:value={name} />
  <Dialog bind:visible={dialogVisible} permanent>
    <div class="p-6 bg-gray-100 w-64 rounded">
      <div class="flex flex-col">
        <div class="mb-4">Huat lah!!!</div>
        <Button
          on:click={() => (dialogVisible = false)}
          outlined
          outlineColor="border-green-600"
          textColor="text-green-600">
          Close
        </Button>
      </div>
    </div>
  </Dialog>
  <Autocomplete
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Nameol"
    bind:value={countrySelected}
    items={countries}
    keywordsFunction={it => `${it.name.toLowerCase()}|^|${it.code.toLowerCase()}`}
    labelFieldName="name"
    minCharactersToSearch={1}
    on:change={countryChanged}
    outlined />

  <!--    <Input borderColor="border-green-600" labelColor="text-red-700" label="Name"-->
  <!--           helperText={error} helperTextColor="text-red-500" bind:value={name}/>-->

  <Button textColor="text-white" bgColor="bg-orange-500" rounded>
    Normal Button
  </Button>
  {name} {error}
  <Input
    outlined
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="b"
    icon="search"
    helperText={error}
    helperTextColor="text-red-500"
    bind:value={name} />
  <Input
    outlined
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Name"
    icon="search"
    helperText={error}
    helperTextColor="text-red-500"
    bind:value={name} />
</div>
