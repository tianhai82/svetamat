<script>
import Tailwindcss from './Tailwindcss.svelte';
import Button from './widgets/Button.svelte';
import Checkbox from './widgets/Checkbox.svelte';
import Input from './widgets/Input.svelte';
import Autocomplete from './widgets/Autocomplete.svelte';
import NavigationDrawer from './widgets/NavigationDrawer.svelte';
import Dialog from './widgets/Dialog.svelte';
import Slider from './widgets/Slider.svelte';
import { countries } from './countries';
import Spinner from './widgets/Spinner.svelte';
import Progress from './widgets/Progress.svelte';
import Cascader from './widgets/Cascader.svelte';

export let name = '';
let countrySelected = {};
let error = '';
let sliderValue = 10;
let sliderValue2 = 10;
$: if (!name || name.trim().length === 0) {
  error = 'Please enter a name';
} else {
  error = '';
}

const fruits = ['APPLE', 'ORANGE', 'PEAR', 'STRAWBERRY'];
let fruit = 'APPLE';
let num = 54.1;

function countryChanged(item) {
  console.log(item);
}

let visible = false;
let dialogVisible = false;
let year = 2016;
let boo;
let v = '';

const sectors = [
  { text: 'Finance' },
  { text: 'Healthcare' },
  {
    text: 'Energy',
    children: [
      {
        text: 'Oil & Gas',
        children: [
          {
            text: 'Oil',
          }, {
            text: 'Gas',
          },
        ],
      }, {
        text: 'Natural Gas',
      },
    ],
  },
  {
    text: 'Information Technology',
    children: [
      {
        text: 'Software',
        children: [
          {
            text: 'C++',
          }, {
            text: 'Python',
          },
        ],
      }, {
        text: 'Hardware',
        children: [
          {
            text: 'Network Equipment',
          }, {
            text: 'Silicon Chips',
          },
        ],
      },
    ],
  },
];
let sectorSelection = [];
let disabled = true;
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<Tailwindcss/>
<div
  class="bg-pink-100 fixed left-0 right-0 top-0 h-16 mt-0 z-10 flex items-center
  justify-between elevation-4">
  <div class="flex items-center">
    <i
      class="material-icons text-gray-900 ml-6 cursor-pointer ripple"
      on:click={() => (visible = !visible)}>
      menu
    </i>
    <span class="ml-4 text-xl font-semibold text-gray-900">Time to Trade</span>
  </div>
  <span class="mr-6 text-lg uppercase text-gray-900">Tan Yin Loo</span>
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
    <Spinner/>
    <Button
      text
      textColor="text-gray-900"
      on:click={() => (dialogVisible = !dialogVisible)}>
      Toggle
    </Button>
    <Button
      text
      textColor="text-gray-900"
      on:click={() => (disabled = !disabled)}>
      Disabled
    </Button>
    <Checkbox bind:checked="{visible}" color="text-red-800"
              on:input={(e)=>console.log(e.detail)} label="show navi"></Checkbox>
    <Checkbox color="text-yellow-600" indeterminate
              on:input={(e)=>console.log(e.detail)} label="indet"></Checkbox>
  </div>
  <table class="table-auto w-full h-full pb-5">
    <tr>
      <td class="border px-2 py-1 items-center text-center">
        <Checkbox color="text-yellow-600" indeterminate
                  on:input={(e)=>console.log(e.detail)}></Checkbox>
      </td>
      <td class="border px-2 py-1 items-center text-center">
        <Checkbox color="text-yellow-600" indeterminate
                  on:input={(e)=>console.log(e.detail)}>Test
        </Checkbox>
      </td>
      <td class="border px-2 py-1 text-center w-24">
        a very long text from nethelands and the united states of America
      </td>
    </tr>
  </table>

  {sectorSelection}
  <Cascader outlined clearable label="Cascader Box" items="{sectors}"
            bind:value={sectorSelection}
            labelFieldName="text"></Cascader>
  <Autocomplete
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Nameol"
    clearable
    bind:value={fruit}
    items={fruits}></Autocomplete>
  <Cascader outlined clearable label="Cascader Box" items="{sectors}"
            bind:value={sectorSelection}
            labelFieldName="text"></Cascader>
  <Autocomplete
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Nameol"
    clearable
    bind:value={fruit}
    items={fruits}></Autocomplete>
  <Progress/>
  <Progress/>
  <Button on:click={() => (sliderValue = 10)} bgColor="bg-purple-300">
    Reset Slider Value
  </Button>
  <div>

    <input type="range" min="9" max="20" class="w-full mb-5">
    <input type="range" min="9" max="20" class="w-full">

    <Slider
      min={9}
      max={11}
      bind:value={sliderValue}
      thumbColor="text-red-600"
      trackEmptyColor="bg-red-200"
      trackFilledColor="bg-red-600"/>
    {sliderValue}    {sliderValue2}
    <Slider
      min={9}
      max={11}
      bind:value={sliderValue2}
      thumbColor="text-red-600"
      trackEmptyColor="bg-red-200"
      trackFilledColor="bg-red-600"/>
  </div>

  <h1>
    Hello {countrySelected && countrySelected.name ? countrySelected.name : 'No country selected'}
    !
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
  <Button on:click={()=> fruit = ''}>Clear Fruit</Button>
  <div>fruit: {fruit?fruit:''}</div>

  <Autocomplete
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Numbers"
    on:change={(e)=>console.log(e)}
    bind:value={year}
      items={[2016,2017,2018]} ></Autocomplete>
  <Autocomplete
    clearable
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Booleans"
    on:change={(e)=>console.log(e)}
    bind:value={boo}
      items={[true,false]}></Autocomplete>
  <Input
    clearable {disabled}
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Namewertyu uiou"
    icon="search"
    helperText={error}
    helperTextColor="text-red-500"
    bind:value={v}/>
  <Button textColor="text-white" bgColor="bg-orange-500" rounded>
    Normal Button
  </Button>
  {name} {error}
  <Input
    outlined
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="number only"
    number {disabled}
    on:input={(e)=>console.log(e)}
    icon="search"
    helperText={error}
      helperTextColor="text-red-500"
    bind:value={num}/>
  {num}
  <Input
    outlined {disabled}
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Namewert Country here is very long"
    icon="search"
    helperText={error}
    helperTextColor="text-red-500"
    bind:value={name}/>
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
    keywordsFunction="{it => `${it.name.toLowerCase()}|^|${it.code.toLowerCase()}`}"
    labelFieldName="name"
    minCharactersToSearch={1}
    on:change={countryChanged}
    outlined/>

  <!--    <Input borderColor="border-green-600" labelColor="text-red-700" label="Name"-->
  <!--           helperText={error} helperTextColor="text-red-500" bind:value={name}/>-->

  <Button textColor="text-white" bgColor="bg-orange-500" rounded>
    Normal Button
  </Button>
  <Input
    outlined
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Name"
    icon="search"
    helperText={error}
    helperTextColor="text-red-500"
    bind:value={name}/>
  {name} {error}
  <Input
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="b"
    icon="search"
    helperText={error}
    helperTextColor="text-red-500"
    bind:value={name}/>
  <Input
    outlined
    borderColor="border-green-600"
    labelColor="text-red-700"
    label="Name2"
    icon="search"
    helperText={error}
    helperTextColor="text-red-500"
    bind:value={name}/>
</div>
