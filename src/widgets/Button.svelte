<script>
  export let text = false;
  export let fab = false;
  export let outlined = false;
  export let rounded = false;
  export let tile = false;
  export let block = false;
  export let xs = false;
  export let sm = false;
  export let lg = false;
  export let xl = false;
  export let disabled = false;
  export let textColor = "text-black";
  export let outlineColor = "border-black";
  export let bgColor = "bg-transparent";

  let baseCls = "focus:outline-none uppercase tracking-wide";
  let cls = "";
  $: {
    let tempCls = "";
    if (outlined) {
      tempCls =
        baseCls +
        ` border border-solid ${textColor} ${outlineColor} ${bgColor}`;
    } else if (text) {
      tempCls = baseCls + ` ${textColor} ${bgColor}`;
    } else {
      tempCls = baseCls + ` elevation-2 ${textColor} ${bgColor}`;
    }

    if (rounded) {
      tempCls += " rounded-full";
    }
    if (fab) {
      tempCls += " rounded-full flex items-center justify-center";
    }
    if (!tile) {
      tempCls += " rounded";
    }

    if (block) {
      tempCls += " block w-full";
    }

    if (xs) {
      tempCls += " h-5 text-xs px-2";
    } else if (sm) {
      tempCls += " h-6 text-sm px-3";
    } else if (lg) {
      tempCls += " h-10 text-lg px-5";
    } else if (xl) {
      tempCls += " h-12 text-xl px-6";
    } else {
      tempCls += " h-8 text-base px-4";
    }

    cls = tempCls.trim();
  }
  let disabledCls;
  $: if (disabled) {
    disabledCls = "opacity-25 cursor-not-allowed";
  } else {
    let hover;
    if (outlined) {
      hover = "hover:elevation-1";
    } else if (text) {
      hover = "hover:elevation-1";
    } else {
      hover = "hover:elevation-4";
    }
    disabledCls = `${hover} active:elevation-0 ripple`;
  }
</script>

<button class={`${cls} ${disabledCls}`} {disabled} on:click>
  <slot />
</button>
