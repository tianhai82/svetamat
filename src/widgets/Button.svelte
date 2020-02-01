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
export let textColor = 'text-black';
export let outlineColor = 'border-black';
export let bgColor = 'bg-transparent';

let cls = 'focus:outline-none uppercase tracking-wide ripple';

if (outlined) {
  cls += ` border border-solid ${textColor} ${outlineColor} ${bgColor} hover:shadow-lg active:shadow-none`;
} else if (text) {
  cls += ` ${textColor} ${bgColor} hover:shadow-lg active:shadow-inner`;
} else {
  cls += ` shadow-md hover:shadow-xl active:shadow-none ${textColor} ${bgColor}`;
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
</script>
<button class={cls} on:click>
  <slot></slot>
</button>
