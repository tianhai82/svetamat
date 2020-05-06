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
export let textColor = 'text-black';
export let outlineColor = 'border-black';
export let bgColor = 'bg-transparent';

let cls = 'focus:outline-none uppercase tracking-wide ripple';

if (outlined) {
  cls += ` border border-solid ${textColor} ${outlineColor} ${bgColor} active:elevation-0`;
} else if (text) {
  cls += ` ${textColor} ${bgColor} active:elevation-0`;
} else {
  cls += ` elevation-2 active:elevation-0 ${textColor} ${bgColor}`;
}
if (rounded) {
  cls += ' rounded-full';
}
if (fab) {
  cls += ' rounded-full flex items-center justify-center';
}
if (!tile) {
  cls += ' rounded';
}

if (block) {
  cls += ' block w-full';
}

if (xs) {
  cls += ' h-5 text-xs px-2';
} else if (sm) {
  cls += ' h-6 text-sm px-3';
} else if (lg) {
  cls += ' h-10 text-lg px-5';
} else if (xl) {
  cls += ' h-12 text-xl px-6';
} else {
  cls += ' h-8 text-base px-4';
}

cls = cls.trim();

let disabledCls;
$: if (disabled) {
  disabledCls = 'opacity-25 cursor-not-allowed';
} else {
  let hover;
  if (outlined) {
    hover = 'hover:elevation-1';
  } else if (text) {
    hover = 'hover:elevation-1';
  } else {
    hover = 'hover:elevation-4';
  }
  disabledCls = ` ${hover}`;
}
</script>
<button class={`${cls} ${disabledCls}`} {disabled} on:click>
  <slot></slot>
</button>
