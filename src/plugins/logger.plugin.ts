import { App } from "vue";

export default {
  install: (app: App) => {
    app.config.globalProperties.$log = (...args: any[]) => {
      if (args.length == 2 && typeof args[0] == "string") {
        console.log(`[${args[0]}]`, ...args.slice(1)); // [label]
      } else {
        console.log(...args);
      }
    };
  },
};

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $log: (...args: any[]) => void;
  }
}
