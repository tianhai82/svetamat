<script>
  import Tailwindcss from "./Tailwindcss.svelte";
  import NavigationDrawer from "./widgets/NavigationDrawer.svelte";
  import Github from "./svg/Github.svelte";
  import Installation from "./components/Installation.svelte";
  import ButtonGuide from "./components/ButtonGuide.svelte";
  import DialogGuide from "./components/DialogGuide.svelte";
  import NavigationDrawerGuide from "./components/NavigationDrawerGuide.svelte";
  import ProgressGuide from "./components/ProgressGuide.svelte";
  import SpinnerGuide from "./components/SpinnerGuide.svelte";
  import InputGuide from "./components/InputGuide.svelte";
  import CheckboxGuide from "./components/CheckboxGuide.svelte";
  import FileInputGuide from "./components/FileInputGuide.svelte";
  import TextAreaGuide from "./components/TextAreaGuide.svelte";
  import SliderGuide from "./components/SliderGuide.svelte";
  import AutocompleteGuide from "./components/AutocompleteGuide.svelte";
  import CascaderGuide from "./components/CascaderGuide.svelte";

  const items = [
    { text: "Installation", component: Installation },
    { text: "Button", component: ButtonGuide },
    { text: "Dialog", component: DialogGuide },
    { text: "Navigation Drawer", component: NavigationDrawerGuide },
    { text: "Progress", component: ProgressGuide },
    { text: "Spinner", component: SpinnerGuide },
    { text: "Input", component: InputGuide },
    { text: "Text Area", component: TextAreaGuide },
    { text: "File Input", component: FileInputGuide },
    { text: "Checkbox", component: CheckboxGuide },
    { text: "Slider", component: SliderGuide },
    { text: "Auto Complete", component: AutocompleteGuide },
    { text: "Cascader", component: CascaderGuide },
  ];
  let selectedComponent = { text: "Cascader", component: CascaderGuide };
</script>

<style>
</style>

<Tailwindcss />
<div class="h-full flex flex-col">
  <div
    class="bg-teal-100 flex-shrink-0 h-16 mt-0 z-40 flex items-center
      justify-between elevation-4 static">
    <div class="flex items-center">
      <span class="ml-6 text-xl font-semibold text-blue-900">SVETAMAT</span>
    </div>
    <a
      class="flex items-center mr-6"
      href="https://github.com/tianhai82/svetamat">
      <Github />
    </a>
  </div>
  <div class="flex-grow flex flex-row h-0">
    <div
      class="h-full w-56 bg-gray-700 text-gray-100 overflow-y-auto flex-shrink-0">
      <ul class="mx-3 py-3">
        {#each items as item}
          <li
            on:click={() => (selectedComponent = item)}
            class={`px-4 py-3 my-1 ${selectedComponent.text === item.text ? 'rounded bg-gray-600 text-white font-medium tracking-wide' : 'cursor-pointer'}`}>
            {item.text}
          </li>
        {/each}
      </ul>
    </div>

    <div class="h-full flex-grow px-4 pt-2 overflow-y-auto">
      <svelte:component this={selectedComponent.component} />
    </div>
  </div>
</div>
