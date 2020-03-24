<script>
export let label = '';
export let checked = false;
export let color = 'text-black';
export let disabled = false;

</script>

<style>
  .checkbox {
    display: inline-block;
    padding: 10px 20px;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  .checkbox label {
    padding-left: 0;
  }

  .checkbox input[type=checkbox] {
    opacity: 0;
    position: absolute;
    margin: 0;
    z-index: -1;
    width: 0;
    height: 0;
    overflow: hidden;
    left: 0;
    pointer-events: none;
  }

  .checkbox .checkbox-material {
    vertical-align: middle;
    position: relative;
    top: 3px;
  }

  .checkbox .checkbox-material:before {
    position: absolute;
    left: 8px;
    top: 2px;
    content: "";
    background-color: rgba(0, 0, 0, 0.5);
    height: 4px;
    width: 4px;
    border-radius: 100%;
    z-index: 1;
    opacity: 0;
    margin: 0;
  }

  .checkbox .checkbox-material .check {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid;
    border-radius: 2px;
    overflow: hidden;
    z-index: 1;
  }

  .checkbox .checkbox-material .check:before {
    position: absolute;
    content: "";
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    display: block;
    margin-top: -4px;
    margin-left: 6px;
    width: 0;
    height: 0;
    box-shadow: 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0 inset;
    -webkit-animation: checkbox-off 0.3s forwards ease-out;
    animation: checkbox-off 0.3s forwards ease-out;
  }

  .checkbox input[type=checkbox]:focus + .checkbox-material .check:after {
    opacity: 0.2;
  }

  .checkbox input[type=checkbox]:checked + .checkbox-material .check:before {
    box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 20px -12px 0 11px;
    -webkit-animation: checkbox-on 0.3s forwards ease-out;
    animation: checkbox-on 0.3s forwards ease-out;
  }

  .checkbox input[type=checkbox]:not(:checked) + .checkbox-material:before {
    -webkit-animation: rippleOff 700ms forwards ease-out;
    animation: rippleOff 700ms forwards ease-out;
  }

  .checkbox input[type=checkbox]:checked + .checkbox-material:before {
    -webkit-animation: rippleOn 700ms forwards ease-out;
    animation: rippleOn 700ms forwards ease-out;
  }

  .checkbox input[type=checkbox]:not(:checked) + .checkbox-material .check:after {
    -webkit-animation: rippleOff 700ms forwards ease-out;
    animation: rippleOff 700ms forwards ease-out;
  }

  .checkbox input[type=checkbox]:checked + .checkbox-material .check:after {
    -webkit-animation: rippleOn 700ms forwards ease-out;
    animation: rippleOn 700ms forwards ease-out;
  }

  .checkbox label[disabled=true] {
    opacity: 0.5;
  }

  .checkbox input[type=checkbox][disabled]:not(:checked) ~ .checkbox-material .check:before,
  .checkbox input[type=checkbox][disabled] + .circle {
    opacity: 0.5;
  }

  .checkbox input[type=checkbox][disabled] + .checkbox-material .check:after {
    background-color: rgba(0, 0, 0, 0.84);
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  @-webkit-keyframes checkbox-on {
    0% {
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 15px 2px 0 11px;
    }
    50% {
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 20px 2px 0 11px;
    }
    100% {
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 20px -12px 0 11px;
    }
  }

  @keyframes checkbox-on {
    0% {
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 15px 2px 0 11px;
    }
    50% {
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 20px 2px 0 11px;
    }
    100% {
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 20px -12px 0 11px;
    }
  }

  @-webkit-keyframes checkbox-off {
    0% {
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 20px -12px 0 11px, 0 0 0 0 inset;
    }
    25% {
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 20px -12px 0 11px, 0 0 0 0 inset;
    }
    50% {
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      margin-top: -4px;
      margin-left: 6px;
      width: 0px;
      height: 0px;
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 15px 2px 0 11px, 0 0 0 0 inset;
    }
    51% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
      margin-top: -2px;
      margin-left: -2px;
      width: 20px;
      height: 20px;
      box-shadow: 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0px 0px 0 10px inset;
    }
    100% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
      margin-top: -2px;
      margin-left: -2px;
      width: 20px;
      height: 20px;
      box-shadow: 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0px 0px 0 0px inset;
    }
  }

  @keyframes checkbox-off {
    0% {
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 20px -12px 0 11px, 0 0 0 0 inset;
    }
    25% {
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 20px -12px 0 11px, 0 0 0 0 inset;
    }
    50% {
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      margin-top: -4px;
      margin-left: 6px;
      width: 0px;
      height: 0px;
      box-shadow: 0 0 0 10px, 10px -10px 0 10px, 32px 0px 0 20px, 0px 32px 0 20px, -5px 5px 0 10px, 15px 2px 0 11px, 0 0 0 0 inset;
    }
    51% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
      margin-top: -2px;
      margin-left: -2px;
      width: 20px;
      height: 20px;
      box-shadow: 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0px 0px 0 10px inset;
    }
    100% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
      margin-top: -2px;
      margin-left: -2px;
      width: 20px;
      height: 20px;
      box-shadow: 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0 0 0, 0 0px 0 0px inset;
    }
  }

  @-webkit-keyframes rippleOn {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(13, 13);
      transform: scale(13, 13);
    }
  }

  @keyframes rippleOn {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(13, 13);
      transform: scale(13, 13);
    }
  }

  @-webkit-keyframes rippleOff {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(13, 13);
      transform: scale(13, 13);
    }
  }

  @keyframes rippleOff {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(13, 13);
      transform: scale(13, 13);
    }
  }

</style>
<div class="checkbox">
  <label class="{color}" class:cursor-not-allowed={disabled} class:cursor-pointer={!disabled} {disabled}>
    <input type="checkbox" bind:checked {disabled} on:change on:input>
    <span class="checkbox-material">
      <span class="check"></span>
    </span>
    {#if label}<span class="ml-1">{label}</span>{/if}
    <slot></slot>
  </label>
</div>
