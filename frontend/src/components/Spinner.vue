<script setup lang='ts'></script>
<template>
  <svg
    class='spinner'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
  >
    <circle class='spin-ring' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4'></circle>
    <path
      class='spin-ring-2'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    ></path>
  </svg>
</template>

<style>
.spinner {
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.5rem;
  color: lightgray;
  animation: spin 1s linear infinite;
}

.spin-ring {
  opacity: 25%;
}

.spin-ring-2 {
  opacity: 75%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>